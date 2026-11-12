/* D4.1 · Venda a prazo: o fluxo — funções puras (sem DOM).
   Percentuais entram como número de pontos (2 = 2%). Prazos em dias; taxa em % a.m. */
(function (root) {
  const M = {};
  // Uma venda. C = {venda, custo, prazo, inad, taxa, adm}
  M.venda = function (C) {
    const i = C.taxa / 100, inad = C.inad / 100;
    const receb = C.venda * (1 - inad);
    const fator = Math.pow(1 + i, C.prazo / 30), vp = receb / fator;
    const custo = C.venda * C.custo / 100, adm = C.venda * C.adm / 100, inadV = C.venda * inad;
    const oport = receb - vp, caixa = vp - custo - adm;
    return {
      venda: C.venda, receb, vp, oport, custo, adm, inad: inadV, caixa, prazo: C.prazo, fator,
      custoCredito: C.venda - caixa - custo, porCem: C.venda ? caixa / C.venda * 100 : 0,
    };
  };
  // Análise marginal (R$ mil/mês). P = {dV, m, pmr, taxa, inadAd, adm, arm}
  M.politica = function (P) {
    const i = P.taxa / 100;
    const recMarg = P.arm ? P.dV : P.dV * P.m / 100;
    const fin = P.dV * i * P.pmr / 30, inadR = P.dV * P.inadAd / 100, adm = P.adm;
    const GL = recMarg - fin - inadR - adm;
    return { recMarg, fin, inadR, adm, GL, custos: fin + inadR + adm, aprova: GL > 0 };
  };
  root.M41 = M;
})(typeof window !== 'undefined' ? window : globalThis);
