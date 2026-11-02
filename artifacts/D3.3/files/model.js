/* D3.3 · Lote econômico — funções puras (sem DOM).
   P = item (dataset), F = faixas de desconto (dataset), C = controles. R$ unitários, rolos. */
(function (root) {
  const M = {};
  M.eoq = (D, S, H) => Math.sqrt(2 * D * S / H);
  M.ct = (D, S, H, Q) => S * D / Q + H * Q / 2;
  M.hPct = (C) => (C.cdi + C.armaz + C.seguro + C.obsol) / 100;
  M.H = (C) => (C.hReal || C.ext1 ? C.P * M.hPct(C) : C.H);
  M.faixas = function (C, F) {
    const hp = M.hPct(C);
    const fx = F.map((f) => {
      const preco = C.P * (1 - f.desconto), Hf = hp * preco;
      const q = M.eoq(C.D, C.S, Hf);
      const hi = f.hi == null || f.hi === '' ? Infinity : f.hi;
      const Q = Math.min(hi, Math.max(f.lo, q));
      const compra = C.D * preco, pedido = C.S * C.D / Q, carreg = Hf * Q / 2;
      return { faixa: f.faixa, lo: f.lo, hi, desconto: f.desconto, preco, Hf, q, Q, eoqDentro: Q === q, compra, pedido, carreg, ct: compra + pedido + carreg };
    });
    let best = fx[0];
    fx.forEach((f) => { if (f.ct < best.ct) best = f; });
    return { fx, best, economia: fx[0].ct - best.ct };
  };
  M.precoDe = (C, F, Q) => { let p = C.P; F.forEach((f) => { if (Q >= f.lo) p = C.P * (1 - f.desconto); }); return p; };
  M.ctCompra = (C, F, Q) => { const pr = M.precoDe(C, F, Q), Hf = M.hPct(C) * pr; return C.D * pr + C.S * C.D / Q + Hf * Q / 2; };
  M.estado = function (P, F, C) {
    const H = M.H(C);
    const eoq = M.eoq(C.D, C.S, H);
    const d = C.D / P.diasUteis;
    const fator = C.p > d ? Math.sqrt(C.p / (C.p - d)) : null;
    const epq = fator ? eoq * fator : null;
    let Q = C.ext2 ? epq : eoq;
    const Qbase = Q;
    if (Q != null && C.multiplo) Q = Math.max(P.multiplo, Math.round(Q / P.multiplo) * P.multiplo);
    const ext1 = C.ext1 ? M.faixas(C, F) : null;
    // custos no Q exibido (sem a compra); com EPQ o carregamento usa o estoque máximo Q(1 − d/p)
    const carregQ = (q) => (C.ext2 && fator ? H * q * (1 - d / C.p) / 2 : H * q / 2);
    const pedidoQ = (q) => C.S * C.D / q;
    return {
      H, eoq, d, fator, epq, Q, Qbase, ext1,
      pedidos: Q ? C.D / Q : null, estMedio: Q ? (C.ext2 && fator ? Q * (1 - d / C.p) / 2 : Q / 2) : null,
      cPedido: Q ? pedidoQ(Q) : null, cCarreg: Q ? carregQ(Q) : null, ct: Q ? pedidoQ(Q) + carregQ(Q) : null,
      carregQ, pedidoQ, semProducao: C.ext2 && !fator,
    };
  };
  root.M33 = M;
})(typeof window !== 'undefined' ? window : globalThis);
