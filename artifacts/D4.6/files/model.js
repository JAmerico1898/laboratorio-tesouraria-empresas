/* D4.6 · KS, AUC e PSI — funções puras (sem DOM).
   P = parâmetros do gerador (dataset), C = controles {sep, taxa, deriva, corte}.
   Scores em pontos (0–1000, maior = melhor pagador). Trabalho interno em unidades z (desvios-padrão de cada classe). */
(function (root) {
  const M = {};

  /* ---------- gerador: LCG + Box-Muller, semente fixa ---------- */
  M.lcg = (seed) => { let s = seed >>> 0; return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 4294967296; }; };
  M.normais = (u, n) => {
    const out = new Float64Array(n);
    for (let i = 0; i < n; i += 2) {
      let u1 = u(); const u2 = u();
      if (u1 < 1e-12) u1 = 1e-12;
      const r = Math.sqrt(-2 * Math.log(u1)), a = 2 * Math.PI * u2;
      out[i] = r * Math.cos(a);
      if (i + 1 < n) out[i + 1] = r * Math.sin(a);
    }
    return out;
  };
  const stats = (a) => { let m = 0; for (const v of a) m += v; m /= a.length; let s = 0; for (const v of a) s += (v - m) * (v - m); return { m, v: s / (a.length - 1) }; };
  // Quatro reservatórios de normais padrão, gerados uma vez (números comuns): treino-bons, treino-maus, produção-bons, produção-maus.
  // Separação só translada os maus; deriva só translada a produção; taxa só pondera a mistura; cutoff só reclassifica.
  const cacheG = {};
  M.gerar = function (P) {
    const key = P.semente + ':' + P.n;
    if (cacheG[key]) return cacheG[key];
    const u = M.lcg(P.semente), n = P.n;
    const sorted = (a) => a.sort();
    const G = { n, zb: sorted(M.normais(u, n)), zm: sorted(M.normais(u, n)), pb: sorted(M.normais(u, n)), pm: sorted(M.normais(u, n)) };
    G.sb = stats(G.zb); G.sm = stats(G.zm);
    return (cacheG[key] = G);
  };

  /* ---------- utilitários ---------- */
  // nº de elementos de a (ordenado) < x
  const lt = (a, x) => { let lo = 0, hi = a.length; while (lo < hi) { const m = (lo + hi) >> 1; if (a[m] < x) lo = m + 1; else hi = m; } return lo; };
  M.dprime = (P, C) => (C.sep / 100) * P.fatorD;
  M.Phi = (x) => { // CDF normal (Abramowitz-Stegun 26.2.17), só para referência teórica
    const t = 1 / (1 + 0.2316419 * Math.abs(x)), d = 0.3989422804014327 * Math.exp(-x * x / 2);
    const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return x >= 0 ? 1 - p : p;
  };

  /* ---------- KS e AUC (treino; independem de taxa, deriva e cutoff) ---------- */
  M.ksAuc = function (G, dp) {
    const cacheKA = G.ka || (G.ka = {}), key = dp.toFixed(6);
    if (cacheKA[key]) return cacheKA[key];
    const b = G.zb, m = G.zm, n = G.n;
    let i = 0, j = 0, ks = 0, zks = 0, gt = 0;
    // varre os valores em ordem; maus em z' = zm − d'
    while (i < n || j < n) {
      const vb = i < n ? b[i] : Infinity, vm = j < n ? m[j] - dp : Infinity;
      let v;
      if (vb < vm) { gt += j; i++; v = vb; }   // AUC: cada bom conta os maus abaixo dele
      else { j++; v = vm; }
      const d = Math.abs(j / n - i / n);
      if (d > ks) { ks = d; zks = v; }
    }
    return (cacheKA[key] = { ks, zks, auc: gt / (n * n) });
  };

  /* ---------- mistura de treino e produção ---------- */
  M.sigmaTreino = (G, dp, t) => Math.sqrt((1 - t) * G.sb.v + t * G.sm.v + t * (1 - t) * Math.pow(G.sb.m - (G.sm.m - dp), 2));
  // deslocamento da produção em unidades z das classes (= pontos ÷ 100)
  M.desloc = (P, G, dp, t, deriva) => (deriva / 100) * P.fatorDeriva * M.sigmaTreino(G, dp, t);
  const Ftreino = (G, dp, t, x) => (1 - t) * lt(G.zb, x) / G.n + t * lt(G.zm, x + dp) / G.n;
  const Fprod = (G, dp, t, s, x) => (1 - t) * lt(G.pb, x + s) / G.n + t * lt(G.pm, x + dp + s) / G.n;
  M.decis = function (G, dp, t, k) {
    const cortes = [];
    for (let q = 1; q < k; q++) {
      let lo = -12, hi = 12;
      for (let it = 0; it < 60; it++) { const mid = (lo + hi) / 2; if (Ftreino(G, dp, t, mid) < q / k) lo = mid; else hi = mid; }
      cortes.push(hi);
    }
    return cortes;
  };
  M.psi = function (P, G, dp, t, deriva) {
    const s = M.desloc(P, G, dp, t, deriva), cortes = M.decis(G, dp, t, P.decis);
    const ed = [-Infinity, ...cortes, Infinity];
    const bins = [];
    let psi = 0;
    for (let k = 0; k < P.decis; k++) {
      const a = ed[k], b = ed[k + 1];
      const p = (b === Infinity ? 1 : Ftreino(G, dp, t, b)) - (a === -Infinity ? 0 : Ftreino(G, dp, t, a));
      const q = (b === Infinity ? 1 : Fprod(G, dp, t, s, b)) - (a === -Infinity ? 0 : Fprod(G, dp, t, s, a));
      const pp = Math.max(p, 1e-6), qq = Math.max(q, 1e-6);
      psi += (qq - pp) * Math.log(qq / pp);
      bins.push({ decil: k + 1, p, q, de: a, ate: b });
    }
    return { psi, bins, desloc: s };
  };

  /* ---------- funil pelo cutoff (base de treino de N contas) ---------- */
  M.funil = function (P, G, dp, t, corte) {
    const x = (corte - P.mediaBons) / P.dp;
    const fb = 1 - lt(G.zb, x) / G.n, fm = 1 - lt(G.zm, x + dp) / G.n;   // score ≥ corte
    const nb = P.n * (1 - t), nm = P.n * t;
    return { fracBons: fb, fracMaus: fm, bonsVerde: Math.round(nb * fb), mausVerde: Math.round(nm * fm), bonsAbaixo: Math.round(nb * (1 - fb)), mausAbaixo: Math.round(nm * (1 - fm)), nBons: Math.round(nb), nMaus: Math.round(nm) };
  };

  /* ---------- curvas para os gráficos ---------- */
  M.cdfs = function (P, G, dp, lo, hi, passo) {
    const out = [];
    for (let s = lo; s <= hi + 1e-9; s += passo) { const x = (s - P.mediaBons) / P.dp; out.push({ s, fb: lt(G.zb, x) / G.n, fm: lt(G.zm, x + dp) / G.n }); }
    return out;
  };
  M.roc = function (G, dp, pts) {
    // limiar descendo do score mais alto ao mais baixo: TPR = bons ≥ limiar (aprovados corretamente) · FPR = maus ≥ limiar
    const out = [{ fpr: 0, tpr: 0 }];
    for (let k = 1; k <= pts; k++) {
      const x = 6 - k * (12 + dp) / pts;
      out.push({ fpr: 1 - lt(G.zm, x + dp) / G.n, tpr: 1 - lt(G.zb, x) / G.n });
    }
    out.push({ fpr: 1, tpr: 1 });
    return out;
  };

  /* ---------- estado completo ---------- */
  M.estado = function (P, C) {
    const G = M.gerar(P), dp = M.dprime(P, C), t = C.taxa / 100;
    const ka = M.ksAuc(G, dp), ps = M.psi(P, G, dp, t, C.deriva), fu = M.funil(P, G, dp, t, C.corte);
    return {
      dp, t, ks: ka.ks, ksScore: P.mediaBons + P.dp * ka.zks, auc: ka.auc, psi: ps.psi, bins: ps.bins,
      deslocPts: ps.desloc * P.dp, deslocSigma: (C.deriva / 100) * P.fatorDeriva, sigmaTreino: M.sigmaTreino(G, dp, t) * P.dp,
      mediaMaus: P.mediaBons - P.dp * dp, funil: fu,
      ksTeo: 2 * M.Phi(dp / 2) - 1, aucTeo: M.Phi(dp / Math.SQRT2),
    };
  };
  root.M46 = M;
})(typeof window !== 'undefined' ? window : globalThis);
