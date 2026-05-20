// =============================================================================
// Indústria Omega — financial dataset (R$ milhões)
// =============================================================================
// Dívida por banco/modalidade/taxa/vencimento. PMPF 38 d. Caixa R$ 22 M.
// EBITDA LTM R$ 42 M, projetado R$ 35 M. Covenants em risco.
// =============================================================================

import type { CaseStudyDataset } from "./types";

export const CS5_DATA: CaseStudyDataset = {
  caseId: "cs5",
  tables: [
    {
      id: "divida_composicao",
      title: "Composição da dívida bancária — posição atual",
      unit: "R$ milhões",
      columns: ["Banco", "Modalidade", "Saldo (R$ M)", "Taxa", "Vencimento"],
      rows: [
        { label: "Banco Alpha", values: ["Alpha", "Capital de Giro 24m", 28.0, "CDI+3,5%", "Dez/Ano+2"] },
        { label: "Banco Alpha", values: ["Alpha", "Antecip. recebíveis", 8.5, "1,6% a.m.", "rotativo"] },
        { label: "Banco Beta", values: ["Beta", "Debêntures (5 anos)", 35.0, "CDI+4,0%", "Mar/Ano+4"] },
        { label: "Banco Gama", values: ["Gama", "Capital de Giro 18m", 12.0, "CDI+4,8%", "Jun/Ano+2"] },
        { label: "Banco Gama", values: ["Gama", "Vendor finance", 4.5, "CDI+5,5%", "60 d médio"] },
        { label: "Banco Delta", values: ["Delta", "Conta Garantida", 6.0, "CDI+9,0%", "rotativo"] },
        { label: "Banco Delta", values: ["Delta", "ACC (exportação)", 12.0, "Libor+4%", "180 d"] },
        { label: "TOTAL DÍVIDA BRUTA", values: ["—", "—", 106.0, "CET médio ≈ 18,2%", "—"], emphasis: "total" },
        { label: "(−) Caixa e equivalentes", values: ["—", "—", -22.0, "—", "—"], indent: 1 },
        { label: "DÍVIDA LÍQUIDA", values: ["—", "—", 84.0, "—", "—"], emphasis: "total" },
        { label: " ", values: [null, null, null, null, null] },
        { label: "Concentração em 2 maiores", values: ["—", "Alpha + Beta", 71.5, "—", "67,5%"], emphasis: "bold" },
      ],
    },
    {
      id: "ebitda_historico",
      title: "EBITDA — histórico e projeção",
      unit: "R$ milhões",
      columns: ["Y-3", "Y-2", "Y-1 (LTM)", "Y+1 (proj.)", "Y+2 (proj.)"],
      rows: [
        { label: "Receita líquida", values: [320.0, 365.0, 395.0, 355.0, 380.0] },
        { label: "EBITDA", values: [38.0, 41.5, 42.0, 35.0, 39.0], emphasis: "bold" },
        { label: "  Margem EBITDA (%)", values: ["11,9%", "11,4%", "10,6%", "9,9%", "10,3%"], indent: 1, emphasis: "muted" },
        { label: "Despesa financeira líquida", values: [-9.5, -11.2, -13.5, -14.0, -13.2], indent: 1 },
        { label: "EBITDA / Desp. Financeira", values: [4.0, 3.7, 3.1, 2.5, 3.0], emphasis: "subtotal" },
      ],
    },
    {
      id: "covenants",
      title: "Covenants vigentes — cushion atual e projetado",
      columns: ["Covenant", "Limite", "Atual (LTM)", "Projetado Y+1", "Cushion / Status"],
      rows: [
        { label: "DL / EBITDA", values: ["DL/EBITDA", "≤ 3,0x", "2,00x", "2,40x", "Cushion 0,60x — OK", ], emphasis: "bold" },
        { label: "EBITDA / Despesa Financeira", values: ["EBITDA/DF", "≥ 3,0x", "3,11x", "2,50x", "VIOLAÇÃO em Y+1"], emphasis: "bold" },
        { label: "Liquidez Corrente", values: ["LC", "≥ 1,1x", "1,35x", "1,20x", "Cushion 0,10x — apertado"] },
        { label: "Restrição a dividendos", values: ["Dividendos", "Payout ≤ 40%", "32%", "0% planejado", "OK (folga)"] },
        { label: "CAPEX anual", values: ["CAPEX", "≤ R$ 25 M", "R$ 18 M", "R$ 12 M", "OK (folga)"] },
      ],
    },
    {
      id: "aging_fornecedores",
      title: "Aging de fornecedores — top 5 estratégicos",
      unit: "R$ milhões",
      columns: ["Fornecedor", "Saldo", "% das compras", "Prazo atual", "Crítico?"],
      rows: [
        { label: "Fornecedor 1 (matéria-prima principal)", values: ["F1", 18.5, "28%", "30 dias", "SIM — single source"] },
        { label: "Fornecedor 2 (componentes eletrônicos)", values: ["F2", 12.0, "18%", "45 dias", "Médio — 2 alternativos"] },
        { label: "Fornecedor 3 (energia / utilities)", values: ["F3", 8.5, "13%", "15 dias", "SIM — utility regulada"] },
        { label: "Fornecedor 4 (embalagens)", values: ["F4", 6.0, "9%", "60 dias", "Baixo — multi source"] },
        { label: "Fornecedor 5 (logística)", values: ["F5", 4.5, "7%", "30 dias", "Médio"] },
        { label: "TOP 5 (subtotal)", values: ["—", 49.5, "75%", "—", "—"], emphasis: "subtotal" },
        { label: "Demais fornecedores (cauda longa)", values: ["—", 16.5, "25%", "30-45 d médio", "—"] },
        { label: "TOTAL FORNECEDORES", values: ["—", 66.0, "100%", "PMPF médio 38 d", "—"], emphasis: "total" },
      ],
    },
    {
      id: "caixa_perfil",
      title: "Posição de caixa e perfil de vencimentos da dívida",
      unit: "R$ milhões",
      columns: ["Item", "Próximos 12m", "12-24m", "24m+", "Total"],
      rows: [
        { label: "Caixa atual", values: ["Caixa", 22.0, 0, 0, 22.0], emphasis: "bold" },
        { label: "  Saldo mínimo operacional", values: ["—", -8.0, 0, 0, -8.0], indent: 1, emphasis: "muted" },
        { label: "  Caixa livre disponível", values: ["—", 14.0, 0, 0, 14.0], indent: 1, emphasis: "bold" },
        { label: "Amortizações de dívida programadas", values: ["—", 32.0, 41.0, 33.0, 106.0], emphasis: "bold" },
        { label: "  Capital de Giro 24m (Alpha)", values: ["—", 14.0, 14.0, 0, 28.0], indent: 1 },
        { label: "  Antecipação Alpha (rotativo)", values: ["—", 8.5, 0, 0, 8.5], indent: 1 },
        { label: "  Debêntures Beta", values: ["—", 0, 17.5, 17.5, 35.0], indent: 1 },
        { label: "  CG Gama 18m", values: ["—", 8.0, 4.0, 0, 12.0], indent: 1 },
        { label: "  Vendor + Conta Garantida + ACC", values: ["—", 1.5, 5.5, 15.5, 22.5], indent: 1 },
      ],
    },
  ],
};
