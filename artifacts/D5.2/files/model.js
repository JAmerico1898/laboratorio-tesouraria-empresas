/* D5.2 · Mesa de negociação — funções puras (sem DOM).
   Unidades: percentuais em pontos (4 = 4%); volume em R$ mil/ano; prazo em dias.
   C = controles {margem, fundingMes, prazo, volume, pont, partCat, compromisso, volGar, riscoZero}
   R = regras {pdBase, pontRef, pdAbaixo, pdAcima, pdPiso, pdTeto, adm, alvo, batnaLim, batnaPp, compPp, limTotal, compras, janela} */
(function (root) {
  const M = {};
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  // custo do funding do fornecedor pelo prazo concedido, em % do volume
  M.custoPrazo = (fundingMes, prazo) => fundingMes * prazo / 30;
  // risco de crédito que o fornecedor aloca sobre a Horizonte (% a.a. do volume)
  M.pd = function (pont, R) {
    const d = pont < R.pontRef ? (R.pontRef - pont) * R.pdAbaixo : -(pont - R.pontRef) * R.pdAcima;
    return clamp(R.pdBase + d, R.pdPiso, R.pdTeto);
  };
  M.estado = function (C, R) {
    const cp = M.custoPrazo(C.fundingMes, C.prazo);
    const pd = C.riscoZero ? 0 : M.pd(C.pont, R);
    const adm = C.riscoZero ? 0 : R.adm;
    const custo = cp + pd + adm;
    const consumo = custo / C.margem;
    const batnaFraca = C.partCat > R.batnaLim;
    const comp = !!(C.compromisso || C.volGar);
    const base = Math.max(0, custo - R.alvo * C.margem);
    let pricing = base + (batnaFraca ? R.batnaPp : 0) - (comp ? R.compPp : 0);
    pricing = Math.max(0, pricing);
    const resposta = consumo >= 1 ? 'nao' : pricing > 1e-9 ? 'pricing' : 'cede';
    return {
      cp, pd, adm, custo, consumo, batnaFraca, comp, base, pricing, resposta,
      margemAbs: C.volume * C.margem / 100,
      custoAbs: C.volume * custo / 100,
      prazoAbs: C.volume * cp / 100, riscoAbs: C.volume * pd / 100, admAbs: C.volume * adm / 100,
      pricingRS: resposta === 'nao' ? 0 : C.volume * pricing / 100,
      pmpf: resposta === 'nao' ? 0 : C.prazo,
      partTotal: C.volume / R.compras * 100,
      // desconto à vista que deixa o fornecedor indiferente: funding pelos dias antecipados (prazo − janela)
      descIndif: Math.max(0, C.fundingMes * (C.prazo - R.janela) / 30),
    };
  };
  // jogo repetido: ganho de um trimestre × perda em VP do repasse futuro
  M.jogo = function (J) {
    const ganho = J.volume / 4 * J.dExtra / 100;
    let perda = 0;
    const serie = [];
    for (let t = 1; t <= J.anos; t++) {
      const vp = J.volume * J.repasse / 100 / Math.pow(1 + J.taxa / 100, t);
      perda += vp; serie.push({ t, vp });
    }
    return { ganho, perda, serie, razao: ganho > 0 ? perda / ganho : Infinity };
  };
  root.M52 = M;
})(typeof window !== 'undefined' ? window : globalThis);
