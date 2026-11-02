/* D5.3 · Cardápio de instrumentos — funções puras (sem DOM).
   Valores em R$ mil; taxas em % a.a. (números como 17 = 17%). */
(function (root) {
  const M = {};

  /* ---------- aba 1 · cardápio ---------- */
  // instrumentos visíveis, com CET = CDI + spread sobre o CDI (sp), ordenados do menor CET para o maior
  // instr: [{id, cet, soExportador, ...}] (cet de referência a CDI = cdiRef); sp: {id: spread}; ACC/ACE só se exporta
  M.ranking = function (instr, cdi, sp, exporta) {
    return instr
      .filter((r) => exporta || !Number(r.soExportador))
      .map((r) => ({ ...r, cetAtual: cdi + sp[r.id] }))
      .sort((a, b) => a.cetAtual - b.cetAtual);
  };
  // gatilhos {cresc, saz, pric, hedge} → instrumentos casados
  // cresc → CG linha · saz → CG rotativo · pric → qualquer bancário com CET abaixo do pricing embutido
  // hedge → ACC/ACE se exporta; senão nenhum
  M.casados = function (vis, g, exporta, pricing) {
    const ids = new Set();
    const por = { cresc: [], saz: [], pric: [], hedge: [] };
    vis.forEach((r) => {
      if (g.cresc && r.gatilho === 'cresc') por.cresc.push(r.id);
      if (g.saz && r.gatilho === 'saz') por.saz.push(r.id);
      if (g.pric && Number(r.bancario) && r.cetAtual < pricing) por.pric.push(r.id);
      if (g.hedge && exporta && r.gatilho === 'hedge') por.hedge.push(r.id);
    });
    Object.values(por).forEach((l) => l.forEach((id) => ids.add(id)));
    const ligados = ['cresc', 'saz', 'pric', 'hedge'].filter((k) => g[k]);
    // instrumento casado principal: o de menor CET entre os casados
    const principal = vis.find((r) => ids.has(r.id)) || null;
    return { ids, por, ligados, principal };
  };

  /* ---------- aba 2 · conta garantida ---------- */
  // custo de V (R$ mil) por `dias` à taxa anual (% a.a.): simples/365 (padrão, reproduz o slide) ou composto/360
  M.custo = (V, taxa, dias, conv) => (conv === 'composto'
    ? V * (Math.pow(1 + taxa / 100, dias / 360) - 1)
    : V * (taxa / 100) * dias / 365);
  M.comparativo = function (V, dias, cdi, spRot, spCG, conv, limite) {
    const rot = M.custo(V, cdi + spRot, dias, conv);
    const cg = M.custo(V, cdi + spCG, dias, conv);
    return { rot, cg, dif: cg - rot, difPct: rot > 0 ? cg / rot - 1 : NaN, alarme: dias > limite, taxaRot: cdi + spRot, taxaCG: cdi + spCG };
  };

  /* ---------- aba 3 · vendor finance (valores anuais) ---------- */
  // p: {compras, prazo, fAlfa, perda, tVendor, desc, alt} — taxas em % a.a., perda e desconto em %
  M.vendor = function (p) {
    const saldo = p.compras * p.prazo / 360;
    const alfaSem = saldo * p.fAlfa / 100 + p.compras * p.perda / 100;
    const alfaCom = p.compras * p.desc / 100;
    const horSem = saldo * p.alt / 100;
    const juros = saldo * p.tVendor / 100;
    const descRS = p.compras * p.desc / 100;
    const horCom = juros - descRS;
    return {
      saldo, alfaSem, alfaCom, gAlfa: alfaSem - alfaCom,
      horSem, horCom, gHor: horSem - horCom,
      taxaEf: saldo > 0 ? horCom / saldo : NaN,
      banco: juros, aVista: p.compras * (1 - p.desc / 100), descRS,
      carrega: saldo * p.fAlfa / 100, perdaRS: p.compras * p.perda / 100,
    };
  };
  // diagnóstico: 'ambos' · 'alfaperde' · 'horperde' (podem valer os dois últimos)
  M.vendorFrases = function (R) {
    const eps = 1e-9;
    const k = [];
    if (R.gAlfa > eps && R.gHor > eps) return ['ambos'];
    if (R.gAlfa <= eps) k.push('alfaperde');
    if (R.gHor <= eps) k.push('horperde');
    return k;
  };

  root.M53 = M;
})(typeof window !== 'undefined' ? window : globalThis);
