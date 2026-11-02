import { strings } from "@/lib/strings";

export type DashboardLink = { code: string; title: string };
export type DashboardModule = { number: number; title: string; dashboards: DashboardLink[] };

// Dashboards exportados do claude.ai para artifacts/<código>/ e servidos em public/dash/<slug>.html
export const DASHBOARD_MODULES: DashboardModule[] = [
  {
    number: 1,
    title: strings.navM1,
    dashboards: [
      { code: "D1.1", title: "Balanço vivo" },
      { code: "D1.2", title: "Linha do tempo do ciclo" },
      { code: "D1.3", title: "Reclassificador Fleuriet" },
      { code: "D1.4", title: "Efeito Tesoura" },
    ],
  },
  {
    number: 2,
    title: strings.navM2,
    dashboards: [
      { code: "D2.1", title: "Cascata do orçamento de caixa" },
      { code: "D2.2", title: "Da receita ao caixa" },
      { code: "D2.3", title: "Calendário de saídas" },
      { code: "D2.4", title: "Lucro × caixa" },
      { code: "D2.5", title: "Excedentes" },
      { code: "D2.6", title: "Financiar o déficit" },
      { code: "D2.7", title: "Previsão de caixa" },
    ],
  },
  {
    number: 3,
    title: strings.navM3,
    dashboards: [
      { code: "D3.1", title: "Estoque é dinheiro parado" },
      { code: "D3.2", title: "Curva ABC × XYZ" },
      { code: "D3.3", title: "Lote econômico" },
      { code: "D3.4", title: "Dente de serra" },
    ],
  },
  {
    number: 4,
    title: strings.navM4,
    dashboards: [
      { code: "D4.1", title: "Venda a prazo: o fluxo" },
      { code: "D4.2", title: "Condições de venda" },
      { code: "D4.3", title: "Política A → Δ → B" },
      { code: "D4.4", title: "5 Cs · dossiê Horizonte" },
      { code: "D4.5", title: "Score, cutoff e decisão" },
      { code: "D4.6", title: "KS, AUC e PSI" },
      { code: "D4.7", title: "Régua de cobrança" },
      { code: "D4.8", title: "Antecipação, FIDC e cartão" },
    ],
  },
  {
    number: 5,
    title: strings.navM5,
    dashboards: [
      { code: "D5.1", title: "Fornecedor é credor" },
      { code: "D5.2", title: "Mesa de negociação" },
      { code: "D5.3", title: "Cardápio de instrumentos" },
      { code: "D5.4", title: "Calculadora de CET" },
      { code: "D5.5", title: "Passivo integrado" },
      { code: "D5.6", title: "Covenants com buffer" },
      { code: "D5.7", title: "Fecho da cadeia" },
    ],
  },
];

export const dashboardSlug = (code: string) => code.toLowerCase().replace(/\./g, "-");

export const ALL_DASHBOARDS = DASHBOARD_MODULES.flatMap((m) =>
  m.dashboards.map((d) => ({ ...d, slug: dashboardSlug(d.code), module: m })),
);
