/* D2.5 · Lucro × caixa — funções puras (sem DOM). R$ mil.
   D = DRE {receita,cmv,pessoal,gerais,tribVendas,deprec,juros,ir}
   B = balanço {chave:{t1,t0}} · P = premissas {compras,pmrv,pmpf,pmre,base}
   C = controles {pmrv, pmpf, pmre, juros:'op'|'fin'} */
(function (root) {
  const M = {};
  M.dre = function (D) {
    const lb = D.receita - D.cmv;
    const ebit = lb - D.pessoal - D.gerais - D.tribVendas - D.deprec;
    const lair = ebit - D.juros;
    const ll = lair - D.ir;
    return { receita: D.receita, cmv: D.cmv, lb, pessoal: D.pessoal, gerais: D.gerais, tribVendas: D.tribVendas, deprec: D.deprec,
      ebit, juros: D.juros, lair, ir: D.ir, ll, margem: ll / D.receita };
  };
  const delta = (B, k) => B[k].t0 - B[k].t1;
  M.ponte = function (D, B, P, C) {
    const R = M.dre(D);
    const fin = C.juros === 'fin';
    // variações de capital de giro: só os prazos as movem (DRE fixa)
    const dCli = delta(B, 'cli') + (C.pmrv - P.pmrv) / P.base * D.receita;
    const dForn = delta(B, 'forn') + (C.pmpf - P.pmpf) / P.base * P.compras;
    const dEst = delta(B, 'est') + (C.pmre - P.pmre) / P.base * D.cmv;
    const dImp = delta(B, 'imprec'), dAdi = delta(B, 'adiant'), dSal = delta(B, 'sal'), dTrib = delta(B, 'trib');
    const ajustes = [
      { k: 'deprec', v: R.deprec },
      { k: 'cli', v: -dCli }, { k: 'est', v: -dEst }, { k: 'adiant', v: -dAdi }, { k: 'imprec', v: -dImp },
      { k: 'forn', v: dForn }, { k: 'sal', v: dSal }, { k: 'trib', v: dTrib },
    ];
    if (fin) ajustes.push({ k: 'juros', v: R.juros });
    const giro = -dCli - dEst - dAdi - dImp + dForn + dSal + dTrib;
    const fcoInd = R.ll + ajustes.reduce((a, x) => a + x.v, 0);
    // direto: compras do ano = CMV + Δestoques (o estoque maior é comprado e pago)
    const compras = D.cmv + dEst;
    const dir = {
      receb: D.receita - dCli,
      forn: -(compras - dForn + dAdi),
      pessoal: -(D.pessoal - dSal),
      gerais: -D.gerais,
      trib: -(D.tribVendas - dTrib + dImp),
      ir: -D.ir,
      juros: fin ? 0 : -D.juros,
    };
    const fcoDir = Object.values(dir).reduce((a, b) => a + b, 0);
    const capex = delta(B, 'anc') + R.deprec;                      // ΔANC + depreciação
    const captacao = delta(B, 'emprcp') + delta(B, 'elp');
    const divDecl = R.ll - delta(B, 'pl');
    const divPagos = divDecl - delta(B, 'divpagar');
    const fcf0 = captacao - divPagos - (fin ? R.juros : 0);
    const caixaT1 = B.caixa.t1;
    // se o caixa ficaria negativo, empréstimo CP adicional fecha o balanço
    const extra = Math.max(0, -(caixaT1 + fcoInd - capex + fcf0));
    const fcf = fcf0 + extra;
    const dCaixa = fcoInd - capex + fcf;
    const dST = dCaixa - delta(B, 'emprcp') - delta(B, 'divpagar') - extra;
    return { R, dCli, dForn, dEst, dImp, dAdi, dSal, dTrib, ajustes, giro, fcoInd, fcoDir, dir, prova: fcoDir - fcoInd,
      compras, capex, captacao, divDecl, divPagos, fcf, extra, dCaixa, caixaFinal: caixaT1 + dCaixa, caixaT1, dST, fin };
  };
  root.M24 = M;
})(typeof window !== 'undefined' ? window : globalThis);
