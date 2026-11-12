/* D4.7 · Régua de cobrança — funções puras (sem DOM).
   P = parâmetros da carteira (dataset carteira, chave→valor), E = estágios da régua (dataset estagios),
   S = controles {i1..i5 (intensidade 0–100), fee, cessao}. R$ mil, mês. */
(function (root) {
  const M = {};
  M.FAIXAS = 5;
  M.V = (P) => P.vendasPrazoAno / 12;
  M.emDia = (P) => M.V(P) * P.prazoContratual / 30;
  M.porDia = (P) => P.vendasPrazoAno / 360;
  M.int = (S) => [S.i1, S.i2, S.i3, S.i4, S.i5];
  // roll rates e recuperação efetivas: base × multiplicadores de intensidade (Spec §3)
  M.efetivas = function (P, E, S) {
    const R = { r0: P.r0, r1: P.r1, r2: P.r2, r3: P.r3, r4: P.r4, rec: P.recuperacao };
    const I = M.int(S);
    E.forEach((e, k) => {
      const x = I[k] / 100 - 0.5;
      R[e.alvo] *= 1 - e.amp * x;
      if (e.ampRec) R.rec *= 1 + e.ampRec * x;
    });
    return R;
  };
  // um mês de migração (Spec §5); s = [s1..s5]
  M.passo = function (P, R, s) {
    const V = M.V(P), q = P.saidaFaixa;
    const n = [V * R.r0, s[0] * R.r1, s[1] * R.r2, s[3] * (1 - q) + s[2] * R.r3, s[4] * (1 - q) + s[3] * q * R.r4];
    const baixa = s[4] * q;
    return { s: n, baixa, perda: baixa * (1 - R.rec), recup: baixa * R.rec };
  };
  M.aging0 = (P) => [P.a1, P.a2, P.a3, P.a4, P.a5];
  // meses 0..n a partir do aging de T0
  M.simula = function (P, R, n) {
    let s = M.aging0(P), acum = 0;
    const out = [{ mes: 0, emDia: P.emDia0, s: s.slice(), perda: 0, perdaAcum: 0, total: P.emDia0 + d3sum(s), dso: (P.emDia0 + d3sum(s)) / M.porDia(P) }];
    for (let m = 1; m <= n; m++) {
      const p = M.passo(P, R, s); s = p.s; acum += p.perda;
      const tot = M.emDia(P) + d3sum(s);
      out.push({ mes: m, emDia: M.emDia(P), s: s.slice(), perda: p.perda, perdaAcum: acum, total: tot, dso: tot / M.porDia(P) });
    }
    return out;
  };
  function d3sum(a) { let t = 0; for (const v of a) t += v; return t; }
  M.soma = d3sum;
  // regime: itera ≥ mesesRegime meses a partir de T0
  M.regime = function (P, R) {
    let s = M.aging0(P), p = null;
    for (let m = 0; m < P.mesesRegime; m++) { p = M.passo(P, R, s); s = p.s; }
    const tot = M.emDia(P) + d3sum(s);
    return { s, perdaAno: p.perda * 12, recupAno: p.recup * 12, dso: tot / M.porDia(P), total: tot };
  };
  // custo da régua (R$ mil/ano) por estágio, sobre os saldos s
  M.custos = function (P, E, S, s) {
    const I = M.int(S);
    return E.map((e, k) => {
      const tit = e.origem === 'titulos' ? P.titulosMes : s[Number(e.origem.slice(1)) - 1] / P.ticket;
      return tit * e.fracTitulos * e.custo / 1000 * (I[k] / 50) * 12;
    });
  };
  M.relacao = (E, S) => { const I = M.int(S); let r = 100; E.forEach((e, k) => { r -= e.peso * Math.max(0, I[k] - 50) / 50 * 100; }); return r; };
  // probabilidade de um título de cada faixa terminar em perda
  M.probPerda = function (R) {
    const r = [R.r1, R.r2, R.r3, R.r4];
    const out = [];
    for (let k = 0; k < 5; k++) { let p = 1 - R.rec; for (let j = k; j < 4; j++) p *= r[j]; out.push(p); }
    return out;
  };
  // comparador por faixa (% do saldo): própria × especializada × cessão
  M.comparador = function (P, E, S, R, s) {
    const pp = M.probPerda(R), cu = M.custos(P, E, S, s), tot = d3sum(s);
    const varF = [0, 0, 0, 0, 0];
    E.forEach((e, k) => { if (e.origem !== 'titulos') varF[Number(e.origem.slice(1)) - 1] += cu[k]; });
    return s.map((v, k) => {
      const fixo = tot > 0 ? P.fixoEquipe * 12 * v / tot : 0;
      const custo = varF[k] + fixo;
      const rec = 1 - pp[k];
      const propria = v > 0 ? rec - custo / v : rec;
      const aplEsp = k + 1 >= P.espDe && k + 1 <= P.espAte;
      const esp = rec * (1 - S.fee / 100);
      const ces = S.cessao / 100;
      const cands = [['propria', propria], ['cessao', ces]];
      if (aplEsp) cands.push(['esp', esp]);
      const venc = cands.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
      return { faixa: k + 1, saldo: v, probPerda: pp[k], custoVar: varF[k], custoFixo: fixo, propria, esp, aplEsp, cessao: ces, venc };
    });
  };
  // estado completo da régua atual e da régua padrão (mesmas roll rates base, intensidades 50)
  M.estado = function (P, E, S) {
    const R = M.efetivas(P, E, S);
    const S50 = { ...S, i1: 50, i2: 50, i3: 50, i4: 50, i5: 50 };
    const R50 = M.efetivas(P, E, S50);
    const reg = M.regime(P, R), reg50 = M.regime(P, R50);
    const cust = M.custos(P, E, S, reg.s), cust50 = M.custos(P, E, S50, reg50.s);
    const custo = d3sum(cust), custo50 = d3sum(cust50);
    const sim = M.simula(P, R, P.mesesSimulados);
    const mes = P.mesesSimulados;
    const vendas = P.vendasPrazoAno;
    return {
      R, reg, reg50, sim, mes,
      perda: reg.perdaAno, perdaPct: reg.perdaAno / vendas, perda50: reg50.perdaAno, perda50Pct: reg50.perdaAno / vendas,
      custos: cust, custo, custo50, evitada: reg50.perdaAno - reg.perdaAno, custoAdic: custo - custo50,
      liquido: (reg50.perdaAno - reg.perdaAno) - (custo - custo50),
      recuperar: 1 - reg.perdaAno / vendas, dso: reg.dso, relacao: M.relacao(E, S),
      comp: M.comparador(P, E, S, R, sim[mes].s),
    };
  };
  root.M47 = M;
})(typeof window !== 'undefined' ? window : globalThis);
