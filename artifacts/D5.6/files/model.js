/* D5.6 · Covenants com buffer — funções puras (sem DOM).
   S = estado {ebitda, cp, lp, caixa, capex, buffer, sigma, tend (% a.a.), conversa (trimestres de antecedência; 0 = após o fechamento)}
   H = dados da Horizonte (objeto chave → valor) · C = covenants por id {limite, tipo} · F = taxas de waiver [{antecedencia, feePct}] */
(function (root) {
  const M = {};
  // despesas financeiras como proporção fixa da dívida bruta (1.000 / 5.500)
  M.taxaJuros = (H) => H.despFin / (H.dividaCP + H.dividaLP);
  M.indices = function (S, H) {
    const bruta = S.cp + S.lp, liq = bruta - S.caixa;
    const despFin = bruta * M.taxaJuros(H);
    return {
      bruta, liq, despFin,
      dl: liq / S.ebitda,
      icj: despFin > 0 ? S.ebitda / despFin : Infinity,
      lc: (H.aco + S.caixa) / (H.pco + S.cp),
      ac: H.aco + S.caixa, pc: H.pco + S.cp,
    };
  };
  // gatilho interno: teto → limite × b ; piso → limite ÷ b
  M.gatilho = (lim, tipo, b) => (tipo === 'teto' ? lim * b : lim / b);
  M.zona = function (v, lim, tipo, b) {
    const g = M.gatilho(lim, tipo, b);
    if (tipo === 'teto') return v < g ? 'verde' : v <= lim ? 'amarelo' : 'vermelho';
    return v > g ? 'verde' : v >= lim ? 'amarelo' : 'vermelho';
  };
  M.folga = (v, lim, tipo) => (tipo === 'teto' ? (lim - v) / lim : (v - lim) / lim);
  const RANK = { verde: 0, amarelo: 1, vermelho: 2 };
  M.estado = function (S, H, C) {
    const I = M.indices(S, H);
    const covs = ['dl', 'icj', 'lc'].map((id) => {
      const c = C[id], v = I[id];
      return { id, valor: v, limite: c.limite, tipo: c.tipo, gatilho: M.gatilho(c.limite, c.tipo, S.buffer), zona: M.zona(v, c.limite, c.tipo, S.buffer), folga: M.folga(v, c.limite, c.tipo) };
    });
    const capex = { valor: S.capex, limite: C.capex.limite, gatilho: M.gatilho(C.capex.limite, 'teto', S.buffer), zona: M.zona(S.capex, C.capex.limite, 'teto', S.buffer) };
    const divid = { permitido: I.dl < C.div.limite, limite: C.div.limite };
    // o mais próximo do limite (menor folga); em empate de folga, o de pior zona
    const pior = covs.slice().sort((a, b) => a.folga - b.folga || RANK[b.zona] - RANK[a.zona])[0];
    const zonaMax = covs.reduce((z, c) => (RANK[c.zona] > RANK[z] ? c.zona : z), 'verde');
    const vermelhos = covs.filter((c) => c.zona === 'vermelho').sort((a, b) => a.folga - b.folga);
    const amarelos = covs.filter((c) => c.zona === 'amarelo').sort((a, b) => a.folga - b.folga);
    return { I, covs, capex, divid, pior, zonaMax, vermelhos, amarelos };
  };
  // projeção de 8 trimestres; choque pessimista acumulado = 2σ√(t/4)
  M.projecao = function (S, H, C, n = 8) {
    const taxa = M.taxaJuros(H), bruta0 = S.cp + S.lp, tend = S.tend / 100;
    const pts = [];
    for (let t = 0; t <= n; t++) {
      const eb = S.ebitda * Math.pow(1 + tend, t / 4);
      const ep = eb * (1 - 2 * S.sigma * Math.sqrt(t / 4));
      const div = t === 0 ? bruta0 : Math.max(Math.min(H.pisoDivida, bruta0), bruta0 - H.amortTri * t);
      const df = div * taxa, liq = div - S.caixa;
      pts.push({ t, ebBase: eb, ebPess: ep, divida: div, despFin: df, dlBase: liq / eb, dlPess: liq / ep, icjBase: df > 0 ? eb / df : Infinity, icjPess: df > 0 ? ep / df : Infinity });
    }
    const cruza = (k, nivel) => {
      const c = C[k], lim = nivel === 'limite' ? c.limite : M.gatilho(c.limite, c.tipo, S.buffer);
      const p = pts.find((q) => q.t >= 1 && (c.tipo === 'teto' ? q[k + 'Pess'] > lim : q[k + 'Pess'] < lim));
      return p ? p.t : null;
    };
    const primeiro = (nivel) => {
      const a = cruza('dl', nivel), b = cruza('icj', nivel);
      if (a == null && b == null) return null;
      if (b != null && (a == null || b <= a)) return { t: b, id: 'icj' };
      return { t: a, id: 'dl' };
    };
    return { pts, limite: primeiro('limite'), gatilho: primeiro('gatilho'), cruza };
  };
  // três caminhos
  M.caminhos = function (S, H, F) {
    const fee = (a) => { const r = F.find((x) => x.antecedencia === a); return r ? r.feePct / 100 * H.principalCov : null; };
    return {
      waiver: fee(S.conversa),
      tardio: fee(0),
      reneg: H.renegBps / 10000 * H.principalCov * H.remanescente,
      renegMin: H.renegMinBps / 10000 * H.principalCov * H.remanescente,
      renegMax: H.renegMaxBps / 10000 * H.principalCov * H.remanescente,
      quebra: H.principalCov + H.crossDefault,
      descoberto: H.principalCov + H.crossDefault - S.caixa,
    };
  };
  root.M56 = M;
})(typeof window !== 'undefined' ? window : globalThis);
