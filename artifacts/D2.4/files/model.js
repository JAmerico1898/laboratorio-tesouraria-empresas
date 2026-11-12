/* D2.4 · Calendário de saídas — funções puras (sem DOM). Tudo em R$ mil.
   Duas classes, como no deck: negociável (fornecedores, via PMPF) × inegociável (o resto).
   Aderência (cenário Alfa T0, SP, PMPF 45):
   set: total 5.142 · negociável 3.712 (72%) · inegociável 1.430 (28%)
   set dia 20 = 1.220 · set dia 5 = 1.228 · dez dia 20 = 1.114 · dez dia 30 = 850 · UF MG → ICMS no dia 10 */
(function (root) {
  const M = {};
  M.CLASSES = ['negociavel', 'inegociavel'];
  // fração do pagamento em cada mês de atraso: PMPF 45 → metade em +1, metade em +2
  M.fracPMPF = function (pmpf) {
    const lo = Math.floor(pmpf / 30), r = (pmpf - lo * 30) / 30;
    return r === 0 ? [[lo, 1]] : [[lo, 1 - r], [lo + 1, r]];
  };
  // arredondamento de exibição: meio para o par (3.712,5 → 3.712)
  M.r = (v) => { const f = Math.floor(v), d = v - f; if (Math.abs(d - 0.5) < 1e-7) return f % 2 === 0 ? f : f + 1; return Math.round(v); };
  // dias do mês num ano não bissexto (calendário, não dado do caso)
  M.diasNoMes = (m) => new Date(2027, m + 1, 0).getDate();
  // "último dia útil" = dia 30 (28 em fev)
  M.ultimoDia = (m) => Math.min(30, M.diasNoMes(m));
  M.lista = (s) => String(s).split(';').map(Number).filter((x) => x > 0);

  // pagamento a fornecedores por mês: compras = pctCompras × receita de 2 meses à frente,
  // pagas pelo PMPF; compras do ano anterior seguem o prazo de referência (P.pmpf)
  M.fornecedores = function (P, pesos, pmpf) {
    const rec = (s) => (P.receitaAnual / 12) * pesos[((s % 12) + 12) % 12];
    const out = new Array(12).fill(0), fr0 = M.fracPMPF(P.pmpf), fr1 = M.fracPMPF(pmpf);
    for (let s = -6; s <= 11; s++) {
      const compras = P.pctCompras * rec(s + 2);
      (s < 0 ? fr0 : fr1).forEach(([a, f]) => { const u = s + a; if (u >= 0 && u <= 11) out[u] += f * compras; });
    }
    return out;
  };

  // D = {P, pesos, cats, eventos, ufDia, MES}; C = {pmpf, uf}
  M.calendario = function (D, C) {
    const P = D.P, base = P.receitaAnual / 12;
    const rec = (s) => base * D.pesos[((s % 12) + 12) % 12];
    const forn = M.fornecedores(P, D.pesos, C.pmpf), forn0 = M.fornecedores(P, D.pesos, P.pmpf);
    const cel = [];
    for (let m = 0; m < 12; m++) { cel.push([]); for (let d = 0; d <= M.diasNoMes(m); d++) cel[m].push([]); }
    const put = (m, d, cat, v) => { if (v > 1e-9) cel[m][Math.min(d, M.diasNoMes(m))].push({ id: cat.id, nome: cat.nome, classe: cat.classe, valor: v }); };
    const cats = D.cats.slice().sort((a, b) => a.ordem - b.ordem);
    cats.forEach((cat) => {
      for (let m = 0; m < 12; m++) {
        let v = 0;
        if (cat.regra === 'fornecedores') v = forn[m];
        else if (cat.regra === 'premissa') v = P[cat.ref];
        else if (cat.regra === 'pctReceitaAnterior') v = cat.pct * rec(m - 1);
        else continue;
        let dias;
        if (cat.dias === 'uf') dias = [D.ufDia[C.uf]];
        else if (cat.dias === 'ultimo') dias = [M.ultimoDia(m)];
        else dias = M.lista(cat.dias);
        dias.forEach((d) => put(m, d, cat, v / dias.length));
      }
    });
    D.eventos.forEach((e) => {
      const cat = cats.find((c) => c.id === e.categoria);
      if (cat) put(D.MES.indexOf(String(e.mes)), e.dia, cat, e.valor);
    });
    const meses = [];
    for (let m = 0; m < 12; m++) {
      const porClasse = { negociavel: 0, inegociavel: 0 }, porCat = {};
      cel[m].forEach((it) => it.forEach((x) => { porClasse[x.classe] += x.valor; porCat[x.id] = (porCat[x.id] || 0) + x.valor; }));
      meses.push({ m, porClasse, porCat, total: porClasse.negociavel + porClasse.inegociavel, forn: forn[m], forn0: forn0[m] });
    }
    return { cel, meses };
  };

  M.diaTotal = (cal, m, d) => cal.cel[m][d].reduce((a, x) => a + x.valor, 0);
  M.resumoMes = function (cal, m) {
    const n = M.diasNoMes(m), dias = [];
    let maxD = 1, maxV = -1;
    for (let d = 1; d <= n; d++) {
      const v = M.diaTotal(cal, m, d); dias.push(v);
      if (v > maxV + 1e-9) { maxV = v; maxD = d; }
    }
    const x = cal.meses[m];
    return { dias, porClasse: x.porClasse, total: x.total, pctIneg: x.total > 0 ? x.porClasse.inegociavel / x.total : 0, diaMax: maxD, valorMax: maxV };
  };
  root.M23 = M;
})(typeof window !== 'undefined' ? window : globalThis);
