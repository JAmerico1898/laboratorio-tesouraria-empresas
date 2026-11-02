/* D5.7 · Fecho da cadeia — funções puras (sem DOM).
   C = controles {prazo, d (%), modo ('auto'|'sim'|'nao'), vendor (bool), h (dias), fA, fH (% a.a.)}
   B = base do caso {fluxo, prazo0, perda (%), tv (% a.a.), cob, estDias0, custoPct (%), ncgAlfa, ncgHor}
   P = prazos da carteira toda da Alfa {pmrv, pmre, pmpf}; A = Alfa T0 {rec, cmv, compras, pmrv, pmre, pmpf, st, ncg, ccl} */
(function (root) {
  const M = {};
  // custo anualizado de recusar o desconto à vista (V4.2 / V5.1): paga (1 − d) hoje ou 1 em "prazo" dias
  M.custoRecusa = (d, prazo) => (d <= 0 ? 0 : prazo <= 0 ? Infinity : Math.pow(1 / (1 - d), 360 / prazo) - 1);
  // desconto em que recusar custa exatamente o funding f
  M.descontoLimiar = (f, prazo) => 1 - Math.pow(1 + f, -prazo / 360);
  M.estado = function (C, B) {
    const d = C.d / 100, fA = C.fA / 100, fH = C.fH / 100, tv = B.tv / 100, perda = B.perda / 100;
    const saldo0 = B.fluxo * B.prazo0 / 360;
    const est0 = B.fluxo * B.estDias0 / 360;
    const saldo = B.fluxo * C.prazo / 360;
    const cr = M.custoRecusa(d, C.prazo);
    const vendor = !!C.vendor;
    const toma = !vendor && (C.modo === 'sim' || (C.modo === 'auto' && cr > fH));
    const quit = toma || vendor;
    const clientesH = quit ? 0 : saldo;            // ativo da Alfa
    const fornAlfa = quit ? 0 : saldo;             // passivo da Horizonte
    const divVendor = vendor ? saldo : 0;          // Horizonte deve ao banco (financeiro, fora da NCG)
    const desc = quit ? d * B.fluxo : 0;           // desconto que a Alfa concede por ano
    const perdaRS = quit ? 0 : perda * B.fluxo;    // perda esperada da Alfa sobre a Horizonte
    const estHor = B.fluxo * C.h / 360;            // estoque na Horizonte (a preço de compra)
    const paAlfa = Math.max(0, B.fluxo * B.custoPct / 100 * (B.cob - C.h) / 360); // PA na Alfa (ao custo)
    // NCG: fornecedores é passivo operacional → menos fornecedores, mais NCG na Horizonte
    const ncgAlfa = B.ncgAlfa - (saldo0 - clientesH) + paAlfa;
    const ncgHor = B.ncgHor + (saldo0 - fornAlfa) - (est0 - estHor);
    // custo financeiro anual do título + estoque em cada elo (funding de quem carrega)
    const custoAlfa = (clientesH + paAlfa) * fA + perdaRS + desc;
    const custoHor = (estHor - fornAlfa - divVendor) * fH + divVendor * tv - desc;
    return {
      saldo, saldo0, est0, cr, toma, vendor, quit, clientesH, fornAlfa, divVendor, desc, perdaRS, estHor, paAlfa,
      ncgAlfa, ncgHor, ncgCadeia: ncgAlfa + ncgHor,
      custoAlfa, custoHor, custoCadeia: custoAlfa + custoHor,
      decisao: vendor ? 'vendor' : toma ? 'toma' : 'mantem',
    };
  };
  // T0 com o mesmo funding (para as variações)
  M.t0 = (C, B) => M.estado({ prazo: B.prazo0, d: 0, modo: 'auto', vendor: false, h: B.estDias0, fA: C.fA, fH: C.fH }, B);
  // ganhos do vendor finance, como em D5.3: Alfa contra carregar o título; Horizonte contra trocar o prazo por CG
  M.vendorGanhos = function (C, B) {
    const saldo = B.fluxo * C.prazo / 360, d = C.d / 100;
    const alfaSem = saldo * C.fA / 100 + B.perda / 100 * B.fluxo, alfaCom = d * B.fluxo;
    const horSem = saldo * C.fH / 100, horCom = saldo * B.tv / 100 - d * B.fluxo;
    return { gA: alfaSem - alfaCom, gH: horSem - horCom, alfaSem, alfaCom, horSem, horCom, banco: saldo * B.tv / 100 };
  };
  // ST da Alfa pela carteira toda (D1.2): CCL fixo, NCG anda com os prazos
  M.st = function (P, A, fluxo) {
    const dRv = A.rec / 360, dRe = A.cmv / 360, dPf = A.compras / 360;
    const ganho = (A.pmrv - P.pmrv) * dRv + (A.pmre - P.pmre) * dRe + (P.pmpf - A.pmpf) * dPf;
    const st = A.st + ganho;
    return { st, ncg: A.ncg - ganho, ccl: A.ccl, dRv, dRe, dPf, espelho: (A.pmrv - P.pmrv) * fluxo / 360 };
  };
  root.M57 = M;
})(typeof window !== 'undefined' ? window : globalThis);
