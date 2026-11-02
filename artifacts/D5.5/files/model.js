/* D5.5 · Passivo integrado — funções puras (sem DOM).
   bancos = [{banco, caixa, aplic, linhaCP, linhaLP, contaGar, rotativo, aprovado}] (R$ mil)
   H = dados da Horizonte {aco, salarios, fornecedores, pl, anc, ebitda, rotVenc, txCG, txRot, txAplic, txForn, caixaMin} (taxas em %) */
(function (root) {
  const M = {};
  const soma = (xs, k) => xs.reduce((a, x) => a + (Number(x[k]) || 0), 0);
  // "esticar fornecedor": a conta garantida vira fornecedor (mesmo total de passivo CP)
  M.efetivo = function (bancos, forn, esticar) {
    if (!esticar) return { bancos: bancos.map((b) => ({ ...b })), forn };
    const cg = soma(bancos, 'contaGar');
    return { bancos: bancos.map((b) => ({ ...b, contaGar: 0 })), forn: forn + cg };
  };
  M.totais = function (bancos) {
    const t = {};
    ['caixa', 'aplic', 'linhaCP', 'linhaLP', 'contaGar', 'rotativo', 'aprovado'].forEach((k) => { t[k] = soma(bancos, k); });
    t.divCP = t.linhaCP + t.contaGar + t.rotativo;
    t.divTotal = t.divCP + t.linhaLP;
    t.usado = t.contaGar + t.rotativo;
    t.liquidez = t.caixa + t.aplic;
    return t;
  };
  M.divBanco = (b) => (Number(b.linhaCP) || 0) + (Number(b.linhaLP) || 0) + (Number(b.contaGar) || 0) + (Number(b.rotativo) || 0);
  M.divCPBanco = (b) => (Number(b.linhaCP) || 0) + (Number(b.contaGar) || 0) + (Number(b.rotativo) || 0);
  M.plcp = (t, forn) => t.caixa + t.aplic - t.divCP - forn;
  // alerta: piora > 10% em relação a 4 semanas antes (série semanal, último ponto = hoje)
  M.alerta = function (serie, limite) {
    const n = serie.length;
    if (n < 5) return { varia: 0, aceso: false };
    const hoje = serie[n - 1], ref = serie[n - 5];
    const varia = ref === 0 ? 0 : (hoje - ref) / Math.abs(ref);
    return { varia, ref, hoje, aceso: varia < -limite };
  };
  // vencimentos financeiros por janela de 30 dias: amortização mensal do CG linha (parcela CP ÷ 12),
  // conta garantida exigível no 1º bucket, rotativo no bucket do seu vencimento
  M.buckets = function (t, rotVenc) {
    const mes = t.linhaCP / 12;
    const b = [mes, mes, mes];
    b[0] += t.contaGar;
    const i = Math.min(2, Math.max(0, Math.ceil(rotVenc / 30) - 1));
    b[i] += t.rotativo;
    return b;
  };
  M.limitesLivres = (t) => (t.aprovado > 0 ? 1 - t.usado / t.aprovado : 0);
  // HHI em pontos (participações em %)
  M.hhi = (parts) => parts.reduce((a, p) => a + p * p, 0);
  M.partsDe = function (valores) {
    const tot = valores.reduce((a, v) => a + v, 0);
    return valores.map((v) => (tot > 0 ? (v / tot) * 100 : 0));
  };
  M.classeHHI = function (h, maior, teto) {
    if (h > 2500 + 1e-9 || maior > teto + 1e-9) return 'conc';
    if (h >= 1500) return 'aceit';
    return 'alto';
  };
  // pooling notional: no mesmo banco, o caixa abate a dívida rotativa mais cara primeiro
  M.poolNotional = function (bancos, H) {
    let econ = 0;
    bancos.forEach((b) => {
      let c = Number(b.caixa) || 0;
      const cg = Math.min(c, Number(b.contaGar) || 0); econ += cg * H.txCG / 100; c -= cg;
      const ro = Math.min(c, Number(b.rotativo) || 0); econ += ro * H.txRot / 100;
    });
    return econ;
  };
  // pooling físico: varredura para a conta-mãe; o dinheiro de menor custo de oportunidade (caixa 0%)
  // quita primeiro a dívida mais cara (conta garantida, depois rotativo); o caixa mínimo fica aplicado (CDB diário)
  M.poolFisico = function (t, H) {
    let reserva = H.caixaMin;
    let aplic = t.aplic, caixa = t.caixa;
    const ra = Math.min(reserva, aplic); aplic -= ra; reserva -= ra; caixa = Math.max(0, caixa - reserva);
    const fontes = [{ v: caixa, op: 0 }, { v: aplic, op: H.txAplic }];
    const dividas = [{ v: t.contaGar, tx: H.txCG, id: 'cg' }, { v: t.rotativo, tx: H.txRot, id: 'rot' }].sort((a, b) => b.tx - a.tx);
    let econ = 0; const quitado = { cg: 0, rot: 0 };
    let fi = 0;
    dividas.forEach((d) => {
      let falta = d.v;
      while (falta > 1e-9 && fi < fontes.length) {
        const f = fontes[fi];
        const q = Math.min(falta, f.v);
        if (d.tx > f.op) { econ += q * (d.tx - f.op) / 100; quitado[d.id] += q; } else break;
        falta -= q; f.v -= q;
        if (f.v <= 1e-9) fi++;
      }
    });
    return { econ, quitado };
  };
  M.pooling = function (modo, bancos, t, H) {
    if (modo === 'notional') return M.poolNotional(bancos, H);
    if (modo === 'fisico') return M.poolFisico(t, H).econ;
    return 0;
  };
  // regra de ouro: pagar conta garantida enquanto há fornecedor em aberto
  M.regraOuro = (t, H) => t.contaGar * (H.txCG - H.txForn) / 100;
  // balanço CP, matriz fontes × usos e refinanciamento do CAPEX
  M.balanco = function (t, forn, H, refinMeses, prazoLP) {
    const AC = t.caixa + t.aplic + H.aco;
    const capexCP = t.linhaCP;                       // parcela CP do CG linha que financiou o CD
    const migrado = refinMeses >= prazoLP ? capexCP : 0;
    const PC = t.divCP + forn + H.salarios - migrado;
    const ELP = t.linhaLP + migrado;
    const LP = H.pl + ELP;
    const ancCP = capexCP - migrado;                 // ANC financiado com CP
    const acCP = PC - ancCP, acLP = AC - acCP, ancLP = H.anc - ancCP;
    return { AC, PC, ELP, LP, CCL: AC - PC, LC: AC / PC, capexCP, migrado, cel: { acCP, acLP, ancCP, ancLP } };
  };
  M.saldosEscada = (t, forn) => ({ fornecedores: forn, cg: t.linhaCP + t.linhaLP + t.rotativo, antecipacao: 0, contaGar: t.contaGar, cheque: 0 });
  root.M55 = M;
})(typeof window !== 'undefined' ? window : globalThis);
