/* D3.2 · Curva ABC × XYZ — funções puras (sem DOM).
   P = parâmetros do gerador (dataset), C = controles. R$ mil. */
(function (root) {
  const M = {};
  // 3.500 SKUs: valor de Zipf e CV por LCG (semente fixa, independente da posição)
  M.gera = function (P) {
    const N = P.N;
    let HN = 0;
    for (let j = 1; j <= N; j++) HN += 1 / j;
    let s = P.seed >>> 0;
    const u = () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 4294967296; };
    const skus = [];
    let acc = 0;
    for (let k = 1; k <= N; k++) {
      const v = P.cmv * (1 / k) / HN;
      const cumAnt = acc / P.cmv;
      acc += v;
      const uk = u();
      skus.push({ k, v, cumAnt, cum: acc / P.cmv, cv: P.cvMin + P.cvAmp * uk * uk });
    }
    return { skus, HN };
  };
  M.classe = function (sku, C, N) {
    if (C.criterio === 'valor') return sku.cumAnt < C.ab / 100 ? 'A' : sku.cumAnt < C.bc / 100 ? 'B' : 'C';
    return sku.k <= N * C.ab / 100 ? 'A' : sku.k <= N * C.bc / 100 ? 'B' : 'C';
  };
  M.xyz = (sku, C) => (sku.cv < C.x1 ? 'X' : sku.cv < C.x2 ? 'Y' : 'Z');
  M.resumo = function (G, P, C) {
    const N = P.N, cls = { A: { n: 0, v: 0 }, B: { n: 0, v: 0 }, C: { n: 0, v: 0 } };
    const mat = {}; ['A', 'B', 'C'].forEach((a) => ['X', 'Y', 'Z'].forEach((x) => { mat[a + x] = { n: 0, v: 0 }; }));
    const xyz = { X: 0, Y: 0, Z: 0 };
    const lab = new Array(N);
    G.skus.forEach((s, i) => {
      const a = M.classe(s, C, N), x = M.xyz(s, C);
      lab[i] = a + x;
      cls[a].n++; cls[a].v += s.v; mat[a + x].n++; mat[a + x].v += s.v; xyz[x]++;
    });
    // fronteiras: último SKU de A e de B, primeiro de B e de C
    const fronteiras = [];
    for (let i = 1; i < N; i++) if (lab[i][0] !== lab[i - 1][0]) fronteiras.push(i - 1, i);
    // nº de SKUs que somam 80% do valor
    const n80 = G.skus.findIndex((s) => s.cum >= 0.8) + 1;
    return {
      cls, mat, xyz, lab, fronteiras, n80, pct80: n80 / N,
      carregA: P.hEstoque * P.estoque * cls.A.v / P.cmv,
      topPct: (p) => { const n = Math.round(N * p); return G.skus[n - 1].cum; },
    };
  };
  // curva acumulada amostrada (1 ponto a cada `passo` SKUs, mais o 0 e o último)
  M.curva = function (G, passo = 10) {
    const out = [{ x: 0, y: 0, k: 0 }];
    const N = G.skus.length;
    for (let k = passo; k <= N; k += passo) out.push({ x: k / N, y: G.skus[k - 1].cum, k });
    if (out[out.length - 1].k !== N) out.push({ x: 1, y: 1, k: N });
    return out;
  };
  root.M32 = M;
})(typeof window !== 'undefined' ? window : globalThis);
