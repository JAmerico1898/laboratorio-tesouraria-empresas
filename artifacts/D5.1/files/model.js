/* D5.1 · Fornecedor é credor — funções puras (sem DOM). Motor de D4.2 §5 visto pela tomadora.
   Unidades: valores em R$ mil; d, f, iMes, desc, p em % (ex.: 2 = 2%); prazos em dias. Base 360. */
(function (root) {
  const M = {};
  const anual = (d, n, k) => (d / 100) / (1 - d / 100) * 360 / (n - k);
  // custo anualizado de recusar o desconto: linear e composto (base 360)
  M.custoLin = (d, n, k) => anual(d, n, k);
  M.custoComp = (d, n, k) => Math.pow(1 + (d / 100) / (1 - d / 100), 360 / (n - k)) - 1;
  // taxa mensal equivalente a um funding anual
  M.iMes = (fAnual) => Math.pow(1 + fAnual / 100, 1 / 12) - 1;
  M.EMPATE = 0.01; // ±1 p.p. ao ano
  // decisão da aba 1. C = {P, n, k, d, f, iMes|null}
  M.estado = function (C) {
    const i = C.iMes != null ? C.iMes / 100 : M.iMes(C.f);
    const lin = M.custoLin(C.d, C.n, C.k), comp = M.custoComp(C.d, C.n, C.k);
    const f = C.f / 100, dif = comp - f;
    return {
      i, lin, comp, dif,
      vpPrazo: C.P / Math.pow(1 + i, C.n / 30),
      vpVista: C.P * (1 - C.d / 100) / Math.pow(1 + i, C.k / 30),
      pagaVista: C.P * (1 - C.d / 100),
      estrita: comp > f ? 'tomar' : 'manter',
      decisao: Math.abs(dif) <= M.EMPATE + 1e-12 ? 'indif' : dif > 0 ? 'tomar' : 'manter',
    };
  };
  // desconto que iguala o custo da recusa ao funding (indiferença)
  M.dEmpate = (f, n, k) => (1 - Math.pow(1 + f / 100, -(n - k) / 360)) * 100;
  // aba 2: o preço escondido. H = {vol, d, k, n, f, desc, conc, p}
  M.preco = function (H) {
    const comp = M.custoComp(H.d, H.n, H.k);
    const manter = !(comp > H.f / 100);
    const saldo = H.vol * H.n / 360;
    const c1 = manter ? H.vol * H.d / 100 : 0;
    const c2 = H.vol * H.desc / 100;
    const c4 = saldo * H.p / 100;
    const custo = c1 + c2;
    return {
      comp, manter, saldo, c1, c2, c4, custo,
      pctVol: custo / H.vol,
      taxaSaldo: saldo > 0 ? custo / saldo : 0,
      banco: saldo * H.f / 100,
      abaixo: saldo > 0 && custo / saldo < H.f / 100,
    };
  };
  // prazo médio em dias a partir de saldo e fluxo anual
  M.prazo = (saldo, fluxo) => saldo / fluxo * 360;
  root.M51 = M;
})(typeof window !== 'undefined' ? window : globalThis);
