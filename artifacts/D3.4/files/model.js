/* D3.4 · Dente de serra — funções puras (sem DOM).
   P = parâmetros do item (dataset), C = controles. Unidades: rolos, dias úteis, R$. */
(function (root) {
  const M = {};
  // gerador determinístico: LCG + Box-Muller
  M.rng = function (seed) {
    let s = seed >>> 0, spare = null;
    const u = () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return (s + 0.5) / 4294967296; };
    const n = () => {
      if (spare != null) { const v = spare; spare = null; return v; }
      const a = u(), b = u(), r = Math.sqrt(-2 * Math.log(a)), t = 2 * Math.PI * b;
      spare = r * Math.sin(t);
      return r * Math.cos(t);
    };
    return { u, n };
  };
  M.H = (P, C) => P.preco * (C.cdi / 100 + P.outrosH);            // R$/rolo·ano
  // ES em rolos inteiros (arredondado), ROP = d·LT + ES
  M.esExato = (C) => (C.incluiLT && C.sigmaLT > 0 ? C.z * Math.sqrt(C.LT * C.sigma ** 2 + C.d ** 2 * C.sigmaLT ** 2) : C.z * C.sigma * Math.sqrt(C.LT));
  M.es = (C) => Math.round(M.esExato(C));
  M.rop = (C) => C.d * C.LT + M.es(C);
  // simulação (Q, R) por posição de estoque (em mãos + a receber)
  M.simula = function (P, C, dias) {
    const R = M.rng(P.seed);
    const ES = M.es(C), ROP = M.rop(C), LTreal = C.choque ? 2 * C.LT : C.LT;
    let inv = ROP + C.Q, perdidos = 0, demTot = 0, ciclos = 0, ciclosRup = 0, rupCiclo = false;
    const pend = [], serie = [];
    for (let t = 0; t < dias; t++) {
      let chegou = false;
      for (let i = pend.length - 1; i >= 0; i--) if (pend[i].chega === t) { inv += pend[i].q; pend.splice(i, 1); chegou = true; }
      if (chegou) { ciclos++; if (rupCiclo) ciclosRup++; rupCiclo = false; }
      const dem = Math.max(0, C.d + C.sigma * R.n());
      demTot += dem;
      let falta = 0;
      if (dem > inv) { falta = dem - inv; perdidos += falta; inv = 0; rupCiclo = true; } else inv -= dem;
      let pos = inv + pend.reduce((a, p) => a + p.q, 0), pediu = false;
      while (pos <= ROP) {
        const lt = C.sigmaLT > 0 ? Math.max(1, Math.round(LTreal + C.sigmaLT * R.n())) : LTreal;
        pend.push({ chega: t + lt, q: C.Q }); pos += C.Q; pediu = true;
      }
      serie.push({ t, inv, falta, pediu, chegou });
    }
    const ano = P.diasUteis / dias;
    const H = M.H(P, C);
    const perdAno = perdidos * ano;
    return {
      ES, ROP, H, serie, ciclos, ciclosRup, rupt: ciclos ? ciclosRup / ciclos : 0,
      fill: demTot ? 1 - perdidos / demTot : 1, perdAno,
      custoES: ES * H, custoRup: perdAno * P.margem * (C.mult || 1), custo: ES * H + perdAno * P.margem * (C.mult || 1),
    };
  };
  root.M34 = M;
})(typeof window !== 'undefined' ? window : globalThis);
