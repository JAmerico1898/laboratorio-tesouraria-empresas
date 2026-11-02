/* D4.4 · 5 Cs · dossiê Horizonte — funções puras (sem DOM).
   D = dossiê (dataset, chave→valor), R = regras (dataset, chave→valor), C = controles. R$ mil, dias, % a.a. */
(function (root) {
  const M = {};
  const ORD = { verde: 0, amarelo: 1, vermelho: 2 };
  const PIORA = ['verde', 'amarelo', 'vermelho'];
  M.faixaMin = (v, lv, la) => (v >= lv ? 'verde' : v >= la ? 'amarelo' : 'vermelho');   // maior é melhor
  M.faixaMax = (v, lv, la) => (v <= lv ? 'verde' : v <= la ? 'amarelo' : 'vermelho');   // menor é melhor

  // 1 · Caráter — passa/não passa
  M.carater = function (C, R) {
    if (C.neg || C.protestos > 0 || C.processos) return 'vermelho';
    if (C.semHist || C.pctVenc < R.pctVencMin || C.atraso > R.atrasoMax) return 'amarelo';
    return 'verde';
  };

  // 2 · Capacidade — define quanto
  M.capacidade = function (C, D, R) {
    const icj = C.ebitda / C.despFin;
    const dle = (C.divBruta - D.caixaAplic) / C.ebitda;
    const fco = C.ebitda - D.ir;
    const fcoPcf = fco / C.pcf;
    const f = [M.faixaMin(icj, R.icjV, R.icjA), M.faixaMax(dle, R.dleV, R.dleA), M.faixaMin(fcoPcf, R.fcoV, R.fcoA)];
    const am = f.filter((x) => x === 'amarelo').length, vm = f.filter((x) => x === 'vermelho').length;
    // pontos: amarelo 1, vermelho 2 → 0: 1,00 · 1: 0,80 · 2: 0,60 · ≥ 3: reprova
    const pts = am + 2 * vm;
    const fator = pts === 0 ? R.fator0 : pts === 1 ? R.fator1 : pts === 2 ? R.fator2 : 0;
    const reprova = pts >= 3;
    const farol = reprova ? 'vermelho' : pts === 0 ? 'verde' : 'amarelo';
    return { icj, dle, fco, fcoPcf, faixas: f, amarelos: am, vermelhos: vm, fator, reprova, farol };
  };

  // 3 · Capital — colchão e teto patrimonial
  M.capital = function (C, R) {
    const alav = C.divBruta / C.pl;
    const fAlav = M.faixaMax(alav, R.capV, R.capA);
    const farol = C.plCresc ? fAlav : PIORA[Math.min(2, ORD[fAlav] + 1)];
    const pct = farol === 'verde' ? R.tetoV : farol === 'amarelo' ? R.tetoA : R.tetoR;
    return { alav, fAlav, farol, pct, teto: C.pl * pct };
  };

  // 5 · Condições — calibra prazo e limite
  M.condicoes = function (C, R) {
    const mSelic = C.selic <= R.selicLo ? R.multLo : C.selic <= R.selicHi ? R.multMid : R.multHi;
    const mSetor = C.setor === 'retracao' ? R.multRetr : 1;
    const prazoSetor = C.setor === 'expansao' ? R.prazoExp : C.setor === 'retracao' ? R.prazoRetr : R.prazoNeu;
    // o 5º C não reprova, calibra: verde sem ajuste, amarelo com qualquer redução
    const farol = mSelic * mSetor >= 1 && prazoSetor >= R.prazoNeu ? 'verde' : 'amarelo';
    return { mSelic, mSetor, mult: mSelic * mSetor, prazoSetor, farol };
  };

  M.estado = function (D, R, C) {
    const car = M.carater(C, R);
    const cap = M.capacidade(C, D, R);
    const kap = M.capital(C, R);
    const cond = M.condicoes(C, R);
    const bloqueio = car === 'vermelho' ? 'carater' : cap.reprova ? 'capacidade' : null;
    const fatorCar = car === 'amarelo' ? R.fatorNovo : 1;
    const prazoMax = C.semHist ? Math.min(cond.prazoSetor, R.prazoNovo) : cond.prazoSetor;
    const prazo = Math.min(C.prazoPedido, prazoMax);
    const base = D.comprasAno * prazo / 360;
    const colAtivo = !bloqueio;
    const colMult = colAtivo ? 1 + R.cessaoAdd * (C.cessao ? 1 : 0) + R.avalAdd * (C.aval ? 1 : 0) : 1;
    const bruto = base * cap.fator * cond.mult * fatorCar * colMult;
    const limite = bloqueio ? 0 : Math.min(kap.teto, bruto);
    const tetoLimita = !bloqueio && bruto > kap.teto;
    const saldo = D.saldo;
    const temColateral = !!(C.cessao || C.aval);
    let decisao;
    if (bloqueio) decisao = 'recusado';
    else if (limite >= saldo - 1e-9) decisao = C.prazoPedido > prazoMax ? 'condicao' : 'aprovado';
    else decisao = temColateral ? 'condicao' : 'reduzir';
    // prazo em que a exposição (compras × prazo / 360) cabe no limite
    const prazoCabe = Math.floor(limite * 360 / D.comprasAno + 1e-9);
    const comCessao = bloqueio || C.cessao ? null : Math.min(kap.teto, bruto / colMult * (colMult + R.cessaoAdd));
    const farolCol = bloqueio ? 'cinza' : temColateral ? 'verde' : 'amarelo';
    return {
      car, cap, kap, cond, bloqueio, fatorCar, prazoMax, prazo, base, colAtivo, colMult, bruto, limite, tetoLimita,
      saldo, uso: limite > 0 ? saldo / limite : null, decisao, prazoCabe, comCessao, farolCol, temColateral,
    };
  };

  root.M44 = M;
})(typeof window !== 'undefined' ? window : globalThis);
