/* D4.5 · Score, cutoff e decisão — funções puras (sem DOM).
   V = linhas do dataset de variáveis (rho, beta, media, escala, transf, min, max, horizonte)
   G = linha do dataset de geradores (N, semente, alfa, gama, intercepto, escalaBeta, colBeta). PD em fração (0–1). */
(function (root) {
  const M = {};
  M.sig = (z) => 1 / (1 + Math.exp(-z));
  // LCG (s·1664525 + 1013904223 mod 2³²) e normal por Box-Muller
  M.rng = function (seed) {
    let s = seed >>> 0, extra = null;
    const u = () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 4294967296; };
    const n = () => {
      if (extra != null) { const e = extra; extra = null; return e; }
      const u1 = 1 - u(), u2 = u(), r = Math.sqrt(-2 * Math.log(u1));
      extra = r * Math.sin(2 * Math.PI * u2);
      return r * Math.cos(2 * Math.PI * u2);
    };
    return { u, n };
  };
  const sinal = (i) => (i === 1 || i === 4 ? 1 : -1);   // x̃ = (−z̃₁, +z̃₂, −z̃₃, −z̃₄, +z̃₅)
  // valor exibido a partir da padronizada
  M.exibe = (v, x) => {
    const raw = v.transf === 'exp' ? Math.exp(v.media + v.escala * x) : v.media + v.escala * x;
    const c = Math.min(v.max, Math.max(v.min, raw));
    return v.arred === 'int' ? Math.round(c) : c;
  };
  // padronizada a partir do valor exibido (Horizonte)
  M.inverte = (v, y) => (v.transf === 'exp' ? (Math.log(y) - v.media) / v.escala : (y - v.media) / v.escala);
  M.logit = (x, V, G) => {
    let z = G.intercepto;
    for (let i = 0; i < V.length; i++) z += G.escalaBeta * V[i][G.colBeta] * x[i];
    return z;
  };
  M.contrib = (x, V, G) => V.map((v, i) => G.escalaBeta * v[G.colBeta] * x[i]);
  // carteira: sacado nº 1 = Comercial Horizonte (variáveis fixas, adimplente)
  M.carteira = function (V, G) {
    const R = M.rng(G.semente), out = [];
    for (let k = 0; k < G.N; k++) {
      const r = R.n();
      const x = V.map((v, i) => sinal(i) * (v.rho * r + Math.sqrt(1 - v.rho * v.rho) * R.n()));
      const u = R.u();
      let mau = u < M.sig(G.alfa + G.gama * r) ? 1 : 0;
      let xx = x;
      if (k === 0) { xx = V.map((v) => M.inverte(v, v.horizonte)); mau = 0; }
      out.push({ id: k + 1, x: xx, mau, pd: M.sig(M.logit(xx, V, G)) });
    }
    return out;
  };
  M.faixa = (pd, cV, cR) => (pd < cV ? 'verde' : pd < cR ? 'warm' : 'vermelho');
  M.funil = function (C, cV, cR) {
    const f = { verde: { n: 0, maus: 0 }, warm: { n: 0, maus: 0 }, vermelho: { n: 0, maus: 0 } };
    C.forEach((s) => { const k = M.faixa(s.pd, cV, cR); f[k].n++; f[k].maus += s.mau; });
    const N = C.length;
    Object.keys(f).forEach((k) => { f[k].pct = f[k].n / N; f[k].taxa = f[k].n ? f[k].maus / f[k].n : 0; f[k].bons = f[k].n - f[k].maus; });
    return f;
  };
  M.ks = function (C) {
    const s = C.slice().sort((a, b) => a.pd - b.pd);
    const nm = s.reduce((a, c) => a + c.mau, 0), nb = s.length - nm;
    let fm = 0, fb = 0, ks = 0;
    for (let i = 0; i < s.length; i++) {
      if (s[i].mau) fm++; else fb++;
      if (i === s.length - 1 || s[i + 1].pd !== s[i].pd) ks = Math.max(ks, Math.abs(fm / nm - fb / nb));
    }
    return ks;
  };
  M.auc = function (C) {
    const s = C.map((c) => ({ pd: c.pd, mau: c.mau })).sort((a, b) => a.pd - b.pd);
    let somaRank = 0, i = 0;
    while (i < s.length) {
      let j = i; while (j + 1 < s.length && s[j + 1].pd === s[i].pd) j++;
      const rk = (i + j + 2) / 2;
      for (let t = i; t <= j; t++) if (s[t].mau) somaRank += rk;
      i = j + 1;
    }
    const nm = s.reduce((a, c) => a + c.mau, 0), nb = s.length - nm;
    return (somaRank - nm * (nm + 1) / 2) / (nm * nb);
  };
  M.taxaMaus = (C) => C.reduce((a, c) => a + c.mau, 0) / C.length;
  // histograma: nb bins de largura w (fração de PD) + bin final "acima"
  M.hist = function (C, nb, w) {
    const b = Array.from({ length: nb + 1 }, (_, i) => ({ i, lo: i * w, hi: i < nb ? (i + 1) * w : null, bons: 0, maus: 0 }));
    C.forEach((s) => { const k = Math.min(nb, Math.floor(s.pd / w)); if (s.mau) b[k].maus++; else b[k].bons++; });
    return b;
  };
  // memo simples por chave
  const memo = {};
  M.carteiraMemo = (V, G) => { const k = JSON.stringify([V, G]); if (!memo[k]) { const C = M.carteira(V, G); memo[k] = { C, ks: M.ks(C), auc: M.auc(C), taxa: M.taxaMaus(C) }; } return memo[k]; };
  root.M45 = M;
})(typeof window !== 'undefined' ? window : globalThis);
