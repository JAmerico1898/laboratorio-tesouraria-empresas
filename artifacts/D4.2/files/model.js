/* D4.2 · Condições de venda — motor de cálculo (funções puras, sem DOM).
   Compartilhado com D5.1 (o mesmo título visto pela Horizonte).
   Núcleo em decimais (d = 0,02; i = 0,012 a.m.; cc = 0,17 a.a.); M.estado converte dos controles em %.
   Valores monetários em R$ mil. */
(function (root) {
  const M = {};

  // custo anualizado de recusar o desconto "d/k net n" — base 360 (00_Convencoes §3.6)
  M.custoRecusa = function (d, k, n) {
    const dias = n - k;
    if (!(dias > 0) || !(d < 1)) return { lin: Infinity, comp: Infinity };
    const r = d / (1 - d);
    return { lin: r * 360 / dias, comp: Math.pow(1 + r, 360 / dias) - 1 };
  };

  // conta do vendedor (R$ mil/mês). V = venda × adesão
  M.vendedor = function ({ venda, adesao, d, k, n, iVend, e }) {
    const V = venda * adesao;
    const margemCedida = V * d;
    const aceleracao = V * (n - k) / 30 * iVend;
    const inadEvitada = V * e;
    return { V, margemCedida, aceleracao, inadEvitada, res: -margemCedida + aceleracao + inadEvitada };
  };

  // break-evens do vendedor: funding mensal e inadimplência evitada que zeram o resultado
  M.breakEvenFunding = ({ d, k, n, e }) => (n - k > 0 ? (d - e) / ((n - k) / 30) : Infinity);
  M.breakEvenInad = ({ d, k, n, iVend }) => d - (n - k) / 30 * iVend;

  // conta do comprador: custo da recusa contra o custo de capital anual cc
  M.comprador = function ({ d, k, n, cc }) {
    const c = M.custoRecusa(d, k, n);
    return { custoLin: c.lin, custoComp: c.comp, tomar: c.comp > cc };
  };

  // práticas brasileiras: prazo médio de parcelas iguais e pricing implícito do desconto à vista
  M.pmr = (dias) => (dias && dias.length ? dias.reduce((a, b) => a + b, 0) / dias.length : 0);
  M.pricingImplicito = (descVista, pmr) => (pmr > 0 && descVista < 1 ? Math.pow(1 / (1 - descVista), 360 / pmr) - 1 : null);

  // estado a partir dos controles (em %, como na tela)
  M.estado = function (C) {
    const p = { venda: C.venda, adesao: C.adesao / 100, d: C.d / 100, k: C.k, n: C.n, iVend: C.i / 100, e: C.e / 100, cc: C.cc / 100 };
    const vend = M.vendedor(p);
    const comp = M.comprador(p);
    const oferecer = vend.res > 0;
    let caso;
    if (vend.res <= 0 && comp.tomar) caso = 'compradorGanha';
    else if (vend.res > 0 && comp.tomar) caso = 'ambos';
    else if (vend.res > 0 && !comp.tomar) caso = 'pequeno';
    else caso = 'ninguem';
    return {
      p, vend, comp, oferecer, aceitar: comp.tomar, caso,
      beFunding: M.breakEvenFunding(p), beInad: M.breakEvenInad(p),
      pctMargem: C.m > 0 ? p.d / (C.m / 100) : null,
    };
  };

  root.M42 = M;
})(typeof window !== 'undefined' ? window : globalThis);
