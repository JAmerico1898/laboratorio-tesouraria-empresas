// =============================================================================
// TecnoVerde SA — financial dataset (R$ milhões)
// =============================================================================
// Receita anual R$ 180 M com distribuição mensal sazonal (pico jul-dez).
// PMRV 60 d (90 d em 40% do mix), PMPF 45 d, inadimplência 1,8%.
// Caixa atual R$ 12 M, mínimo R$ 3 M. Linhas pré-aprovadas R$ 40 M em 3 bancos.
// =============================================================================

import type { CaseStudyDataset } from "./types";

export const CS2_DATA: CaseStudyDataset = {
  caseId: "cs2",
  tables: [
    {
      id: "sazonalidade",
      title: "Distribuição mensal de receita — R$ 180 milhões/ano",
      unit: "R$ milhões / %",
      columns: ["Mês", "Receita", "% do ano", "Receita acumulada"],
      rows: [
        { label: "Janeiro", values: ["Jan", 4.5, "2,5%", 4.5] },
        { label: "Fevereiro", values: ["Fev", 5.4, "3,0%", 9.9] },
        { label: "Março", values: ["Mar", 7.2, "4,0%", 17.1] },
        { label: "Abril", values: ["Abr", 9.0, "5,0%", 26.1] },
        { label: "Maio", values: ["Mai", 10.8, "6,0%", 36.9] },
        { label: "Junho", values: ["Jun", 16.2, "9,0%", 53.1] },
        { label: "1º Semestre", values: ["1H", 53.1, "29,5%", 53.1], emphasis: "subtotal" },
        { label: "Julho", values: ["Jul", 21.6, "12,0%", 74.7] },
        { label: "Agosto", values: ["Ago", 25.2, "14,0%", 99.9] },
        { label: "Setembro", values: ["Set", 27.0, "15,0%", 126.9] },
        { label: "Outubro", values: ["Out", 23.4, "13,0%", 150.3] },
        { label: "Novembro", values: ["Nov", 19.8, "11,0%", 170.1] },
        { label: "Dezembro", values: ["Dez", 9.9, "5,5%", 180.0] },
        { label: "2º Semestre", values: ["2H", 126.9, "70,5%", 180.0], emphasis: "subtotal" },
        { label: "TOTAL ANO", values: ["—", 180.0, "100,0%", 180.0], emphasis: "total" },
      ],
    },
    {
      id: "premissas",
      title: "Premissas operacionais",
      columns: ["Item", "Valor"],
      rows: [
        { label: "PMRV médio (geral)", values: ["—", "60 dias"] },
        { label: "PMRV clientes grandes (40% do mix)", values: ["—", "90 dias"] },
        { label: "PMRV efetivo ponderado", values: ["—", "72 dias"] },
        { label: "PMPF médio", values: ["—", "45 dias"] },
        { label: "PMPF negociável (extensão)", values: ["—", "até 60 dias"] },
        { label: "Inadimplência histórica", values: ["—", "1,8%"] },
        { label: "Margem bruta", values: ["—", "32%"] },
        { label: "CMV (% da receita)", values: ["—", "68%"] },
        { label: "Despesas operacionais fixas mensais", values: ["—", "R$ 3,5 M"] },
        { label: "Folha + encargos mensal", values: ["—", "R$ 2,8 M"] },
        { label: "13º salário (jun e nov)", values: ["—", "R$ 2,8 M cada"] },
        { label: "Tributos mensais", values: ["—", "R$ 1,8 M"] },
        { label: "CAPEX programado anual", values: ["—", "R$ 8,0 M (jul + ago)"] },
        { label: "Saldo de caixa atual", values: ["—", "R$ 12,0 M"] },
        { label: "Saldo mínimo de caixa", values: ["—", "R$ 3,0 M"] },
        { label: "WACC (referência)", values: ["—", "14% a.a."] },
        { label: "CDI referência", values: ["—", "12% a.a."] },
      ],
    },
    {
      id: "linhas",
      title: "Linhas pré-aprovadas — bancos parceiros",
      columns: ["Banco", "Modalidade", "Limite (R$ M)", "Taxa", "Prazo máx."],
      rows: [
        { label: "Banco Alpha", values: ["—", "Capital de Giro 12m", 18.0, "CDI+3,8%", "12 meses"] },
        { label: "Banco Alpha", values: ["—", "Conta Garantida", 5.0, "CDI+9,5%", "rotativo"] },
        { label: "Banco Beta", values: ["—", "Antecipação de Recebíveis", 10.0, "1,7% a.m.", "até 90 d"] },
        { label: "Banco Beta", values: ["—", "Capital de Giro 6m", 4.0, "CDI+4,5%", "6 meses"] },
        { label: "Banco Gama", values: ["—", "Conta Garantida", 3.0, "CDI+10,0%", "rotativo"] },
        { label: "TOTAL LIMITES", values: ["—", "—", 40.0, "—", "—"], emphasis: "total" },
      ],
    },
    {
      id: "calendario",
      title: "Calendário fiscal e folha — eventos não-recorrentes",
      columns: ["Mês", "Evento", "Valor (R$ M)"],
      rows: [
        { label: "Janeiro", values: ["Jan", "IPVA frota + IPTU", -0.8] },
        { label: "Março", values: ["Mar", "IRPJ/CSLL trimestral", -1.5] },
        { label: "Junho", values: ["Jun", "13º salário (1ª parcela)", -2.8] },
        { label: "Junho", values: ["Jun", "IRPJ/CSLL trimestral", -1.8] },
        { label: "Julho", values: ["Jul", "CAPEX programado", -4.0] },
        { label: "Agosto", values: ["Ago", "CAPEX programado", -4.0] },
        { label: "Setembro", values: ["Set", "IRPJ/CSLL trimestral", -2.2] },
        { label: "Novembro", values: ["Nov", "13º salário (2ª parcela)", -2.8] },
        { label: "Dezembro", values: ["Dez", "PLR/bônus", -1.5] },
        { label: "Dezembro", values: ["Dez", "IRPJ/CSLL trimestral", -2.5] },
      ],
    },
    {
      id: "template_orcamento",
      title: "Orçamento de caixa — TEMPLATE (12 meses)",
      subtitle: "Estrutura pronta para o aluno preencher com base nas premissas",
      unit: "R$ milhões",
      columns: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      rows: [
        { label: "Saldo inicial", values: [12.0, null, null, null, null, null, null, null, null, null, null, null], emphasis: "bold" },
        { label: "Recebimentos de vendas", values: [null, null, null, null, null, null, null, null, null, null, null, null], indent: 1 },
        { label: "Pagamentos a fornecedores", values: [null, null, null, null, null, null, null, null, null, null, null, null], indent: 1 },
        { label: "Folha + encargos", values: [-2.8, -2.8, -2.8, -2.8, -2.8, -5.6, -2.8, -2.8, -2.8, -2.8, -5.6, -2.8], indent: 1 },
        { label: "Tributos", values: [-1.8, -1.8, -3.3, -1.8, -1.8, -3.6, -1.8, -1.8, -4.0, -1.8, -1.8, -4.3], indent: 1 },
        { label: "CAPEX", values: [0, 0, 0, 0, 0, 0, -4.0, -4.0, 0, 0, 0, 0], indent: 1 },
        { label: "Outros (IPVA/IPTU/PLR)", values: [-0.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1.5], indent: 1 },
        { label: "Saldo do mês", values: [null, null, null, null, null, null, null, null, null, null, null, null], emphasis: "subtotal" },
        { label: "Saldo acumulado", values: [null, null, null, null, null, null, null, null, null, null, null, null], emphasis: "total" },
        { label: "Necessidade (vs mínimo R$ 3 M)", values: [null, null, null, null, null, null, null, null, null, null, null, null], emphasis: "bold" },
      ],
    },
  ],
};
