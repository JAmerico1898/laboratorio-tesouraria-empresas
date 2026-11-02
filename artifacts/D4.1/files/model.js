/* D4.1 · Venda a prazo: o fluxo — funções puras (sem DOM).
   Percentuais entram como número de pontos (2 = 2%). Prazos em dias; taxa em % a.m. */
(function (root) {
  const M = {};
  M.parcelas = (txt) => String(txt || '').split('/').map((s) => Number(s.trim())).filter((v) => Number.isFinite(v) && v > 0);
  // Uma venda. C = {venda, custo, prazo, inad, taxa, adm, parcelas:[dias] | null}
  M.venda = function (C) {
    const i = C.taxa / 100, inad = C.inad / 100;
    const dias = C.parcelas && C.parcelas.length ? C.parcelas : [C.prazo];
    const receb = C.venda * (1 - inad);
    const fl = dias.map((t) => { const r = receb / dias.length; const f = Math.pow(1 + i, t / 30); return { t, receb: r, fator: f, vp: r / f }; });
    const vp = fl.reduce((a, p) => a + p.vp, 0);
    const custo = C.venda * C.custo / 100, adm = C.venda * C.adm / 100, inadV = C.venda * inad;
    const oport = receb - vp, caixa = vp - custo - adm;
    return {
      venda: C.venda, receb, vp, oport, custo, adm, inad: inadV, caixa, fluxos: fl,
      pmr: dias.reduce((a, t) => a + t, 0) / dias.length, parcelado: dias.length > 1,
      custoCredito: C.venda - caixa - custo, porCem: C.venda ? caixa / C.venda * 100 : 0,
      margem: 100 - C.custo, semSalva: C.inad >= 100 - C.custo,
    };
  };
  // Análise marginal (R$ mil/mês). P = {dV, m, pmr, taxa, inadAd, adm, arm}
  M.politica = function (P) {
    const i = P.taxa / 100;
    const recMarg = P.arm ? P.dV : P.dV * P.m / 100;
    const fin = P.dV * i * P.pmr / 30, inadR = P.dV * P.inadAd / 100, adm = P.adm;
    const GL = recMarg - fin - inadR - adm;
    const inadStar = P.dV > 0 ? (recMarg - fin - adm) / P.dV : null;
    const pmrStar = P.dV > 0 ? (recMarg - inadR - adm) / (P.dV * i) * 30 : null;
    return { recMarg, fin, inadR, adm, GL, custos: fin + inadR + adm, aprova: GL > 0, inadStar, pmrStar, custo30: P.dV * i };
  };
  root.M41 = M;
})(typeof window !== 'undefined' ? window : globalThis);
