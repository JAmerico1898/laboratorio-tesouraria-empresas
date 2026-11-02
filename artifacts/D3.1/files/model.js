/* D3.1 · Estoque é dinheiro parado — funções puras (sem DOM).
   E = perfil da empresa (dataset), C = controles. R$ mil, dias, % a.a. */
(function (root) {
  const M = {};
  M.H = (C) => (C.cdi + C.armaz + C.seguro + C.obsol) / 100;
  M.estoque = (E, pme) => (E.temEstoque ? E.cmv * pme / 360 : 0);
  M.f = (E, C, pme) => E.f0 * Math.exp(-pme / C.tau);
  M.ruptura = (E, C, pme) => (E.temEstoque ? E.receita * M.f(E, C, pme) * E.mc * C.mult : 0);
  M.carreg = (E, C, pme) => M.H(C) * M.estoque(E, pme);
  M.total = (E, C, pme) => M.carreg(E, C, pme) + M.ruptura(E, C, pme);
  // argmin do custo total em [lo, hi], passo 0,01 dia
  M.otimo = function (E, C, lo = 20, hi = 150) {
    let best = lo, v = Infinity;
    for (let p = lo; p <= hi + 1e-9; p += 0.01) { const t = M.total(E, C, p); if (t < v) { v = t; best = p; } }
    return { pme: best, total: v };
  };
  M.estado = function (E, C) {
    const pme = C.pme;
    const est = M.estoque(E, pme), aco = est + E.clientes + E.outrosACO, ncg = aco - E.pco;
    const H = M.H(C), carreg = H * est, rup = M.ruptura(E, C, pme);
    const venda = E.temEstoque ? E.receita * M.f(E, C, pme) * E.mc : 0;
    const ot = E.temEstoque ? M.otimo(E, C) : { pme: null, total: 0 };
    return {
      pme, est, aco, ncg, part: aco ? est / aco : 0, H, carreg, rup, venda, perdaCliente: rup - venda, total: carreg + rup,
      pctEbitda: carreg / E.ebitda, ot,
      familias: [['fin', C.cdi / 100 * est], ['armaz', C.armaz / 100 * est], ['seguro', C.seguro / 100 * est], ['obsol', C.obsol / 100 * est]],
      dezDias: E.cmv * 10 / 360, stNovo: E.st + E.estoque0 - est,
    };
  };
  M.curva = function (E, C, lo = 20, hi = 150, passo = 1) {
    const out = [];
    for (let p = lo; p <= hi; p += passo) out.push({ pme: p, carreg: M.carreg(E, C, p), rup: M.ruptura(E, C, p), total: M.total(E, C, p) });
    return out;
  };
  root.M31 = M;
})(typeof window !== 'undefined' ? window : globalThis);
