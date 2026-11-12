/* D4.8 · Antecipação, FIDC e cartão — funções puras (sem DOM).
   C = controles {V, Vc, rb, rf, sr, F, rc} (R$ mil/mês; % a.m.; R$ mil/ano)
   P = parâmetros das modalidades {mDup, mCart, prem} (prazo em meses; prêmio sem regresso em p.p.) */
(function (root) {
  const M = {};
  // taxa efetiva do FIDC: + prêmio quando sem regresso
  M.rfEf = (C, P) => C.rf + (C.sr ? P.prem : 0);
  // custo anual (R$ mil) de cada modalidade
  M.custos = function (C, P) {
    const rfE = M.rfEf(C, P);
    return {
      banc: C.V * 12 * (C.rb / 100) * P.mDup,
      fidc: C.V * 12 * (rfE / 100) * P.mDup + C.F,
      cart: C.Vc * 12 * (C.rc / 100) * P.mCart,
      rfE,
    };
  };
  // volume mensal em que FIDC = bancária; ∞ se a taxa do FIDC não for menor
  M.breakEven = (rb, rfE, F, mDup) => (rfE >= rb ? Infinity : F / (12 * mDup * (rb - rfE) / 100));
  M.estado = function (C, P) {
    const c = M.custos(C, P);
    const Vstar = M.breakEven(C.rb, c.rfE, C.F, P.mDup);
    return { ...c, Vstar, vence: c.fidc < c.banc ? 'fidc' : 'banc' };
  };
  // cascata de cotas: a perda consome a subordinada antes da sênior
  M.cascata = function (carteira, pSub, inad) {
    const sub = carteira * pSub / 100, sen = carteira - sub;
    const perda = carteira * inad / 100;
    const pSubP = Math.min(perda, sub);
    const pSenP = Math.min(Math.max(perda - sub, 0), sen);
    return {
      carteira, perda,
      cotas: [
        { id: 'sub', valor: sub, perda: pSubP, resta: sub - pSubP },
        { id: 'sen', valor: sen, perda: pSenP, resta: sen - pSenP },
      ],
      faixa: perda <= sub + 1e-9 ? 'sub' : 'sen',
    };
  };
  // árvore das quatro perguntas (slide 7 de V4.8) → recomendação
  M.recomenda = function (q) {
    if (q.perfil === 'cartao') return 'cartao';
    if (q.vol === 'baixo' || q.rec === 'pontual') return 'banc_pontual';
    if (q.ap === 'nao') return 'banc_estrut';
    if (q.perfil === 'b2b') return 'banc_carteira';
    return 'fidc';
  };
  root.M48 = M;
})(typeof window !== 'undefined' ? window : globalThis);
