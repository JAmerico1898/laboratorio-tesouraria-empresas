/* D2.5 · Lucro × caixa — funções puras (sem DOM). R$ mil.
   D = DRE {receita,cmv,pessoal,gerais,tribVendas,deprec,juros,ir}
   B = balanço de giro {chave:{t1,t0}} · P = premissas {compras,pmrv,pmpf,pmre,base}
   C = controles {pmrv, pmpf, pmre}. Juros pagos sempre operacionais (padrão CPC 03). */
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
    // variações de capital de giro: só os prazos as movem (DRE fixa)
    const dCli = delta(B, 'cli') + (C.pmrv - P.pmrv) / P.base * D.receita;
    const dForn = delta(B, 'forn') + (C.pmpf - P.pmpf) / P.base * P.compras;
    const dEst = delta(B, 'est') + (C.pmre - P.pmre) / P.base * D.cmv;
    const dImp = delta(B, 'imprec'), dAdi = delta(B, 'adiant'), dSal = delta(B, 'sal'), dTrib = delta(B, 'trib');
    // a ponte em 7 etapas (deck v16): LL → +deprec → −Δclientes → −Δestoques → +Δfornecedores → +Δimpostos → (+Δoutros) → FCO
    const ajustes = [
      { k: 'deprec', v: R.deprec },
      { k: 'cli', v: -dCli },
      { k: 'est', v: -dEst },
      { k: 'forn', v: dForn },
      { k: 'imp', v: dTrib - dImp },
      { k: 'outros', v: dSal - dAdi },
    ];
    const fcoInd = R.ll + ajustes.reduce((a, x) => a + x.v, 0);
    // direto (5 categorias): compras do ano = CMV + Δestoques (o estoque maior é comprado e pago)
    const compras = D.cmv + dEst;
    const dir = {
      receb: D.receita - dCli,
      forn: -(compras - dForn + dAdi),
      pessoal: -(D.pessoal - dSal),
      trib: -(D.tribVendas - dTrib + dImp + D.ir),
      outras: -(D.gerais + D.juros),
    };
    const fcoDir = Object.values(dir).reduce((a, b) => a + b, 0);
    return { R, dCli, dForn, dEst, dImp, dAdi, dSal, dTrib, ajustes, fcoInd, fcoDir, dir, prova: fcoDir - fcoInd, compras };
  };
  root.M24 = M;
})(typeof window !== 'undefined' ? window : globalThis);
