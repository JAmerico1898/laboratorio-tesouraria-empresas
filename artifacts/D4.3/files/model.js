/* D4.3 · Política A → Δ → B — funções puras (sem DOM).
   P = parâmetros: pmrA, rA, iA (%), pmrB, rB, iB (%), m (%), cc (% a.a.), admin (R$ mil/ano).
   F = flags: armadilha, vpl. Valores em R$ mil/ano. */
(function (root) {
  const M = {};
  // VPL 3 anos (Spec §4.2/§5): rampa da receita e da inadimplência incrementais
  M.RAMPA_REC = [0.5, 1, 1];
  M.RAMPA_INAD = [0.25, 0.75, 1];

  M.calc = function (P, F) {
    F = F || {};
    const m = P.m / 100, cc = P.cc / 100, iA = P.iA / 100, iB = P.iB / 100;
    const dRec = P.rB - P.rA;
    const mcA = P.rA * m, mcB = P.rB * m, dR = mcB - mcA;
    const inadA = iA * P.rA, inadB = iB * P.rB;
    const dInad = inadB - inadA;                 // correto
    const dInadErr = iB * dRec;                  // armadilha do Termo 2
    const dInadUsado = F.armadilha ? dInadErr : dInad;
    const crA = P.rA * P.pmrA / 360, crB = P.rB * P.pmrB / 360, dCR = crB - crA;
    const custoA = crA * cc, custoB = crB * cc, dNCG = dCR * cc;
    const admin = P.admin;
    const GLc = dR - dInad - dNCG - admin;
    const GLerr = dR - dInadErr - dNCG - admin;
    const GL = F.armadilha ? GLerr : GLc;
    const anos = M.RAMPA_REC.map((w, t) => {
      const rec = dR * w, inad = dInadUsado * M.RAMPA_INAD[t];
      const gl = rec - inad - dNCG - admin, fd = 1 / Math.pow(1 + cc, t + 1);
      return { ano: t + 1, rec, inad, ncg: dNCG, adm: admin, gl, fd, vp: gl * fd };
    });
    const VPL = anos.reduce((s, a) => s + a.vp, 0);
    const valor = F.vpl ? VPL : GL;
    return {
      dRec, g: P.rA ? dRec / P.rA : 0, mcA, mcB, dR, inadA, inadB, dInad, dInadErr, dInadUsado,
      crA, crB, dCR, custoA, custoB, dNCG, admin, GLc, GLerr, GL, anos, VPL, valor,
      soma: dInadUsado + dNCG + admin, pctRB: P.rB ? valor / P.rB : 0,
    };
  };

  // choque de sensibilidade sobre um estado: crescimento ± p.p., inadimplência de B ± p.p., admin × fator
  M.choque = function (P, s) {
    const g = P.rA ? P.rB / P.rA - 1 : 0;
    return { ...P, rB: P.rA * (1 + g + s.choqueR), iB: P.iB + s.choqueInad * 100, admin: P.admin * s.fatorAdmin };
  };

  // valores (GL ou VPL) de cada cenário de sensibilidade sobre o estado-base
  M.tornado = function (P, F, sens) {
    return sens.map((s) => ({ cenario: s.cenario, valor: M.calc(M.choque(P, s), F).valor }));
  };

  // PASSA: > 0 nos três · FRÁGIL: base > 0 e algum < 0 · NÃO PASSA: base ≤ 0
  M.decisao = function (torn) {
    const base = torn.find((t) => t.cenario === 'base');
    if (!base || !(base.valor > 0)) return 'naopassa';
    return torn.every((t) => t.valor > 0) ? 'passa' : 'fragil';
  };
  M.sinalFragil = (torn) => torn.some((t) => t.valor > 0) && torn.some((t) => t.valor < 0);

  root.M43 = M;
})(typeof window !== 'undefined' ? window : globalThis);
