/* D2.8 · Previsão de caixa com banda — funções puras (sem DOM).
   G = parâmetros fixos do gerador (dataset "gerador"), CAL = efeitos de calendário (dataset "calendario"),
   S = estado dos controles (defaults no dataset "cenarios"). Valores em R$ mil.
   Convenções adotadas onde a spec é omissa (ver NOTES.md):
   - média móvel "trailing" dos W dias anteriores a t (sem incluir t); com treino curto, W fica limitado à metade do treino;
   - efeitos sazonais estimados em sequência (dia da semana, depois dia do mês sobre o resíduo), nos três métodos;
   - tendência e efeitos estimados alternadamente (backfitting, 6 rodadas) para que o erro de treino caia com o grau;
   - tendência por MQO numa base de Chebyshev em t normalizado para [−1, 1] (mesmo polinômio do MQO em potências,
     resolvido por eliminação de Gauss com pivotamento parcial, sem estourar no grau 12);
   - MAPE de treino = erro um passo à frente dentro da amostra; MAPE de teste = previsão h passos à frente a partir do último dia do treino;
   - a série é gerada com fimTreino + hMax dias para que o horizonte de teste possa ir até 100. */
(function (root) {
  const M = {};

  M.lcg = (seed) => { let s = seed >>> 0; return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 4294967296; }; };
  M.normal = (u) => { let a = 0; for (let i = 0; i < 12; i++) a += u(); return a - 6; };

  // efeitos de calendário: CAL = [{tipo:'dow'|'dom', posicao, efeito}]
  M.calendario = (CAL) => {
    const dow = [0, 0, 0, 0, 0], dom = new Array(21).fill(0);
    (CAL || []).forEach((r) => { if (r.tipo === 'dow') dow[r.posicao] = r.efeito; else if (r.tipo === 'dom') dom[r.posicao] = r.efeito; });
    return { dow, dom };
  };

  // série sintética determinística (§3)
  M.gerar = (G, CAL, S) => {
    const c = M.calendario(CAL), N = G.fimTreino + G.hMax, u = M.lcg(G.semente), y = new Array(N);
    for (let t = 0; t < N; t++) {
      const e = M.normal(u);
      const semana = S.ampSem * c.dow[t % 5];
      const mes = S.ampMes * c.dom[t % 21];
      const quebra = S.quebra && t >= S.tQuebra ? S.magQuebra : 0;
      y[t] = G.nivel + semana + mes + S.beta * t + quebra + S.sigma * e;
    }
    return y;
  };

  // sistema linear A x = b por eliminação de Gauss com pivotamento parcial
  M.gauss = (A0, b0) => {
    const n = b0.length, A = A0.map((r) => r.slice()), b = b0.slice();
    for (let i = 0; i < n; i++) {
      let p = i; for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
      if (Math.abs(A[p][i]) < 1e-12) continue;
      [A[i], A[p]] = [A[p], A[i]]; [b[i], b[p]] = [b[p], b[i]];
      for (let r = i + 1; r < n; r++) { const f = A[r][i] / A[i][i]; if (!f) continue; for (let c = i; c < n; c++) A[r][c] -= f * A[i][c]; b[r] -= f * b[i]; }
    }
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) { if (Math.abs(A[i][i]) < 1e-12) { x[i] = 0; continue; } let s = b[i]; for (let c = i + 1; c < n; c++) s -= A[i][c] * x[c]; x[i] = s / A[i][i]; }
    return x;
  };
  // MQO: linhas X (arrays), y → coeficientes
  M.mqo = (X, y) => {
    const k = X[0].length, A = Array.from({ length: k }, () => new Array(k).fill(0)), b = new Array(k).fill(0);
    for (let i = 0; i < X.length; i++) { const x = X[i]; for (let a = 0; a < k; a++) { b[a] += x[a] * y[i]; for (let c = a; c < k; c++) A[a][c] += x[a] * x[c]; } }
    for (let a = 0; a < k; a++) for (let c = 0; c < a; c++) A[a][c] = A[c][a];
    return M.gauss(A, b);
  };
  const cheb = (u, g) => { const T = [1]; if (g >= 1) T.push(u); for (let k = 2; k <= g; k++) T.push(2 * u * T[k - 1] - T[k - 2]); return T; };

  // efeitos sequenciais por dia da semana e por dia útil do mês sobre um resíduo r(t), t ∈ [a, b]
  const efeitos = (r, a, b) => {
    const sd = [0, 0, 0, 0, 0], nd = [0, 0, 0, 0, 0];
    for (let t = a; t <= b; t++) { sd[t % 5] += r[t]; nd[t % 5]++; }
    const ed = sd.map((s, i) => (nd[i] ? s / nd[i] : 0));
    const sm = new Array(21).fill(0), nm = new Array(21).fill(0);
    for (let t = a; t <= b; t++) { sm[t % 21] += r[t] - ed[t % 5]; nm[t % 21]++; }
    const em = sm.map((s, i) => (nm[i] ? s / nm[i] : 0));
    return { dow: ed, dom: em, f: (t) => ed[t % 5] + em[t % 21] };
  };

  const mape = (y, yh, a, b) => { let s = 0, n = 0; for (let t = a; t <= b; t++) { if (yh[t] == null || !Number.isFinite(yh[t]) || y[t] === 0) continue; s += Math.abs(y[t] - yh[t]) / Math.abs(y[t]); n++; } return n ? (s / n) * 100 : NaN; };
  const desvio = (y, yh, a, b) => { const e = []; for (let t = a; t <= b; t++) if (yh[t] != null && Number.isFinite(yh[t])) e.push(y[t] - yh[t]); const m = e.reduce((x, z) => x + z, 0) / e.length; return Math.sqrt(e.reduce((x, z) => x + (z - m) ** 2, 0) / Math.max(1, e.length - 1)); };

  // 1. média móvel sazonal
  M.mediaMovel = (y, a, fim, H, W0) => {
    const W = Math.max(2, Math.min(W0, Math.floor((fim - a) / 2))); // treino curto: janela limitada à metade do treino
    const fit = new Array(y.length).fill(null), mm = new Array(y.length).fill(null);
    let s = 0;
    for (let t = a; t < fim; t++) { s += y[t]; if (t - a >= W) s -= y[t - W]; if (t - a >= W - 1 && t + 1 < fim) mm[t + 1] = s / W; }
    const a2 = a + W, r = new Array(y.length).fill(0);
    for (let t = a2; t < fim; t++) r[t] = y[t] - mm[t];
    const ef = efeitos(r, a2, fim - 1);
    for (let t = a2; t < fim; t++) fit[t] = mm[t] + ef.f(t);
    let base = 0; for (let t = fim - W; t < fim; t++) base += y[t]; base /= W;
    const prev = []; for (let k = 0; k < H; k++) prev.push(base + ef.f(fim + k));
    return { fit, prev, a: a2 };
  };

  // 2. decomposição clássica: tendência polinomial de grau g + efeitos
  M.decomposicao = (y, a, fim, H, g, iter = 6) => {
    const L = fim - 1 - a, uu = (t) => (L > 0 ? (2 * (t - a)) / L - 1 : 0);
    const X = []; for (let t = a; t < fim; t++) X.push(cheb(uu(t), g));
    const tendDe = (b) => (t) => { const T = cheb(uu(t), g); let v = 0; for (let k = 0; k < T.length; k++) v += b[k] * T[k]; return v; };
    // tendência e sazonalidade estimadas alternadamente (backfitting): converge ao MQO conjunto,
    // então o erro de treino cai sempre que o grau sobe
    let ef = { f: () => 0 }, tend = null;
    const r = new Array(y.length).fill(0);
    for (let it = 0; it < iter; it++) {
      const Y = []; for (let t = a; t < fim; t++) Y.push(y[t] - ef.f(t));
      tend = tendDe(M.mqo(X, Y));
      for (let t = a; t < fim; t++) r[t] = y[t] - tend(t);
      ef = efeitos(r, a, fim - 1);
    }
    const fit = new Array(y.length).fill(null);
    for (let t = a; t < fim; t++) fit[t] = tend(t) + ef.f(t);
    const prev = []; for (let k = 0; k < H; k++) prev.push(tend(fim + k) + ef.f(fim + k));
    return { fit, prev, a };
  };

  // 3. AR(p) por mínimos quadrados, previsão recursiva
  M.ar = (y, a, fim, H, p) => {
    const X = [], Y = [];
    for (let t = a + p; t < fim; t++) { const x = [1]; for (let j = 1; j <= p; j++) x.push(y[t - j]); X.push(x); Y.push(y[t]); }
    const b = M.mqo(X, Y);
    const fit = new Array(y.length).fill(null);
    for (let t = a + p; t < fim; t++) { let v = b[0]; for (let j = 1; j <= p; j++) v += b[j] * y[t - j]; fit[t] = v; }
    const hist = y.slice(0, fim), prev = [];
    for (let k = 0; k < H; k++) { const t = fim + k; let v = b[0]; for (let j = 1; j <= p; j++) v += b[j] * hist[t - j]; hist.push(v); prev.push(v); }
    return { fit, prev, a: a + p };
  };

  M.METODOS = ['mm', 'dec', 'ar'];

  // execução completa para um estado S
  M.rodar = (G, CAL, S) => {
    const y = M.gerar(G, CAL, S), fim = G.fimTreino, H = S.h, a = Math.min(S.inicio, fim - 10);
    const res = {
      mm: M.mediaMovel(y, a, fim, H, S.W),
      dec: M.decomposicao(y, a, fim, H, S.grau),
      ar: M.ar(y, a, fim, H, S.p),
    };
    M.METODOS.forEach((k) => {
      const r = res[k], yh = r.fit.slice(); r.prev.forEach((v, i) => { yh[fim + i] = v; });
      r.mapeTr = mape(y, r.fit, r.a, fim - 1);
      r.mapeTe = mape(y, yh, fim, fim + H - 1);
      r.razao = r.mapeTr > 0 ? r.mapeTe / r.mapeTr : r.mapeTe > 0 ? Infinity : NaN;
      r.sigma = desvio(y, r.fit, r.a, fim - 1);
    });
    const ordTe = M.METODOS.slice().sort((p, q) => res[p].mapeTe - res[q].mapeTe);
    const ordTr = M.METODOS.slice().sort((p, q) => res[p].mapeTr - res[q].mapeTr);
    const sel = res[ordTe[0]]; // cone do método que vence no teste
    const lo = [], hi = [];
    for (let k = 1; k <= H; k++) { const w = G.z * sel.sigma * Math.sqrt(k); lo.push(sel.prev[k - 1] - w); hi.push(sel.prev[k - 1] + w); }
    let alerta = null; for (let k = 0; k < H; k++) if (lo[k] < S.saldoMin) { alerta = k + 1; break; }
    const nTreino = fim - S.inicio;
    const cartoes = {
      curta: nTreino < G.limSerieCurta,
      quebra: !!S.quebra && S.inicio < S.tQuebra,
      overfit: M.METODOS.some((k) => res[k].razao > G.limRazao),
      semBanda: !S.cone,
    };
    return { y, fim, H, a, res, ordTe, ordTr, melhorTe: ordTe[0], melhorTr: ordTr[0], lo, hi, alerta,
      largura: G.z * sel.sigma * Math.sqrt(H), nTreino, cartoes, sel };
  };

  root.M27 = M;
})(typeof window !== 'undefined' ? window : globalThis);
