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
  // q = {valor, dur, nominal (a.m.), tac (fração do valor), iof: bool, trib: bool}; enc = encargos
  M.cotacaoBullet = (q, enc) => {
    const meses = q.dur / 30;
    const juros = q.valor * (Math.pow(1 + q.nominal, meses) - 1);
    const iof = q.iof ? cet.iof(q.valor, q.dur, enc) : 0;
    const tac = q.tac * q.valor;
    const tributos = q.trib ? enc.tribTAC * tac : 0;
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
  // capital de giro com prazo contratual: paga o contrato inteiro; o excedente fica aplicado até o fim
  M.custoGiro = (valor, taxa, dur, contrato, txAplic) => {
    if (dur >= contrato) { const c = M.custoComposto(valor, taxa, dur); return { bruto: c, liquido: c, prazo: dur }; }
    const bruto = M.custoComposto(valor, taxa, contrato);
    return { bruto, liquido: bruto - valor * ((contrato - dur) / 360) * txAplic, prazo: contrato };
  };
  M.custosModalidades = (valor, dur, mods, txAplic) => {
    const giro = M.custoGiro(valor, mods.giro.cet, dur, mods.giro.contrato, txAplic);
    const r = {
      cg: { custo: M.custoComposto(valor, mods.cg.cet, dur), passivo: mods.cg.prazoMax },
      desc: { custo: M.custoComposto(valor, mods.desc.cet, dur), passivo: mods.desc.prazoMax },
      giro: { custo: giro.liquido, bruto: giro.bruto, liquido: giro.liquido, passivo: giro.prazo },
    };
    Object.keys(r).forEach((k) => { r[k].cobre = r[k].passivo >= dur; });
    return r;
  };

  /* ---------- diversificação (aba 3) ---------- */
  // bancos = [{nome, tipo: 'publico'|'privado', part (0–100)}]
  M.diversificacao = (total, bancos, teto, minBancos) => {
    const linhas = bancos.map((b) => ({ ...b, share: b.part / 100, valor: total * b.part / 100, acima: b.part / 100 > teto + 1e-9 }));
    const ativos = linhas.filter((l) => l.part > 0);
    const pub = ativos.filter((l) => l.tipo === 'publico').reduce((a, l) => a + l.share, 0);
    const tot = ativos.reduce((a, l) => a + l.share, 0) || 1;
    const maior = linhas.reduce((m, l) => (l.part > m.part ? l : m), linhas[0]);
    const nPub = ativos.filter((l) => l.tipo === 'publico').length;
    return {
      linhas, nAtivos: ativos.length, pctPublico: pub / tot, maior,
      acimaTeto: linhas.filter((l) => l.acima).map((l) => l.nome),
      alertas: {
        teto: linhas.some((l) => l.acima),
        min: ativos.length < minBancos,
        soPriv: ativos.length > 0 && nPub === 0,
        soPub: ativos.length > 0 && nPub === ativos.length,
      },
    };
  };
  // participação residual do último banco (os três primeiros são sliders)
  M.residual = (a, b, c) => Math.max(0, 100 - a - b - c);

  root.M26 = M;
})(typeof window !== 'undefined' ? window : globalThis);
