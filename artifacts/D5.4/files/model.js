/* D5.4 · Calculadora de CET — funções puras (sem DOM). Motor compartilhado com D2.7.
   Taxas em decimal (0,17 = 17%); valores em R$; prazo em meses.
   C = {P, n, cdi, spread, iofOn, iofFixo, iofDia, iofTeto, tarifa, tributos, garantia, recip, base: 252|360|365} */
(function (root) {
  const M = {};
  // meses por ano: mês = 21 du (252) ou 30 dias corridos (360/365)
  M.porAno = (base) => (Number(base) === 365 ? 365 / 30 : 12);
  M.diasAno = (base) => (Number(base) === 365 ? 365 : 360);   // anualização de um período em dias corridos
  M.taxaMensal = (nomAA) => Math.pow(1 + nomAA, 1 / 12) - 1;

  // parcelas Price (PMT constante)
  M.parcelas = function (P, im, n) {
    const out = [];
    let saldo = P;
    const pmt = im === 0 ? P / n : P * im / (1 - Math.pow(1 + im, -n));
    for (let k = 1; k <= n; k++) {
      const juros = saldo * im;
      const amort = pmt - juros;
      out.push({ k, juros, amort, saida: juros + amort });
      saldo -= amort;
    }
    return out;
  };

  // IOF crédito PJ: fixo sobre o principal + diário sobre cada amortização pelo seu prazo,
  // 30 dias corridos por parcela (fecha 11.987, §3.1), com teto em dias
  M.iof = function (P, parc, o) {
    if (!o.iofOn) return { fixo: 0, diario: 0, total: 0 };
    const fixo = o.iofFixo * P;
    const diario = parc.reduce((s, p) => s + p.amort * o.iofDia * Math.min(30 * p.k, o.iofTeto), 0);
    return { fixo, diario, total: fixo + diario };
  };

  // TIR por bisseção: fluxos [{t, v}], t em períodos; null se não houver troca de sinal
  M.vpl = (fl, r) => fl.reduce((s, f) => s + f.v / Math.pow(1 + r, f.t), 0);
  M.tir = function (fl, lo = -0.9, hi = 1, it = 300) {
    if (!fl.length || !fl.some((f) => f.v > 0) || !fl.some((f) => f.v < 0)) return null;
    let a = lo, b = hi, fa = M.vpl(fl, a), fb = M.vpl(fl, b);
    if (!Number.isFinite(fa) || !Number.isFinite(fb) || (fa > 0) === (fb > 0)) return null;
    for (let i = 0; i < it; i++) {
      const m = (a + b) / 2, fm = M.vpl(fl, m);
      if ((fm > 0) === (fa > 0)) { a = m; fa = fm; } else b = m;
    }
    return (a + b) / 2;
  };
  M.cet = (tirPer, porAno) => (tirPer == null ? null : Math.pow(1 + tirPer, porAno) - 1);

  // uma operação completa; `ate` limita as retenções (para o waterfall): 0 nominal · 1 +IOF · 2 +tarifa · 3 +tributos · 4 +garantia · 5 +reciprocidade
  M.operacao = function (C, ate = 5) {
    const nom = C.cdi + C.spread;
    const im = M.taxaMensal(nom);
    const parc = M.parcelas(C.P, im, C.n);
    const iofV = M.iof(C.P, parc, C);
    const tarifa = C.tarifa * C.P;
    const trib = C.tributos * tarifa;
    const recip = C.recip * C.P;
    const ret = {
      iof: ate >= 1 ? iofV.total : 0,
      tarifa: ate >= 2 ? tarifa : 0,
      trib: ate >= 3 ? trib : 0,
      garantia: ate >= 4 ? C.garantia : 0,
      recip: ate >= 5 ? recip : 0,
    };
    const liquido = C.P - ret.iof - ret.tarifa - ret.trib - ret.garantia;
    const fl = [{ t: 0, v: liquido - ret.recip }].concat(parc.map((p) => ({ t: p.k, v: -p.saida + (p.k === C.n ? ret.recip : 0) })));
    const tirM = M.tir(fl);
    const pa = M.porAno(C.base);
    const saidas = parc.reduce((s, p) => s + p.saida, 0);
    return {
      nom, im, parc, iof: iofV, tarifaV: tarifa, tribV: trib, garantia: C.garantia, recipV: recip, ret, liquido, fl, tirM,
      cet: M.cet(tirM, pa), cetNom: M.cet(im, pa),
      pmt: parc[0].saida, custoTotal: saidas - liquido,
    };
  };

  // waterfall: CET acumulando as retenções na ordem IOF → tarifa → tributos → garantia (→ reciprocidade, se houver)
  M.ETAPAS = ['nominal', 'iof', 'tarifa', 'trib', 'garantia', 'recip'];
  M.waterfall = function (C) {
    const ult = C.recip > 0 ? 5 : 4;
    const out = [];
    for (let k = 0; k <= ult; k++) {
      const o = M.operacao(C, k);
      out.push({ id: M.ETAPAS[k], liquido: o.liquido, tir: o.tirM, cet: o.cet, delta: k === 0 ? null : o.cet - out[k - 1].cet });
    }
    return out;
  };

  // mesma nominal: deságio antecipado × juros postecipados, d no período de `prazo` dias
  M.mesmaNominal = function (face, d, prazo, base) {
    const per = M.diasAno(base) / prazo;
    const tAnt = 1 / (1 - d) - 1, tPost = d;
    return {
      ant: { recebe: face * (1 - d), paga: face, tir: tAnt, cet: Math.pow(1 + tAnt, per) - 1 },
      post: { recebe: face, paga: face * (1 + d), tir: tPost, cet: Math.pow(1 + tPost, per) - 1 },
    };
  };

  root.M54 = M;
})(typeof window !== 'undefined' ? window : globalThis);
