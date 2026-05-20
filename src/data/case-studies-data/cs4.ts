// =============================================================================
// Distribuidora Sigma — financial dataset
// =============================================================================
// Carteira em aberto R$ 86 M em 4 faixas. Política atual: 60 d sem desconto.
// Inadimplência por faixa de cliente × setor. Cobrança 8 pessoas R$ 1,4 M.
// =============================================================================

import type { CaseStudyDataset } from "./types";

export const CS4_DATA: CaseStudyDataset = {
  caseId: "cs4",
  tables: [
    {
      id: "aging",
      title: "Aging detalhado da carteira em aberto",
      unit: "R$ milhões",
      columns: ["Faixa", "Valor (R$ M)", "% da carteira", "Taxa de recuperação esperada"],
      rows: [
        { label: "Em dia (D−5 a D)", values: ["Em dia", 22.4, "26,0%", "100%"], emphasis: "bold" },
        { label: "Atraso leve (D+1 a D+30)", values: ["1-30 d", 30.1, "35,0%", "85%"] },
        { label: "Atraso médio (D+31 a D+60)", values: ["31-60 d", 17.2, "20,0%", "55%"] },
        { label: "Atraso grave (D+61 a D+90)", values: ["61-90 d", 9.5, "11,0%", "30%"] },
        { label: "Pré-perda (> D+90)", values: ["90+ d", 6.8, "8,0%", "10%"] },
        { label: "TOTAL CARTEIRA", values: ["—", 86.0, "100,0%", "—"], emphasis: "total" },
        { label: "Valor esperado de recuperação", values: ["—", 63.9, "74,3%", "—"], emphasis: "bold" },
        { label: "Provisão estimada (PDD)", values: ["—", 22.1, "25,7%", "—"], emphasis: "bold" },
      ],
    },
    {
      id: "inadimplencia_matriz",
      title: "Inadimplência por perfil de cliente × setor (% sobre faturamento)",
      columns: ["Perfil", "Construção civil", "Varejo", "Indústria", "Serviços", "Média"],
      rows: [
        { label: "A — Premium (score > 800)", values: ["A", "0,8%", "0,5%", "0,6%", "0,4%", "0,6%"] },
        { label: "B — Bom (score 650-800)", values: ["B", "2,2%", "1,5%", "1,8%", "1,2%", "1,7%"] },
        { label: "C — Atenção (score 500-650)", values: ["C", "5,8%", "3,8%", "4,5%", "3,2%", "4,3%"] },
        { label: "D — Risco (score < 500)", values: ["D", "14,5%", "10,2%", "12,0%", "8,5%", "11,3%"] },
        { label: "Média ponderada", values: ["—", "5,1%", "3,2%", "4,0%", "2,8%", "3,8%"], emphasis: "total" },
        { label: "% carteira no perfil", values: ["—", "18%", "32%", "28%", "22%", "100%"], indent: 1 },
      ],
    },
    {
      id: "bureau",
      title: "Tabela de scoring do bureau de crédito",
      columns: ["Score", "Probab. default 12m", "Limite máx. sugerido", "Prazo máx.", "Garantia"],
      rows: [
        { label: "850-1000 (A+)", values: ["A+", "0,3%", "R$ 500 mil", "90 dias", "Não exigida"], emphasis: "bold" },
        { label: "750-849 (A)", values: ["A", "0,8%", "R$ 350 mil", "75 dias", "Não exigida"] },
        { label: "650-749 (B)", values: ["B", "2,5%", "R$ 200 mil", "60 dias", "Aval pessoal"] },
        { label: "550-649 (C)", values: ["C", "6,5%", "R$ 80 mil", "45 dias", "Aval + cessão"] },
        { label: "450-549 (D)", values: ["D", "15,0%", "R$ 30 mil", "30 dias", "À vista ou garantia real"] },
        { label: "< 450 (E)", values: ["E", "28,0%", "Negar", "—", "—"], emphasis: "bold" },
      ],
    },
    {
      id: "cobranca_atual",
      title: "Estrutura atual de cobrança",
      columns: ["Item", "Valor"],
      rows: [
        { label: "Headcount", values: ["—", "8 pessoas"] },
        { label: "Custo total anual", values: ["—", "R$ 1,4 M"] },
        { label: "Custo médio por pessoa/mês", values: ["—", "R$ 14,6 k"] },
        { label: "Canais usados", values: ["—", "E-mail + telefone"] },
        { label: "WhatsApp Business / SMS", values: ["—", "Não implementado"] },
        { label: "Empresa terceirizada (> D+60)", values: ["—", "Não contratada"] },
        { label: "PMRV contratual", values: ["—", "60 dias"] },
        { label: "PMRV efetivo (medido)", values: ["—", "78 dias"] },
        { label: "Inadimplência consolidada", values: ["—", "3,8%"] },
        { label: "Custo de capital próprio", values: ["—", "15% a.a."] },
      ],
    },
    {
      id: "politica_atual",
      title: "Política comercial atual vs alternativas avaliadas",
      columns: ["Política", "Prazo", "Desconto à vista", "Custo desc. anual.", "Adoção sugerida"],
      rows: [
        { label: "Atual", values: ["Atual", "60 dias", "Sem desconto", "—", "Manter para baixo risco"], emphasis: "bold" },
        { label: "2/10 net 60", values: ["2/10/60", "60 dias", "2% se até 10 d", "≈ 15,3% a.a.", "Avaliar"] },
        { label: "3/15 net 60", values: ["3/15/60", "60 dias", "3% se até 15 d", "≈ 27,4% a.a.", "Avaliar"] },
        { label: "Pricing por risco", values: ["Risk-based", "30-75 d (por perfil)", "Variável", "—", "Recomendado"] },
      ],
    },
  ],
};
