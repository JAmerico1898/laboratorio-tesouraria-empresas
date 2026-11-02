/* D2.3 · Calendário de saídas — funções puras (sem DOM). Tudo em R$ mil.
   Motor de orçamento (fracPMPF, orcamento) copiado de D2.1 (validado contra D2.1 §7);
   aqui ele só fornece receita, entradas e pagamento a fornecedores com o PMPF escolhido.
   Testes de aderência (Spec D2.3 §7) em test.js:
   set: total 5.290 · negociável 3.712 (70%) · inegociável 1.030 (19%) · decisão 548 (10%)
   set dia 20 = 1.220 · set dia 5 = 1.228 · dez dia 20 = 1.114 · dez dia 30 = 850 · abr dia 30 = 1.350
   ano: 50.934 · inegociável 14.004 · negociável 33.000 · decisão 3.930 · UF MG → ICMS no dia 10 */
(function (root) {
  const M = {};
  M.fracPMPF = function (pmpf) {
    const lo = Math.floor(pmpf / 30), r = (pmpf - lo * 30) / 30;
    return r === 0 ? [[lo, 1]] : [[lo, 1 - r], [lo + 1, r]];
  };
  M.orcamento = function (P, C) {
    const base = P.receitaAnual / 12;
    const pesos = C.achatar ? P.pesos.map(() => 1) : C.pesos;
    const g = C.crescimento / 100;
    // receita do mês s, s = -4..13 (anos vizinhos sem crescimento, mesmos pesos)
    const rec = (s) => {
      const m = ((s % 12) + 12) % 12;
      const fat = s >= 0 ? Math.pow(1 + g, s / 12) : 1; // anos seguintes seguem crescendo (fecha dez = 143 em "Crescer 20%")
      return base * pesos[m] * fat;
    };
    const ent = new Array(12).fill(0), forn = new Array(12).fill(0);
    const lagRV0 = P.pmrvAntigo / 30, fr0 = M.fracPMPF(P.pmpfAntigo), fr1 = M.fracPMPF(C.pmpf);
    for (let s = -6; s <= 11; s++) {
      const lag = s < 0 ? lagRV0 : C.pmrv / 30;
      const t = s + lag;
      if (t >= 0 && t <= 11) ent[t] += rec(s) * (1 - C.inad / 100);
      const compras = P.pctCompras * rec(s + 2);
      (s < 0 ? fr0 : fr1).forEach(([a, f]) => { const u = s + a; if (u >= 0 && u <= 11) forn[u] += f * compras; });
    }
    const meses = [];
    let saldo = P.saldoInicial;
    for (let m = 0; m < 12; m++) {
      const folha = P.salarios + P.encargos + P.decimo[m] + P.plr[m];
      const varr = P.pctVariaveis * rec(m);
      const disc = P.discricionarias * C.disc / 100;
      const trib = P.pctTributos * rec(m - 1) + P.irpj;
      const saidasOp = forn[m] + folha + P.fixas + varr + disc + trib;
      const fluxoOp = ent[m] - saidasOp;
      const capex = m === 5 ? C.capexJun : m === 8 ? C.capexSet : 0;
      const div = m === P.mesDividendos ? C.dividendos : 0;
      const juros = P.jurosCP + P.jurosELP;
      const financ = -(juros + P.amortELP[m] + div);
      const fluxoLiq = fluxoOp - capex + financ;
      saldo += fluxoLiq;
      meses.push({ m, receita: rec(m), entradas: ent[m], forn: forn[m], folha, fixas: P.fixas, variaveis: varr, disc, trib,
        saidasOp, fluxoOp, invest: -capex, financ, juros, amort: P.amortELP[m], div, fluxoLiq, saldo });
    }
    const fl = meses.map((x) => x.fluxoLiq), media = fl.reduce((a, b) => a + b, 0) / 12;
    const sigma = Math.sqrt(fl.reduce((a, b) => a + (b - media) ** 2, 0) / 12);
    const minimo = C.k * sigma;
    const soma = (k) => meses.reduce((a, x) => a + x[k], 0);
    let pior = meses[0], exc = meses[0];
    meses.forEach((x) => { if (x.saldo < pior.saldo) pior = x; if (x.saldo > exc.saldo) exc = x; });
    return { meses, sigma, minimo, pior, falta: Math.max(0, minimo - pior.saldo), excMes: exc, excedente: exc.saldo - minimo,
      abaixo: meses.filter((x) => x.saldo < minimo).map((x) => x.m), negativos: meses.filter((x) => x.saldo < 0).map((x) => x.m),
      totais: { receita: soma('receita'), entradas: soma('entradas'), saidasOp: soma('saidasOp'), fluxoOp: soma('fluxoOp'), invest: soma('invest'), financ: soma('financ'), fluxoLiq: soma('fluxoLiq') },
      saldoFinal: meses[11].saldo };
  };

  M.CLASSES = ['negociavel', 'inegociavel', 'decisao'];
  // arredondamento de exibição: meio para o par (3.712,5 → 3.712; 1.029,5 → 1.030), como nas tabelas da spec
  M.r = (v) => { const f = Math.floor(v), d = v - f; if (Math.abs(d - 0.5) < 1e-7) return f % 2 === 0 ? f : f + 1; return Math.round(v); };
  // dias do mês num ano não bissexto (calendário, não dado do caso)
  M.diasNoMes = (m) => new Date(2027, m + 1, 0).getDate();
  // "último dia útil" = dia 30 (28 em fev): assim dez dia 30 = IRPJ + amortização (Spec §7)
  M.ultimoDia = (m) => Math.min(30, M.diasNoMes(m));
  M.lista = (s) => String(s).split(';').map(Number).filter((x) => x > 0);

  // D = {P, pesos, cats, eventos, ufDia}; C = {pmpf, uf, capexJunMes, capexSetMes, dividendos, disc}
  M.calendario = function (D, C) {
    const P = D.P, base = P.receitaAnual / 12;
    const rec = (s) => base * D.pesos[((s % 12) + 12) % 12];
    const zeros = new Array(12).fill(0);
    const PP = Object.assign({}, P, { pesos: D.pesos, decimo: zeros, plr: zeros, amortELP: zeros });
    const CC = { crescimento: 0, pesos: D.pesos, achatar: false, pmrv: P.pmrv, pmpf: C.pmpf, inad: P.inad, disc: 100, dividendos: 0, capexJun: 0, capexSet: 0, k: 1 };
    const orc = M.orcamento(PP, CC);
    const orc45 = M.orcamento(PP, Object.assign({}, CC, { pmpf: P.pmpfAntigo }));
    const cel = [];
    for (let m = 0; m < 12; m++) { cel.push([]); for (let d = 0; d <= M.diasNoMes(m); d++) cel[m].push([]); }
    const put = (m, d, cat, v) => { if (v > 1e-9) cel[m][Math.min(d, M.diasNoMes(m))].push({ id: cat.id, nome: cat.nome, classe: cat.classe, valor: v }); };
    const mesIdx = (x) => (typeof x === 'number' ? x : D.MES.indexOf(x));
    const cats = D.cats.slice().sort((a, b) => a.ordem - b.ordem);
    cats.forEach((cat) => {
      for (let m = 0; m < 12; m++) {
        let v = 0;
        if (cat.regra === 'fornecedores') v = orc.meses[m].forn;
        else if (cat.regra === 'premissa') v = P[cat.ref] * (cat.ref === 'discricionarias' ? C.disc / 100 : 1);
        else if (cat.regra === 'pctReceitaAnterior') v = cat.pct * rec(m - 1);
        else if (cat.regra === 'pctReceita') v = P[cat.ref] * rec(m);
        else continue;
        let dias;
        if (cat.dias === 'uf') dias = [D.ufDia[C.uf]];
        else if (cat.dias === 'ultimo') dias = [M.ultimoDia(m)];
        else dias = M.lista(cat.dias);
        dias.forEach((d) => put(m, d, cat, v / dias.length));
      }
    });
    D.eventos.forEach((e) => {
      const cat = cats.find((c) => c.id === e.categoria); if (!cat) return;
      let m = mesIdx(e.mes), v = e.valor;
      if (e.id === 'capexJun' && C.capexJunMes != null) m = mesIdx(C.capexJunMes);
      if (e.id === 'capexSet' && C.capexSetMes != null) m = mesIdx(C.capexSetMes);
      if (e.categoria === 'dividendos' && C.dividendos != null) v = C.dividendos;
      put(m, e.dia, cat, v);
    });
    // saldo: abertura de cada mês = inicial + Σ (entradas − saídas) dos meses anteriores
    const diasEnt = M.lista(P.diasEntradas);
    const meses = [];
    let saldo = P.saldoInicial;
    for (let m = 0; m < 12; m++) {
      const porClasse = { negociavel: 0, inegociavel: 0, decisao: 0 }, porCat = {};
      cel[m].forEach((it) => it.forEach((x) => { porClasse[x.classe] += x.valor; porCat[x.id] = (porCat[x.id] || 0) + x.valor; }));
      const total = porClasse.negociavel + porClasse.inegociavel + porClasse.decisao;
      const abertura = saldo;
      saldo += orc.meses[m].entradas - total;
      meses.push({ m, porClasse, porCat, total, entradas: orc.meses[m].entradas, receita: rec(m), forn: orc.meses[m].forn, forn45: orc45.meses[m].forn, abertura, fechamento: saldo });
    }
    const ano = { negociavel: 0, inegociavel: 0, decisao: 0, total: 0 };
    meses.forEach((x) => { M.CLASSES.forEach((c) => { ano[c] += x.porClasse[c]; }); ano.total += x.total; });
    return { cel, meses, ano, diasEnt };
  };

  // total por dia do mês m, só das classes ligadas em F = {negociavel: bool, …}
  M.diaTotal = (cal, m, d, F) => cal.cel[m][d].reduce((a, x) => a + (!F || F[x.classe] ? x.valor : 0), 0);
  M.resumoMes = function (cal, m, F) {
    const n = M.diasNoMes(m), dias = [];
    const porClasse = { negociavel: 0, inegociavel: 0, decisao: 0 };
    let maxD = 1, maxV = -1;
    for (let d = 1; d <= n; d++) {
      const v = M.diaTotal(cal, m, d, F); dias.push(v);
      if (v > maxV + 1e-9) { maxV = v; maxD = d; }
      cal.cel[m][d].forEach((x) => { if (!F || F[x.classe]) porClasse[x.classe] += x.valor; });
    }
    const total = porClasse.negociavel + porClasse.inegociavel + porClasse.decisao;
    return { dias, porClasse, total, pctIneg: total > 0 ? porClasse.inegociavel / total : 0, diaMax: maxD, valorMax: maxV };
  };
  // saldo dentro do mês m (todas as classes): [{d, saldo}] começando na abertura
  M.saldoDiario = function (cal, m) {
    const x = cal.meses[m], n = M.diasNoMes(m), q = x.entradas / cal.diasEnt.length, out = [];
    let s = x.abertura;
    for (let d = 1; d <= n; d++) {
      if (cal.diasEnt.indexOf(d) >= 0) s += q;
      s -= M.diaTotal(cal, m, d, null);
      out.push({ d, saldo: s });
    }
    return out;
  };
  // classe dominante de uma célula
  M.dominante = (itens) => {
    const t = { negociavel: 0, inegociavel: 0, decisao: 0 }; itens.forEach((x) => { t[x.classe] += x.valor; });
    let best = null, bv = 0; M.CLASSES.forEach((c) => { if (t[c] > bv) { bv = t[c]; best = c; } });
    return best;
  };
  root.M23 = M;
})(typeof window !== 'undefined' ? window : globalThis);
