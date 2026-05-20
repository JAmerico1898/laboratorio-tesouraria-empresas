// =============================================================================
// Tintas Tropical — financial dataset
// =============================================================================
// 3.500 SKUs total. Aqui amostra de 40 SKUs do top decile (suficiente para
// construir ABC + EOQ + ES amostral). Valores em consumo anual × custo unit.
// =============================================================================

import type { CaseStudyDataset } from "./types";

// SKU sample: ordered by valor anual (consumo × custo)
const SKU_SAMPLE: Array<[string, string, number, number]> = [
  // [SKU, descrição, consumo_anual_un, custo_unitario_R$]
  ["SKU-001", "Tinta acrílica branca 18L premium", 18000, 145.0],
  ["SKU-002", "Tinta látex branca 18L standard", 24000, 95.0],
  ["SKU-003", "Esmalte sintético branco 3,6L", 32000, 68.0],
  ["SKU-004", "Tinta acrílica colorida 18L (mix)", 12000, 165.0],
  ["SKU-005", "Verniz incolor 3,6L", 22000, 78.0],
  ["SKU-006", "Tinta epoxi industrial 5kg", 6500, 240.0],
  ["SKU-007", "Selador acrílico 18L", 14000, 88.0],
  ["SKU-008", "Massa corrida acrílica 25kg", 18500, 62.0],
  ["SKU-009", "Tinta esmalte premium colorido 0,9L", 28000, 38.0],
  ["SKU-010", "Tinta para piso 18L", 8500, 125.0],
  ["SKU-011", "Tinta antimofo 18L", 7000, 145.0],
  ["SKU-012", "Primer galvanizado 3,6L", 11000, 72.0],
  ["SKU-013", "Tinta acrílica fosca 3,6L", 21000, 36.0],
  ["SKU-014", "Tinta antiferrugem 0,9L", 18000, 38.0],
  ["SKU-015", "Texturizado acrílico 25kg", 5500, 115.0],
  ["SKU-016", "Massa acrílica 25kg", 14000, 42.0],
  ["SKU-017", "Tinta para azulejo 0,9L", 16500, 32.0],
  ["SKU-018", "Verniz marítimo 0,9L", 12000, 42.0],
  ["SKU-019", "Tinta acrílica acetinada 18L", 4800, 102.0],
  ["SKU-020", "Solvente thinner 5L", 22000, 22.0],
  ["SKU-021", "Removedor de tinta 0,9L", 9500, 48.0],
  ["SKU-022", "Tinta spray automotiva 400ml", 28000, 16.0],
  ["SKU-023", "Aguarrás 5L", 14000, 28.0],
  ["SKU-024", "Catalisador epoxi 1kg", 4500, 85.0],
  ["SKU-025", "Tinta para concreto 18L", 3200, 115.0],
  ["SKU-026", "Selador para gesso 3,6L", 8500, 38.0],
  ["SKU-027", "Tinta para madeira 0,9L", 14000, 22.0],
  ["SKU-028", "Massa para textura 25kg", 4200, 68.0],
  ["SKU-029", "Tinta acrílica colorida 0,9L (mix)", 25000, 11.0],
  ["SKU-030", "Resina acrílica 5L", 3800, 68.0],
  ["SKU-031", "Tinta para piscina 5L", 1800, 132.0],
  ["SKU-032", "Adesivo PVA 5L", 6500, 32.0],
  ["SKU-033", "Tinta para telhado 3,6L", 4200, 48.0],
  ["SKU-034", "Tinta esmalte sintético 0,225L", 32000, 6.0],
  ["SKU-035", "Pigmento concentrado 0,5L", 12000, 14.0],
  ["SKU-036", "Verniz para móveis 0,9L", 7500, 22.0],
  ["SKU-037", "Removedor de manchas 0,5L", 8500, 18.0],
  ["SKU-038", "Tinta plástica diversa 0,225L", 24000, 4.5],
  ["SKU-039", "Sealer rápido 0,9L", 5500, 18.0],
  ["SKU-040", "Acessório - rolo + bandeja kit", 18000, 5.0],
];

export const CS3_DATA: CaseStudyDataset = {
  caseId: "cs3",
  tables: [
    {
      id: "premissas",
      title: "Premissas do estoque",
      columns: ["Item", "Valor"],
      rows: [
        { label: "Total de SKUs ativos", values: ["—", "3.500"] },
        { label: "SKUs nesta amostra (top decile)", values: ["—", "40"] },
        { label: "Estoque total atual (R$)", values: ["—", "R$ 142,0 M"] },
        { label: "PMRE médio atual (dias)", values: ["—", "95 dias"] },
        { label: "PMRE setorial benchmark", values: ["—", "60 dias"] },
        { label: "Custo de carregamento (% a.a.)", values: ["—", "22%"] },
        { label: "Custo médio de pedido (R$)", values: ["—", "R$ 95"] },
        { label: "Lead time médio (dias)", values: ["—", "21 dias"] },
        { label: "σ do lead time (dias)", values: ["—", "5 dias"] },
        { label: "Taxa de ruptura — classe A", values: ["—", "1,8%"] },
        { label: "Nível serviço-alvo — críticos", values: ["—", "97% (z = 1,88)"] },
        { label: "Nível serviço-alvo — não críticos", values: ["—", "92% (z = 1,41)"] },
        { label: "Custo de capital (WACC)", values: ["—", "15% a.a."] },
      ],
    },
    {
      id: "skus",
      title: "Amostra de SKUs — top 40 por valor anual",
      subtitle: "Aluno deve calcular: valor anual = consumo × custo, classificar em A/B/C, calcular EOQ",
      columns: [
        "SKU",
        "Descrição",
        "Consumo anual (un)",
        "Custo unit. (R$)",
        "Valor anual (R$)",
        "Classe (a calc.)",
      ],
      rows: SKU_SAMPLE.map(([sku, desc, qty, price]) => ({
        label: sku,
        values: [sku, desc, qty, price, qty * price, "?"],
      })),
    },
    {
      id: "abc_esperado",
      title: "Distribuição ABC esperada (referência para validação)",
      columns: ["Classe", "% SKUs", "% valor", "Política sugerida"],
      rows: [
        { label: "Classe A", values: ["A", "~18-22%", "~78-82%", "Contagem mensal, EOQ refinado, ES por nível 97%"], emphasis: "bold" },
        { label: "Classe B", values: ["B", "~28-32%", "~13-17%", "Contagem trimestral, EOQ padrão, ES nível 92%"] },
        { label: "Classe C", values: ["C", "~48-52%", "~3-7%", "Contagem anual, lote grande, ressuprimento por mínimo"] },
      ],
    },
    {
      id: "estoque_atual",
      title: "Composição atual do estoque por categoria",
      unit: "R$ milhões",
      columns: ["Categoria", "Valor", "% do total", "PMRE (dias)"],
      rows: [
        { label: "Tintas premium", values: ["—", 38.4, "27%", 105] },
        { label: "Tintas standard", values: ["—", 52.5, "37%", 95] },
        { label: "Vernizes e selantes", values: ["—", 24.6, "17%", 88] },
        { label: "Solventes e auxiliares", values: ["—", 14.2, "10%", 75] },
        { label: "Acessórios e diversos", values: ["—", 12.3, "9%", 110] },
        { label: "TOTAL", values: ["—", 142.0, "100%", 95], emphasis: "total" },
      ],
    },
  ],
};
