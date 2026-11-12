/* D2.7 · Financiar o déficit — funções puras (sem DOM, sem d3).
   Unidades: R$ mil; prazos em dias corridos; taxas em fração (0,0145 = 1,45%).
   O motor de CET (M26.cet) é isolado para ser reaproveitado em D5.4. */
(function (root) {
  const M = {};

  /* ---------- motor de CET (TIR por bisseção) ---------- */
  const cet = {};
  // fluxos: [{t: períodos (pode ser fracionário), v: valor}] na ótica do tomador (+ recebe, − paga)
  cet.vpl = (fluxos, r) => fluxos.reduce((a, f) => a + f.v / Math.pow(1 + r, f.t), 0);
  cet.tir = (fluxos, lo = -0.99, hi = 1, it = 200) => {
    let a = lo, b = hi, fa = cet.vpl(fluxos, a);
    for (let i = 0; i < it; i++) {
      const m = (a + b) / 2, fm = cet.vpl(fluxos, m);
      if ((fm > 0) === (fa > 0)) { a = m; fa = fm; } else b = m;
    }
    return (a + b) / 2;
  };
  cet.anualiza = (r, n = 12) => Math.pow(1 + r, n) - 1;
  // IOF crédito PJ retido na origem: fixo + diário × min(dias, teto)
  cet.iof = (valor, dias, enc) => valor * (enc.iofFixo + enc.iofDia * Math.min(dias, enc.iofTeto));
  M.cet = cet;

  /* ---------- cotação bullet (aba 2) ---------- */
  // q = {valor, dur, nominal (a.m.), tac (fração do valor)}; enc = encargos. IOF e tributos sobre a TAC sempre entram no CET.
  M.cotacaoBullet = (q, enc) => {
    const meses = q.dur / 30;
    const juros = q.valor * (Math.pow(1 + q.nominal, meses) - 1);
    const iof = cet.iof(q.valor, q.dur, enc);
    const tac = q.tac * q.valor;
    const tributos = enc.tribTAC * tac;
    const liquido = q.valor - iof - tac - tributos;
    const pagamento = q.valor + juros;
    const fluxos = [{ t: 0, v: liquido }];
    for (let k = 1; k < Math.ceil(meses - 1e-9); k++) fluxos.push({ t: k, v: 0 }); // um fluxo por mês (zeros)
    fluxos.push({ t: meses, v: -pagamento });
    const tirM = cet.tir(fluxos);
    const custo = juros + iof + tac + tributos;
    return {
      meses, juros, iof, tac, tributos, liquido, pagamento, fluxos, tirM, cet: cet.anualiza(tirM, 12), custo,
      comp: { juros: juros / custo, iof: iof / custo, tac: tac / custo, tributos: tributos / custo },
    };
  };

  /* ---------- perfil → modalidade (aba 1) ---------- */
  // mods = {cg:{cet, prazoMax}, desc:{cet, prazoMax}, giro:{cet, contrato}}
  M.indicada = (dur, mods) => (dur < mods.cg.prazoMax ? 'cg' : dur <= mods.desc.prazoMax ? 'desc' : 'giro');
  M.custoComposto = (valor, taxa, dur) => valor * (Math.pow(1 + taxa, dur / 360) - 1);
  // capital de giro paga o contrato inteiro, mesmo que o déficit acabe antes
  M.custosModalidades = (valor, dur, mods) => {
    const pGiro = Math.max(dur, mods.giro.contrato);
    const r = {
      cg: { custo: M.custoComposto(valor, mods.cg.cet, dur), passivo: mods.cg.prazoMax },
      desc: { custo: M.custoComposto(valor, mods.desc.cet, dur), passivo: mods.desc.prazoMax },
      giro: { custo: M.custoComposto(valor, mods.giro.cet, pGiro), passivo: pGiro },
    };
    Object.keys(r).forEach((k) => { r[k].cobre = r[k].passivo >= dur; });
    return r;
  };

  root.M26 = M;
})(typeof window !== 'undefined' ? window : globalThis);
