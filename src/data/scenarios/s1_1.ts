import type { Scenario } from "@/types/scenario";

// =============================================================================
// S1.1 — Indústria Alfa — Diagnóstico de Capital de Giro
// =============================================================================
// Síntese numérica (R$ milhões, 1 casa decimal):
//
// DRE              2023    2024    2025
// Receita          68,0    76,0    80,0    (Δ +11,8% / +5,3%)
// CMV             (44,2)  (51,7)  (57,6)   margem CMV: 65% → 68% → 72%
// Lucro Bruto      23,8    24,3    22,4
// Desp.Op.       (12,0)  (13,0)  (14,0)
// EBIT             11,8    11,3     8,4
// Desp.Fin.       (1,8)   (2,6)   (3,8)
// Lucro Líquido    10,0     8,7     4,6
//
// BP — Ativo       2023    2024    2025
// Caixa+Aplic.      5,5     3,2     1,3   = ACF
// Clientes          9,4    12,2    14,4
// Estoques          6,8     9,3    12,0
// Adiantamentos     0,8     0,9     1,0
// Imp. a recuper.   1,4     1,6     1,8
// ACO              18,4    24,0    29,2
// AC               23,9    27,2    30,5
// ANC              28,0    32,0    35,0
// Total            51,9    59,2    65,5
//
// BP — Passivo
// Empréstimos CP    4,0     6,5    11,0
// Dup. descontadas  1,0     1,5     2,5
// PCF               5,0     8,0    13,5
// Fornecedores      4,3     4,6     4,5
// Salários a pagar  1,2     1,4     1,6
// Tributos a rec.   1,8     2,0     2,2
// PCO               7,3     8,0     8,3
// PC               12,3    16,0    21,8
// PELP             14,0    16,0    18,0
// PL               25,6    27,2    25,7
// Total            51,9    59,2    65,5
//
// Indicadores Fleuriet
//                  2023    2024    2025
// CCL=AC−PC        11,6    11,2     8,7
// NCG=ACO−PCO      11,1    16,0    20,9
// ST=CCL−NCG       +0,5    −4,8   −12,2   <- efeito tesoura
//
// Prazos médios (base 360 dias)
// PMRE = Estoque/CMV×360       55      65     75
// PMRV = Clientes/Receita×360  50      58     65
// PMPF = Forn/CMV×360          35      32     28
// Ciclo financeiro = PMRE+PMRV−PMPF = 70 → 91 → 112 dias
//
// Liquidez corrente 2025 = 30,5/21,8 = 1,40 ;  2024 = 1,70 ; 2023 = 1,94
// Liquidez seca   2025 = (30,5−12,0)/21,8 = 0,85
// Liquidez imediata 2025 = 1,3/21,8 = 0,06
// =============================================================================

