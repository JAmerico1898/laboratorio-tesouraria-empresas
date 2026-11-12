/* D2.6 · Excedentes — funções puras (sem DOM). Taxas em % a.a., dias corridos, base 365.
   T = tabelas do caso: { ir:[{ate,aliquota}], iof:[pct dia 1..30], base, cc:{aliq, semestre} } */
(function (root) {
  const M = {};
  M.tabelas = (irRows, iofRows, caso) => ({
    ir: irRows.map((r) => ({ ate: Number(r.ate), aliquota: Number(r.aliquota) })).sort((a, b) => a.ate - b.ate),
    iof: iofRows.slice().sort((a, b) => a.dia - b.dia).map((r) => Number(r.pct) / 100),
    base: Number(caso.base), cc: { aliq: Number(caso.aliqComeCotas), semestre: Number(caso.semestreDias) },
  });
  M.ir = (d, T) => { for (const f of T.ir) if (d <= f.ate) return f.aliquota; return T.ir[T.ir.length - 1].aliquota; };
  M.iof = (d, T) => (d >= 1 && d <= T.iof.length ? T.iof[d - 1] : 0);   // % do rendimento; dia 30 em diante = 0
  M.bruto = (i, d, T) => Math.pow(1 + i / 100, d / T.base) - 1;
  M.anual = (r, d, T) => Math.pow(1 + r, T.base / d) - 1;
  // Uma aplicação: {taxa (% a.a.), dias, tipo}. Retorna as parcelas como fração do principal no período.
  M.aplic = (a, T) => {
    const d = Math.max(1, Math.round(a.dias)), i = a.taxa, aliq = M.ir(d, T), iofPct = M.iof(d, T);
    const bruto = M.bruto(i, d, T);
    if (a.tipo !== 'fundo') {
      const iof = bruto * iofPct, ir = (bruto - iof) * aliq, liquido = bruto - iof - ir;
      return { dias: d, tipo: a.tipo, aliq, iofPct, bruto, iof, ir, cc: 0, liquido, liqAnual: M.anual(liquido, d, T), eventos: 0 };
    }
    // Fundo aberto: come-cotas a cada semestre completo (convenção: aplicação logo após um evento, eventos em 182,5, 365, … dias),
    // 15% sobre o ganho desde o último evento, cobrado em cotas; no resgate, IR(d) sobre o ganho desde o último evento
    // mais o complemento (IR(d) − 15%) sobre os ganhos já tributados; IOF só se d < 30 (antes de qualquer evento).
    const P = (t) => Math.pow(1 + i / 100, t / T.base);
    let q = 1, base = 1, ccPago = 0, ganhoAnt = 0, ev = 0;
    for (let t = T.cc.semestre; t < d - 1e-9; t += T.cc.semestre) {
      const Pt = P(t), g = q * (Pt - base), tax = T.cc.aliq * g;
      ccPago += tax; ganhoAnt += g; q -= tax / Pt; base = Pt; ev++;
    }
    const Pd = P(d), gFinal = q * (Pd - base);
    const iof = gFinal * iofPct;
    const ir = (gFinal - iof) * aliq + Math.max(0, aliq - T.cc.aliq) * ganhoAnt;
    const liquido = q * Pd - iof - ir - 1;
    // "come-cotas" no gráfico = imposto antecipado + capitalização perdida (diferença até o bruto do CDB equivalente)
    const cc = bruto - liquido - iof - ir;
    return { dias: d, tipo: 'fundo', aliq, iofPct, bruto, iof, ir, cc, ccPago, liquido, liqAnual: M.anual(liquido, d, T), eventos: ev };
  };
  // A renovado até o prazo de B: n = arredondamento de dB/dA (mínimo 1)
  M.reinvest = (rA, dB) => { const n = Math.max(1, Math.round(dB / rA.dias)); return { n, dias: n * rA.dias, periodo: Math.pow(1 + rA.liquido, n) - 1 }; };
  // motivo da vitória: 'iof' | 'comecotas' | 'aliquota' | 'taxa'
  M.motivo = (v, p) => (p.iof > v.iof + 1e-12 ? 'iof' : p.tipo === 'fundo' && v.tipo !== 'fundo' ? 'comecotas' : v.aliq < p.aliq - 1e-12 ? 'aliquota' : 'taxa');
  M.comparar = (A, B, T) => {
    const a = M.aplic(A, T), b = M.aplic(B, T);
    const venc = b.liqAnual > a.liqAnual ? 'B' : 'A';
    const v = venc === 'A' ? a : b, p = venc === 'A' ? b : a;
    return { a, b, venc, dif: Math.abs(a.liqAnual - b.liqAnual), motivo: M.motivo(v, p), reinv: a.dias < b.dias ? M.reinvest(a, b.dias) : null };
  };
  // degrau de IR: se d é o último dia de uma faixa, devolve {de, para}
  M.degrau = (d, T) => { const f = T.ir.findIndex((x) => x.ate === d); return f >= 0 && f < T.ir.length - 1 ? { de: T.ir[f].aliquota, para: T.ir[f + 1].aliquota } : null; };
  // pesos: renormaliza três sliders para somar 100 mantendo o que mudou
  M.renorm = (w, k) => {
    const out = w.slice(); out[k] = Math.min(100, Math.max(0, out[k]));
    const rest = 100 - out[k], idx = [0, 1, 2].filter((j) => j !== k), o = idx.reduce((s, j) => s + out[j], 0);
    idx.forEach((j) => { out[j] = o > 0 ? out[j] / o * rest : rest / 2; });
    return out;
  };
  // horizonte até o resgate: do mês da aplicação ao 1º mês com saldo negativo depois dela
  M.horizonte = (saldos, mesAplic, diasMes) => {
    let neg = -1; for (let m = mesAplic + 1; m < saldos.length; m++) if (saldos[m] < 0) { neg = m; break; }
    let fim = neg; if (neg >= 0) for (let m = neg; m < saldos.length && saldos[m] < 0; m++) fim = m;
    return { mesNeg: neg, mesFimNeg: fim, meses: neg < 0 ? null : neg - mesAplic, dias: neg < 0 ? null : (neg - mesAplic) * diasMes };
  };
  // carteira por tiers. tiers: [{pct, inst:{taxa, prazo, tipo, diaria}}]
  M.carteira = (excedente, tiers, T, hz) => {
    const soma = tiers.reduce((s, t) => s + t.pct, 0) || 1;
    const linhas = tiers.map((t, j) => {
      const valor = excedente * t.pct / soma;
      const r = M.aplic({ taxa: t.inst.taxa, dias: t.inst.prazo, tipo: t.inst.tipo }, T);
      const rh = hz.dias ? M.aplic({ taxa: t.inst.taxa, dias: hz.dias, tipo: t.inst.tipo }, T) : null;
      const preso = !t.inst.diaria && hz.dias != null && t.inst.prazo > hz.dias && valor > 0;
      return { tier: j + 1, peso: t.pct / soma, valor, r, ganhoHz: rh ? valor * rh.liquido : null, preso };
    });
    return { linhas, liqAnual: linhas.reduce((s, l) => s + l.peso * l.r.liqAnual, 0),
      ganhoHz: hz.dias ? linhas.reduce((s, l) => s + l.ganhoHz, 0) : null, presos: linhas.filter((l) => l.preso).map((l) => l.tier) };
  };
  // vértices do tripé: parcela do excedente em tiers que priorizam cada vértice
  M.tripe = (tiers) => { const soma = tiers.reduce((s, t) => s + t.pct, 0) || 1, o = {}; tiers.forEach((t) => { o[t.prioridade] = (o[t.prioridade] || 0) + t.pct / soma; }); return o; };
  // contraparte. em: [{emissor, pct, rating}], escala: {rating: ordem}, R: {minEmissores, maxEmissores, tetoEmissor, ratingMinimo}
  M.contraparte = (em, total, escala, R) => {
    const soma = em.reduce((s, e) => s + Math.max(0, e.pct), 0);
    const lin = em.map((e) => {
      const share = soma > 0 ? Math.max(0, e.pct) / soma : 0, ativo = share > 0;
      return { ...e, share, valor: total * share, ativo, acimaTeto: ativo && share > R.tetoEmissor + 1e-9,
        abaixoRating: ativo && (escala[e.rating] == null || escala[e.rating] > escala[R.ratingMinimo]) };
    });
    const ativos = lin.filter((l) => l.ativo), maior = ativos.reduce((m, l) => (!m || l.share > m.share ? l : m), null);
    return { lin, soma, nAtivos: ativos.length, maior,
      regraDiv: ativos.length >= R.minEmissores && ativos.length <= R.maxEmissores,
      regraTeto: !ativos.some((l) => l.acimaTeto), regraRating: !ativos.some((l) => l.abaixoRating),
      intacto: maior ? 1 - maior.share : null };
  };
  root.M25 = M;
})(typeof window !== 'undefined' ? window : globalThis);
