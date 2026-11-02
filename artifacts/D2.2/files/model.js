/* D2.2 · Da receita ao caixa — funções puras (sem DOM). Tudo em R$ mil.
   P = parâmetros (dataset parametros), saz = 12 pesos, inst = instrumentos (dataset), C = controles. */
(function (root) {
  const M = {};
  const KMAX = 6; // maior defasagem possível (parcelado 6x)
  // fração de uma venda que entra em cada defasagem k (0..6), por instrumento, antes da inadimplência
  M.vetor = function (row, C) {
    const v = new Array(KMAX + 1).fill(0);
    if (row.id === 'boleto') {
      const dias = String(C.boletoPrazo).split('/').map(Number);
      dias.forEach((d) => { v[Math.round(d / 30)] += 1 / dias.length; });
    } else if (row.id === 'parcelado') {
      const n = Number(C.parcelas);
      for (let i = 1; i <= n; i++) v[i] += 1 / n;
    } else v[Math.round(Number(row.dias) / 30)] += 1;
    return v;
  };
  // linhas por instrumento: share do mix (renormalizado) × vetor; no modo direto, uma linha com o aging digitado
  M.linhas = function (inst, C) {
    if (C.direto) {
      const ks = [C.k0, C.k1, C.k2, C.k3].map((x) => Math.max(0, Number(x) || 0));
      const s = ks.reduce((a, b) => a + b, 0) || 1;
      const v = new Array(KMAX + 1).fill(0); ks.forEach((x, i) => { v[i] = x / s; });
      return { soma: s, rows: [{ id: 'direto', share: 1, vec: v }] };
    }
    const pcts = inst.map((r) => Math.max(0, Number(C[r.id]) || 0));
    const s = pcts.reduce((a, b) => a + b, 0);
    return { soma: s, rows: inst.map((r, i) => {
      const share = s > 0 ? pcts[i] / s : 0;
      return { id: r.id, nome: r.nome, share, vec: M.vetor(r, C).map((x) => x * share) };
    }) };
  };
  M.aging = (L) => { const a = new Array(KMAX + 1).fill(0); L.rows.forEach((r) => r.vec.forEach((x, k) => { a[k] += x; })); return a; };
  M.dso = (a) => a.reduce((s, x, k) => s + 30 * k * x, 0);
  M.fator = (P, C) => (C.safra ? 1 + P.cSelic * (C.selic - P.selicRef) + P.cDesemp * (C.desemp - P.desempRef) : 1);
  M.perda = (P, C) => Math.max(0, (C.inad / 100) * M.fator(P, C));
  // perda por defasagem: zero à vista; a perda da coorte recai só sobre as parcelas a prazo
  M.perdaK = (a, perda) => a.map((x, k) => (k === 0 ? 0 : a[0] < 1 ? Math.min(1, perda / (1 - a[0])) : 0));
  // série sintética determinística: t = 1..n (t = 1 é janeiro do ano 1)
  M.serie = function (P, saz) {
    let s = P.semente >>> 0;
    const u = () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 4294967296; };
    const nrm = () => { let a = 0; for (let i = 0; i < 12; i++) a += u(); return a - 6; };
    const r = [NaN];
    for (let t = 1; t <= P.nMeses; t++) r.push((P.receitaAnual / 12) * Math.pow(1 + P.cresc, t) * saz[(t - 1) % 12] * (1 + P.ruido * nrm()));
    return r;
  };
  M.corr = function (x, y) {
    const n = x.length, mx = x.reduce((a, b) => a + b, 0) / n, my = y.reduce((a, b) => a + b, 0) / n;
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
    return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : NaN;
  };
  M.calc = function (P, saz, inst, C) {
    const L = M.linhas(inst, C), a = M.aging(L), dso = M.dso(a);
    const fator = M.fator(P, C), perda = M.perda(P, C), pk = M.perdaK(a, perda);
    // uma venda de referência V em janeiro
    const V = C.venda;
    const venda = { rows: L.rows.map((r) => ({ id: r.id, nome: r.nome, share: r.share, liq: r.vec.map((x, k) => V * x * (1 - pk[k])) })) };
    venda.bruto = a.map((x) => V * x);
    venda.liq = a.map((x, k) => V * x * (1 - pk[k]));
    venda.perda = a.map((x, k) => V * x * pk[k]);
    venda.total = venda.liq.reduce((s, x) => s + x, 0);
    venda.ultimo = a.reduce((m, x, k) => (x > 1e-12 ? k : m), 0);
    // série
    const rec = M.serie(P, saz), n = P.nMeses;
    const entOp = [NaN], orig = [null], bruta = [NaN], perdaT = [NaN];
    for (let t = 1; t <= n; t++) {
      let e = 0, b = 0; const o = [0, 0, 0, 0];
      for (let k = 0; k <= KMAX; k++) {
        if (t - k < 1) continue;
        const g = rec[t - k] * a[k];
        b += g; e += g * (1 - pk[k]); o[Math.min(k, 3)] += g;
      }
      entOp.push(e); bruta.push(b); perdaT.push(b - e); orig.push(o);
    }
    // correlação por defasagem, t = tIni..n
    const ks = [];
    for (let k = 0; k <= P.kLag; k++) {
      const x = [], y = [];
      for (let t = P.tIni; t <= n; t++) { x.push(rec[t - k]); y.push(entOp[t]); }
      ks.push({ k, corr: M.corr(x, y) });
    }
    const best = ks.reduce((m, r) => (r.corr > m.corr || !Number.isFinite(m.corr) ? r : m), ks[0]);
    const kStar = best.k;
    const pts = [];
    for (let t = P.tIni; t <= n; t++) pts.push({ t, x: rec[t - kStar], y: entOp[t] });
    const mx = d3mean(pts.map((p) => p.x)), my = d3mean(pts.map((p) => p.y));
    let sxy = 0, sxx = 0; pts.forEach((p) => { sxy += (p.x - mx) * (p.y - my); sxx += (p.x - mx) ** 2; });
    const b1 = sxx > 0 ? sxy / sxx : 0, b0 = my - b1 * mx;
    // waterfall do mês escolhido (eventos únicos caem nesse mês)
    const tw = Math.min(n, Math.max(P.tIni, Math.round(C.mesW)));
    const finRec = P.taxaAplic * C.saldoAplic;
    const outras = finRec + C.perdcomp + C.ativos;
    const wf = { t: tw, receitaMes: rec[tw], bruta: bruta[tw], orig: orig[tw], perda: perdaT[tw], finRec, perdcomp: C.perdcomp, ativos: C.ativos,
      outras, captacao: C.captacao, entradas: entOp[tw] + outras + C.captacao, entOp: entOp[tw] };
    return { L, aging: a, dso, fator, perda, pk, venda, rec, entOp, ks, kStar, corrMax: best.corr, r2: best.corr * best.corr, reg: { b0, b1 }, pts, wf,
      checkPerda: 1 - a.reduce((s, x, k) => s + x * (1 - pk[k]), 0) };
  };
  function d3mean(v) { return v.reduce((a, b) => a + b, 0) / v.length; }
  root.M22 = M;
})(typeof window !== 'undefined' ? window : globalThis);