export const S1_1: Scenario = {
  id: "s1_1",
  code: "S1.1",
  title: "Indústria Alfa — diagnóstico do capital de giro",
  company: "Indústria Alfa S.A.",
  difficulty: "Intermediário",
  estimatedMinutes: 20,
  context: {
    narrative:
      "Você é tesoureiro(a) recém-contratado(a) da **Indústria Alfa S.A.**, fabricante de componentes metálicos com **receita de R$ 80,0 milhões** em 2025. A receita cresce **~18% no triênio**, mas o CFO está inquieto: apesar de a empresa continuar lucrativa, **o caixa secou** (R$ 1,3M ao final de 2025 vs R$ 5,5M em 2023) e **as despesas financeiras quase dobraram**. Você recebe BP e DRE de 2023/2024/2025 e precisa diagnosticar se há **efeito tesoura** em curso e o que fazer.",
    keyFacts: [
      ["Setor", "Indústria metalúrgica"],
      ["Receita 2025", "R$ 80,0M"],
      ["Crescimento 3 anos", "+17,6%"],
      ["Lucro líquido 2025", "R$ 4,6M"],
      ["Caixa+Aplicações 2025", "R$ 1,3M"],
      ["Empréstimos CP 2025", "R$ 11,0M"],
      ["Margem CMV", "65% → 72%"],
      ["Despesas financeiras", "1,8M → 3,8M"],
      ["Custo médio da dívida CP", "~14% a.a."],
      ["Compras anuais (base)", "~R$ 40 M"],
    ],
  },
  statements: [
    {
      id: "bp_alfa",
      title: "Balanço Patrimonial — Indústria Alfa",
      unit: "R$ milhões",
      periods: ["2023", "2024", "2025"],
      sections: [
        {
          label: "ATIVO CIRCULANTE",
          rows: [
            { label: "Caixa e equivalentes", values: [2.5, 1.4, 0.6], indent: 1 },
            { label: "Aplicações financeiras", values: [3.0, 1.8, 0.7], indent: 1 },
            { label: "Ativo Circulante Financeiro (ACF)", values: [5.5, 3.2, 1.3], emphasis: "subtotal", indent: 0 },
            { label: "Clientes", values: [9.4, 12.2, 14.4], indent: 1 },
            { label: "Estoques", values: [6.8, 9.3, 12.0], indent: 1 },
            { label: "Adiantamentos a fornecedores", values: [0.8, 0.9, 1.0], indent: 1 },
            { label: "Impostos a recuperar", values: [1.4, 1.6, 1.8], indent: 1 },
            { label: "Ativo Circulante Operacional (ACO)", values: [18.4, 24.0, 29.2], emphasis: "subtotal", indent: 0 },
            { label: "Ativo Circulante (AC)", values: [23.9, 27.2, 30.5], emphasis: "bold", indent: 0 },
          ],
        },
        {
          label: "ATIVO NÃO CIRCULANTE",
          rows: [
            { label: "Imobilizado e intangíveis (ANC)", values: [28.0, 32.0, 35.0], indent: 1 },
            { label: "Ativo Total", values: [51.9, 59.2, 65.5], emphasis: "total", indent: 0 },
          ],
        },
        {
          label: "PASSIVO CIRCULANTE",
          rows: [
            { label: "Empréstimos e financiamentos CP", values: [4.0, 6.5, 11.0], indent: 1 },
            { label: "Duplicatas descontadas", values: [1.0, 1.5, 2.5], indent: 1 },
            { label: "Passivo Circulante Financeiro (PCF)", values: [5.0, 8.0, 13.5], emphasis: "subtotal", indent: 0 },
            { label: "Fornecedores", values: [4.3, 4.6, 4.5], indent: 1 },
            { label: "Salários e encargos a pagar", values: [1.2, 1.4, 1.6], indent: 1 },
            { label: "Tributos a recolher", values: [1.8, 2.0, 2.2], indent: 1 },
            { label: "Passivo Circulante Operacional (PCO)", values: [7.3, 8.0, 8.3], emphasis: "subtotal", indent: 0 },
            { label: "Passivo Circulante (PC)", values: [12.3, 16.0, 21.8], emphasis: "bold", indent: 0 },
          ],
        },
        {
          label: "PASSIVO NÃO CIRCULANTE E PL",
          rows: [
            { label: "Passivo Exigível a Longo Prazo (PELP)", values: [14.0, 16.0, 18.0], indent: 1 },
            { label: "Patrimônio Líquido (PL)", values: [25.6, 27.2, 25.7], indent: 1 },
            { label: "Passivo + PL Total", values: [51.9, 59.2, 65.5], emphasis: "total", indent: 0 },
          ],
        },
      ],
    },
    {
      id: "dre_alfa",
      title: "Demonstração do Resultado — Indústria Alfa",
      unit: "R$ milhões",
      periods: ["2023", "2024", "2025"],
      sections: [
        {
          label: "RESULTADO",
          rows: [
            { label: "Receita líquida", values: [68.0, 76.0, 80.0], emphasis: "bold" },
            { label: "(−) CMV", values: [-44.2, -51.7, -57.6] },
            { label: "= Lucro Bruto", values: [23.8, 24.3, 22.4], emphasis: "subtotal" },
            { label: "(−) Despesas operacionais", values: [-12.0, -13.0, -14.0] },
            { label: "= EBIT", values: [11.8, 11.3, 8.4], emphasis: "subtotal" },
            { label: "(−) Despesas financeiras líquidas", values: [-1.8, -2.6, -3.8] },
            { label: "= Lucro líquido", values: [10.0, 8.7, 4.6], emphasis: "total" },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Liquidez e prazos médios.** Para 2025, qual é o **PMRE (prazo médio de renovação de estoques)**?",
      choices: [
        {
          id: "e1_a",
          label: "PMRE = 75 dias — calculado como (12,0 / 57,6) × 360",
          correct: true,
          score: 20,
          feedback:
            "Correto. **PMRE = (Estoque / CMV) × 360 = (12,0 / 57,6) × 360 = 75 dias**. O estoque permanece em média **75 dias** antes de ser consumido — alongamento expressivo frente a 2023 (55 dias) e 2024 (65 dias). Esse alongamento é a **principal causa do crescimento da NCG** e do consumo de caixa. Conceito reforçado: o PMRE usa **CMV** no denominador (custo, não preço de venda) porque é com base nesse fluxo que o estoque é baixado.",
        },
        {
          id: "e1_b",
          label: "PMRE = 54 dias — calculado como (12,0 / 80,0) × 360",
          correct: false,
          score: 5,
          feedback:
            "Erro clássico: usar **Receita** no denominador em vez do **CMV**. O estoque é avaliado a custo e é consumido pelo CMV, não pela receita. **Fórmula correta: PMRE = (Estoque / CMV) × 360 = (12,0 / 57,6) × 360 = 75 dias**, não 54. Esse erro **subestima sistematicamente o ciclo operacional** e faz parecer que tudo está bem quando não está.",
        },
        {
          id: "e1_c",
          label: "PMRE = 65 dias — média móvel dos três anos",
          correct: false,
          score: 0,
          feedback:
            "Média móvel não é uma técnica padrão para prazos médios em análise pontual. O indicador deve refletir a posição do ano analisado. **PMRE 2025 = (12,0 / 57,6) × 360 = 75 dias.** A média de 55+65+75 = 65 esconde justamente a tendência de deterioração — que é a informação mais relevante para o diagnóstico.",
        },
        {
          id: "e1_d",
          label: "PMRE = 75 dias — calculado como (12,0 / Receita Bruta × 360), por coincidência",
          correct: false,
          score: 0,
          feedback:
            "O **número** está certo por outro caminho, mas a **fórmula** está errada. O denominador correto é o **CMV** (custo dos produtos vendidos), não a receita. Coincidir nesta questão é sorte; em outros casos a diferença muda completamente o número. Use **PMRE = (Estoque / CMV) × 360**.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Tendências.** Comparando 2023 → 2025, qual é o diagnóstico mais preciso sobre os prazos médios?",
      choices: [
        {
          id: "e2_a",
          label:
            "PMRV alonga de 50 → 65d, PMRE de 55 → 75d e PMPF **encurta** de 35 → 28d. O **ciclo financeiro** sobe de 70 para 112 dias — financiamento adicional necessário em apenas 3 anos.",
          correct: true,
          score: 20,
          feedback:
            "Diagnóstico correto. **Cálculos** (base 360 dias): **PMRV = (Clientes / Receita) × 360**: 2023 = (9,4/68,0)×360 = **50d**; 2025 = (14,4/80,0)×360 = **65d**. **PMRE = (Estoque / CMV) × 360**: 2023 = (6,8/44,2)×360 = **55d**; 2025 = (12,0/57,6)×360 = **75d**. **PMPF = (Fornecedores / CMV) × 360**: 2023 = (4,3/44,2)×360 = **35d**; 2025 = (4,5/57,6)×360 = **28d** — note que o denominador do PMPF é o **CMV** (compras como proxy), pela mesma lógica do PMRE. **Ciclo financeiro = PMRE + PMRV − PMPF**: 2023 = 55+50−35 = 70d; 2025 = 75+65−28 = **112d**. Cada dia adicional ≈ **R$ 80M/360 = R$ 0,22M** de necessidade extra. 42 dias × R$ 0,22M ≈ **R$ 9,3M** — coerente com a alta da NCG (11,1 → 20,9 = +9,8M). Conceito-chave: **alongar prazos a receber sem alongar prazos a pagar é o caminho mais rápido para o efeito tesoura**.",
        },
        {
          id: "e2_b",
          label: "Os três prazos alongam, mas o PMPF cresceu o suficiente para compensar PMRE e PMRV.",
          correct: false,
          score: 0,
          feedback:
            "Atenção aos números: **PMPF não cresceu — ele encurtou** de 35 para 28 dias. Fornecedores ficaram mais rígidos (talvez por percepção de risco de crédito da Alfa). Fórmula: **PMPF = (Fornecedores / CMV) × 360 = (4,5 / 57,6) × 360 = 28 dias** em 2025. Essa redução **piora** o ciclo financeiro, não compensa nada.",
        },
        {
          id: "e2_c",
          label:
            "Apenas o PMRV alonga; PMRE e PMPF estão estáveis — o problema é exclusivamente comercial.",
          correct: false,
          score: 5,
          feedback:
            "Parcialmente correto sobre o PMRV (alongou de 50 → 65d), mas o PMRE **também alonga forte** (55 → 75d, +20d) e o PMPF **encurta** (35 → 28d, −7d). O problema é tripartido — não exclusivamente comercial. Atribuir tudo à área comercial leva a diagnósticos enviesados e a soluções que não atacam estoque (curva ABC) nem suprimentos (renegociação com fornecedores).",
        },
        {
          id: "e2_d",
          label:
            "PMRE alonga porque CMV cresce; isso é positivo, sinaliza giro mais lento e maior margem.",
          correct: false,
          score: 0,
          feedback:
            "Inversão grave: **PMRE alongando significa giro MAIS LENTO**, não maior margem. Pelo contrário, na Alfa a margem caiu (CMV/Receita: 65% → 72%). Estoque mais alto **consome mais caixa** sem entregar contrapartida de venda. O sinal correto é **vermelho**: o estoque está acumulando, possivelmente por obsolescência, mix mal calibrado ou produção desconectada da demanda.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Diagnóstico Fleuriet — 2025.** Qual conjunto está correto e o que ele revela?",
      choices: [
        {
          id: "e3_a",
          label:
            "CCL = R$ 8,7M; NCG = R$ 20,9M; ST = −R$ 12,2M — efeito tesoura claro: ST negativo crescente em 3 anos.",
          correct: true,
          score: 20,
          feedback:
            "Exato. **CCL = AC − PC = 30,5 − 21,8 = 8,7**. **NCG = ACO − PCO = 29,2 − 8,3 = 20,9**. **ST = CCL − NCG = 8,7 − 20,9 = −12,2**. O ST negativo de R$ 12,2M é financiado por **PCF (R$ 13,5M de empréstimos CP e duplicatas descontadas)** — a empresa está **rolando dívida de curto prazo para sustentar a operação**. Trajetória de ST: +0,5 (2023) → −4,8 (2024) → −12,2 (2025) é o **efeito tesoura clássico**: NCG cresce com a receita; CCL não acompanha porque o autofinanciamento (LL caindo de 10 → 4,6) é insuficiente.",
        },
        {
          id: "e3_b",
          label:
            "CCL = R$ 8,7M; NCG = R$ 30,5M; ST = −R$ 21,8M — empresa em insolvência iminente.",
          correct: false,
          score: 0,
          feedback:
            "Erro de fórmula: você usou **AC inteiro como NCG (30,5)** e **PC inteiro como ST**. NCG não é AC — é **apenas a parcela operacional**: **NCG = ACO − PCO = 29,2 − 8,3 = 20,9**. ACF (caixa, aplicações) **não entra** na NCG porque é financeiro/errático. Similarmente, ST = CCL − NCG = −12,2 (não −21,8). A confusão entre AC e ACO é o erro mais frequente neste cálculo.",
        },
        {
          id: "e3_c",
          label:
            "CCL = R$ 8,7M; NCG = R$ 20,9M; ST = +R$ 8,7M — situação confortável, ST positivo igual ao CCL.",
          correct: false,
          score: 5,
          feedback:
            "Os dois primeiros números estão certos, mas o **ST está errado**. Fórmula: **ST = CCL − NCG = 8,7 − 20,9 = −12,2M (negativo)**, não +8,7M. ST positivo só ocorreria se CCL > NCG. Aqui, CCL é **menor** que NCG — a empresa **não tem folga**, está em deficit financeiro estrutural. O sinal do ST é a informação mais crítica do modelo Fleuriet.",
        },
        {
          id: "e3_d",
          label:
            "CCL = R$ 25,7M; NCG = R$ 20,9M; ST = +R$ 4,8M — empresa saudável, com PL robusto sustentando o capital de giro.",
          correct: false,
          score: 0,
          feedback:
            "Erro: você usou o **PL (25,7M) como CCL**. PL não é CCL. **CCL = AC − PC = 30,5 − 21,8 = 8,7M** (ou, equivalentemente, **PL + PELP − ANC = 25,7 + 18,0 − 35,0 = 8,7**). O cálculo de CCL exige confronto **circulante × circulante**. A confusão entre PL e CCL leva a um diagnóstico falsamente otimista — a empresa está, de fato, em efeito tesoura.",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Renegociar PMPF com fornecedores",
      shortLabel: "Alongar PMPF",
      description:
        "Negociar com os três principais fornecedores (que respondem por **70% das compras**) a extensão do **PMPF de 28 para 45 dias**. Em contrapartida, perde-se cerca de **2% de desconto comercial** e cria-se dependência relacional.",
      resultPanel: {
        headline: "PMPF 28 → 45 dias liberou caixa, mas a operação ficou refém de 3 fornecedores",
        deltas: [
          { label: "Δ Fornecedores", value: "+R$ 2,7M (4,5 → 7,2)", tone: "positive" },
          { label: "Δ NCG", value: "−R$ 2,7M (20,9 → 18,2)", tone: "positive" },
          { label: "Δ CCL", value: "R$ 0 (8,7 inalterado)", tone: "neutral" },
          { label: "Δ ST", value: "+R$ 2,7M (−12,2 → −9,5)", tone: "positive" },
          { label: "Caixa liberado", value: "R$ 2,7M imediato", tone: "positive" },
          { label: "Risco residual", value: "Alto — dependência relacional", tone: "negative" },
        ],
        commentary:
          "**Ganho rápido, mas tático.** Cálculo: novo Fornecedores = 57,6 × 45/360 = **R$ 7,2M** (era 4,5M) → ΔPCO = +2,7 → NCG cai para 18,2M. ST melhora R$ 2,7M, mas **continua negativo (−R$ 9,5M)**. Trade-offs: (1) perda de desconto comercial de ~2% sobre R$ 40M de compras = **−R$ 0,8M de margem/ano**; (2) **exposição concentrada** — se um dos três fornecedores cortar o crédito, o caixa colapsa em 45 dias; (3) não ataca a **causa-raiz** (estoque alongado e PMRV crescente).",
      },
      reflection: {
        prompt:
          "Você ganhou R$ 2,7M de caixa renegociando PMPF, mas o ST ainda é negativo (−R$ 9,5M). Qual é o **maior risco residual** desta escolha?",
        choices: [
          {
            id: "ra_a",
            label:
              "Concentração de risco: 70% das compras em 3 fornecedores cria risco de **liquidez tail** — se um corta crédito, a NCG salta R$ 2,7M de volta em 45 dias.",
            correct: true,
            score: 25,
            feedback:
              "Correto. O ganho de PMPF é **reversível em uma reunião**. Em modelos de risco de tesouraria, isso é tratado como **risco de rollover de passivo operacional** — equivalente em natureza ao risco de rollover bancário, mas frequentemente subestimado porque não aparece nos covenants. Boa prática: **diversificar fornecedores** e contratualizar o prazo (não deixar discricionário).",
          },
          {
            id: "ra_b",
            label: "Risco contábil — alongar PMPF muda o reconhecimento da despesa de juros.",
            correct: false,
            score: 0,
            feedback:
              "Não. Crédito comercial **não** é juros explícitos — é custo de oportunidade (desconto perdido). Não há reclassificação contábil de juros. O risco real é **comercial e de liquidez**, não contábil.",
          },
          {
            id: "ra_c",
            label: "Risco regulatório — o BACEN limita prazos de fornecedores a 30 dias.",
            correct: false,
            score: 0,
            feedback:
              "Não existe essa regulação. Prazos comerciais são livremente pactuados. O risco real é **dependência relacional** e perda de desconto, não regulatório.",
          },
          {
            id: "ra_d",
            label:
              "Nenhum risco relevante — alongar PMPF é sempre dominante porque libera caixa sem custo.",
            correct: false,
            score: 0,
            feedback:
              "Existe **custo embutido**: a perda do desconto comercial (~2% sobre R$ 40M = R$ 0,8M/ano). Em base anualizada, esse custo equivale a uma **taxa implícita** que pode ultrapassar o CDI — frequentemente, **pagar à vista com desconto é financeiramente superior** a pagar a prazo sem desconto. Sempre compare a TIR do desconto com o custo da dívida.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — Reduzir estoque via curva ABC e revisão de SKUs",
      shortLabel: "Reduzir estoque",
      description:
        "Projeto de **6 meses** liderado pela operação para reduzir o PMRE de **75 para 50 dias** via curva ABC e descontinuação de SKUs de baixíssimo giro. Libera caixa estrutural sem deteriorar relações comerciais.",
      resultPanel: {
        headline: "PMRE 75 → 50 dias libera R$ 4,0M de forma estrutural — solução mais durável",
        deltas: [
          { label: "Δ Estoques", value: "−R$ 4,0M (12,0 → 8,0)", tone: "positive" },
          { label: "Δ NCG", value: "−R$ 4,0M (20,9 → 16,9)", tone: "positive" },
          { label: "Δ CCL", value: "R$ 0 (caixa amortiza PCF)", tone: "neutral" },
          { label: "Δ ST", value: "+R$ 4,0M (−12,2 → −8,2)", tone: "positive" },
          { label: "Caixa liberado", value: "R$ 4,0M em 6 meses", tone: "positive" },
          { label: "Risco residual", value: "Médio — ruptura de SKU C", tone: "neutral" },
        ],
        commentary:
          "**Solução estrutural.** Cálculo: novo Estoque = 57,6 × 50/360 = **R$ 8,0M** (era 12,0M) → ΔACO = −4,0 → NCG cai para 16,9M. O caixa liberado de R$ 4,0M amortiza empréstimos de curto prazo (ΔPCF = −4,0; ΔAC = −4,0) — **CCL inalterado**, mas a dívida onerosa cai. ST melhora R$ 4,0M (−12,2 → −8,2). Vantagem central: **ganho não depende de terceiros** e ainda **reduz despesas financeiras** (≈ R$ 4,0M × 14% = R$ 0,56M/ano). Riscos: ruptura de SKUs C mal classificados (use **service level por classe**: A=99%, B=95%, C=85%).",
      },
      reflection: {
        prompt:
          "Por que reduzir estoque é estruturalmente superior a renegociar PMPF, mesmo que o ST final ainda seja negativo?",
        choices: [
          {
            id: "rb_a",
            label:
              "Porque ataca a **causa-raiz** (capital travado em estoque ocioso), reduz despesas financeiras futuras e o ganho é permanente — enquanto PMPF é reversível.",
            correct: true,
            score: 25,
            feedback:
              "Correto. Hierarquia de qualidade das ações sobre NCG: **(1) reduzir ACO operacional** (estoque, recebíveis) > **(2) aumentar PCO** (fornecedores, tributos). A primeira é estrutural e **gera caixa permanente**; a segunda é reversível e depende de terceiros. Bônus: cada R$ 4M removido do estoque também elimina **custo de carregamento** (espaço, seguro, obsolescência) ≈ 20% a.a. = R$ 0,8M adicionais por ano.",
          },
          {
            id: "rb_b",
            label: "Porque reduz a NCG e o CCL na mesma magnitude — equilibrando o BP.",
            correct: false,
            score: 5,
            feedback:
              "Reduzir estoque **não altera o CCL** (AC cai 4 e, ao amortizar PCF, PC também cai 4 → CCL inalterado). O que melhora é o **ST** (que sobe R$ 4,0M). Errar isso revela confusão entre CCL e NCG: ambos sobem juntos quando a empresa cresce, mas **o ST é a folga real**.",
          },
          {
            id: "rb_c",
            label: "Porque aumenta o ROE ao reduzir o PL imobilizado em estoque.",
            correct: false,
            score: 0,
            feedback:
              "Estoque é **ativo circulante**, não PL. Reduzir estoque libera caixa, não reduz PL. O ROE pode até melhorar (pelo menor ativo total e menor despesa financeira), mas o **mecanismo correto** é redução de NCG e custo financeiro, não redução de PL.",
          },
          {
            id: "rb_d",
            label: "Não é superior — PMPF libera o mesmo caixa sem prazo de implementação.",
            correct: false,
            score: 0,
            feedback:
              "PMPF libera apenas **R$ 2,7M** (vs R$ 4,0M da redução de estoque) e é **reversível** ao primeiro estresse de crédito. Além disso, PMPF tem **custo embutido** (perda de desconto comercial ≈ R$ 0,8M/ano). Estruturalmente, reduzir estoque domina.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — Captar R$ 10M em dívida de longo prazo",
      shortLabel: "Alongar dívida",
      description:
        "Captar **R$ 10,0M em capital de giro de 36 meses** a uma taxa de **CDI + 4% a.a.** e usar integralmente para **amortizar conta garantida e empréstimos rotativos (PCF)**. Aumenta estruturalmente o CCL e tira o ST do vermelho.",
      resultPanel: {
        headline: "Reperfilamento da dívida: ST sai de −R$ 12,2M para −R$ 2,2M — quase no zero",
        deltas: [
          { label: "Δ PELP", value: "+R$ 10,0M (18,0 → 28,0)", tone: "positive" },
          { label: "Δ PCF", value: "−R$ 10,0M (13,5 → 3,5)", tone: "positive" },
          { label: "Δ CCL", value: "+R$ 10,0M (8,7 → 18,7)", tone: "positive" },
          { label: "Δ NCG", value: "R$ 0 (20,9 inalterado)", tone: "neutral" },
          { label: "Δ ST", value: "+R$ 10,0M (−12,2 → −2,2)", tone: "positive" },
          { label: "Risco residual", value: "Médio — custo financeiro maior", tone: "neutral" },
        ],
        commentary:
          "**Reperfilamento puro.** Cálculo: ΔPELP = +10; ΔPCF = −10 → PC cai de 21,8 para 11,8 → **CCL = AC − PC = 30,5 − 11,8 = 18,7** (+10). NCG inalterada (não toca em ACO/PCO). ST = 18,7 − 20,9 = **−2,2** — quase no equilíbrio. Vantagem: **resolve o efeito tesoura sem mexer na operação**. Custo: o spread bancário em LP (CDI+4%) costuma ser **maior** que o de CP (CDI+2,5% em conta garantida), mas o **risco de rollover desaparece**. Cuidado: esta solução **não cura a causa-raiz** — se NCG continuar crescendo no ritmo atual (+R$ 5M/ano), em 2 anos o ST volta para o vermelho.",
      },
      reflection: {
        prompt:
          "Captar LP melhora o ST imediatamente, mas há uma **armadilha** comum. Qual?",
        choices: [
          {
            id: "rc_a",
            label:
              "Reperfilar dívida **não reduz a NCG** — se a operação continuar consumindo caixa no mesmo ritmo, o efeito tesoura volta em 2 anos com a dívida agora mais cara.",
            correct: true,
            score: 25,
            feedback:
              "Exato. A captação trata o **sintoma** (ST negativo), não a **doença** (NCG crescente). Boa prática: usar a captação para **comprar tempo** enquanto se executa simultaneamente as ações estruturais (redução de estoque, melhoria de PMRV). A combinação Cenário B + Cenário C costuma ser o **plano dominante** em tesourarias maduras: cura + alívio.",
          },
          {
            id: "rc_b",
            label: "A captação reduz o PL — diluindo os sócios.",
            correct: false,
            score: 0,
            feedback:
              "Dívida **não** reduz PL. Quem reduz PL é equity (recompra, dividendo). Confundir os dois é confundir **passivo oneroso** com **patrimônio**. A captação aumenta o passivo (PELP) sem tocar no PL — apenas eleva a alavancagem.",
          },
          {
            id: "rc_c",
            label: "A captação aumenta o ANC porque entra como aplicação financeira.",
            correct: false,
            score: 0,
            feedback:
              "Se o uso for amortizar PCF (como descrito), o caixa entra e sai imediatamente — o ANC **não muda**. Se ficasse parado em aplicação, sim, mas isso seria **carregar dívida cara para render CDI**, operação destruidora de valor.",
          },
          {
            id: "rc_d",
            label:
              "Não há armadilha — captar LP é sempre dominante porque resolve o ST sem custo operacional.",
            correct: false,
            score: 5,
            feedback:
              "Tem custo: **spread bancário maior em LP** (cerca de +150bps em médio porte) e **covenants** mais rigorosos (Dívida Líquida/EBITDA, liquidez corrente mínima). E, principalmente, **não cura a NCG**: se o consumo operacional continuar, em 2-3 anos a empresa volta ao efeito tesoura, agora com balanço pior.",
          },
        ],
      },
    },
  ],
};
