/* D2.1 · Cascata do orçamento de caixa — funções puras (sem DOM).
   P = premissas (do dataset), C = controles do aluno. Tudo em R$ mil. */
(function (root) {
  const M = {};
  // frações de pagamento a fornecedor por PMPF: [atraso em meses, fração]
  M.fracPMPF = function (pmpf) {
    const lo = Math.floor(pmpf / 30), r = (pmpf - lo * 30) / 30;
    return r === 0 ? [[lo, 1]] : [[lo, 1 - r], [lo + 1, r]];
  };
  M.orcamento = function (P, C) {
    const base = P.receitaAnual / 12;
    const pesos = C.achatar ? P.pesos.map(() => 1) : C.pesos;
    const g = C.crescimento / 100;
    // receita do mês s, s = -4..13 (anos vizinhos sem crescimento, mesmos pesos)
    const rec = (s) => {
      const m = ((s % 12) + 12) % 12;
      const fat = s >= 0 ? Math.pow(1 + g, s / 12) : 1; // anos seguintes seguem crescendo (fecha dez = 143 em "Crescer 20%")
      return base * pesos[m] * fat;
    };
    const ent = new Array(12).fill(0), forn = new Array(12).fill(0);
    const lagRV0 = P.pmrvAntigo / 30, fr0 = M.fracPMPF(P.pmpfAntigo), fr1 = M.fracPMPF(C.pmpf);
    for (let s = -6; s <= 11; s++) {
      const lag = s < 0 ? lagRV0 : C.pmrv / 30;
      const t = s + lag;
      if (t >= 0 && t <= 11) ent[t] += rec(s) * (1 - C.inad / 100);
      const compras = P.pctCompras * rec(s + 2);
      (s < 0 ? fr0 : fr1).forEach(([a, f]) => { const u = s + a; if (u >= 0 && u <= 11) forn[u] += f * compras; });
    }
    const meses = [];
    let saldo = P.saldoInicial;
    for (let m = 0; m < 12; m++) {
      const folha = P.salarios + P.encargos + P.decimo[m] + P.plr[m];
      const varr = P.pctVariaveis * rec(m);
      const disc = P.discricionarias * C.disc / 100;
      const recAnt = rec(m - 1);
      const tribICMS = P.pctICMS * recAnt, tribPIS = (P.pctTributos - P.pctICMS) * recAnt;
      const trib = tribICMS + tribPIS + P.irpj;
      const saidasOp = forn[m] + folha + P.fixas + varr + disc + trib;
      const fluxoOp = ent[m] - saidasOp;
      const capex = m === 5 ? C.capexJun : m === 8 ? C.capexSet : 0;
      const div = m === P.mesDividendos ? C.dividendos : 0;
      const juros = P.jurosCP + P.jurosELP;
      const financ = -(juros + P.amortELP[m] + div);
      const fluxoLiq = fluxoOp - capex + financ;
      saldo += fluxoLiq;
      meses.push({ m, receita: rec(m), entradas: ent[m], forn: forn[m], folha, fixas: P.fixas, variaveis: varr, disc, trib, tribICMS, tribPIS, irpj: P.irpj, salarios: P.salarios, encargos: P.encargos, extraFolha: P.decimo[m] + P.plr[m], capex,
        saidasOp, fluxoOp, invest: -capex, financ, juros, amort: P.amortELP[m], div, fluxoLiq, saldo });
    }
    const fl = meses.map((x) => x.fluxoLiq), media = fl.reduce((a, b) => a + b, 0) / 12;
    const sigma = Math.sqrt(fl.reduce((a, b) => a + (b - media) ** 2, 0) / 12);
    const minimo = C.k * sigma;
    const soma = (k) => meses.reduce((a, x) => a + x[k], 0);
    let pior = meses[0], exc = meses[0];
    meses.forEach((x) => { if (x.saldo < pior.saldo) pior = x; if (x.saldo > exc.saldo) exc = x; });
    return { meses, sigma, minimo, pior, falta: Math.max(0, minimo - pior.saldo), excMes: exc, excedente: exc.saldo - minimo,
      abaixo: meses.filter((x) => x.saldo < minimo).map((x) => x.m), negativos: meses.filter((x) => x.saldo < 0).map((x) => x.m),
      totais: { receita: soma('receita'), entradas: soma('entradas'), saidasOp: soma('saidasOp'), fluxoOp: soma('fluxoOp'), invest: soma('invest'), financ: soma('financ'), fluxoLiq: soma('fluxoLiq') },
      saldoFinal: meses[11].saldo };
  };
  // 13 semanas a partir de mesIni (0..8): recorrentes em 4 partes iguais; datas fixas na semana da regra
  M.semanas = function (P, R, mesIni) {
    const out = [];
    let saldo = mesIni === 0 ? P.saldoInicial : R.meses[mesIni - 1].saldo;
    for (let i = 0; i < 13; i++) {
      const x = R.meses[mesIni + Math.floor(i / 4)], w = (i % 4) + 1;
      const em = (sem, v) => (w === sem ? v : 0);
      const entradas = x.entradas / 4;
      const saidasOp = (x.forn + x.fixas + x.variaveis + x.disc) / 4 + em(P.semFolha, x.salarios) + em(P.semEncargos, x.encargos)
        + em(P.semEventos, x.extraFolha) + em(P.semICMS, x.tribICMS) + em(P.semPIS, x.tribPIS) + em(P.semIRPJ, x.irpj);
      const invest = -em(P.semEventos, x.capex);
      const financ = -(x.juros / 4 + em(P.semEventos, x.amort + x.div));
      const fluxoLiq = entradas - saidasOp + invest + financ;
      saldo += fluxoLiq;
      out.push({ m: x.m, w, entradas, saidasOp, fluxoOp: entradas - saidasOp, invest, financ, fluxoLiq, saldo });
    }
    return out;
  };
  root.M21 = M;
})(typeof window !== 'undefined' ? window : globalThis);
