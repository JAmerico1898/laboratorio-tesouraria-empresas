import type { Scenario } from "@/types/scenario";

// =============================================================================
// S3.2 — EOQ com fretes e descontos — Tinta Tropical
// =============================================================================
// Premissas:
//
// SKU top: lata 18 L de tinta branca acrílica.
// Demanda anual D = 15.000 latas/ano.
// Custo de pedido S = R$ 120 (processamento + recepção + inspeção).
// Custo de carregamento H = R$ 8/lata/ano (≈ 20% × preço base R$ 40).
// Preço base (sem desconto) = R$ 40/lata.
//
// EOQ clássico (sem desconto):
//   EOQ = √(2·D·S / H) = √(2·15.000·120 / 8) = √450.000 ≈ 671 latas
//   Pedidos/ano = 15.000 / 671 ≈ 22,4
//   Custo total anual = D·P + (D/Q)·S + (Q/2)·H
//     = 15.000·40 + 22,4·120 + 335,4·8
//     = 600.000 + 2.683 + 2.683 = R$ 605.366
//
// Tabela de desconto do fornecedor:
//   Até 999 un/pedido .......... preço cheio R$ 40,00
//   De 1.000 a 2.999 un/pedido . 3% desc = R$ 38,80
//   ≥ 3.000 un/pedido .......... 5% desc = R$ 38,00
//
// Frete: R$ 800 por pedido (FOB origem), independente do volume.
// Premissa-chave: H ajusta proporcionalmente ao preço efetivo
//   (H = 20% × preço efetivo).
//
// Faixa 1 — Q = 671 (preço 40, H = 8):
//   Custo aquisição: 15.000 × 40 = 600.000
//   Custo pedido: (15.000/671) × (120+800) = 22,4 × 920 = 20.567
//   Custo carregamento: (671/2) × 8 = 2.684
//   Total ≈ 623.251
//
// Faixa 2 — Q = 1.000 (preço 38,80, H = 7,76):
//   Custo aquisição: 15.000 × 38,80 = 582.000
//   Custo pedido: (15.000/1.000) × 920 = 15 × 920 = 13.800
//   Custo carregamento: (1.000/2) × 7,76 = 3.880
//   Total ≈ 599.680
//   Ganho vs Faixa 1 = 23.571 (economia anual)
//
// Faixa 3 — Q = 3.000 (preço 38,00, H = 7,60):
//   Custo aquisição: 15.000 × 38,00 = 570.000
//   Custo pedido: (15.000/3.000) × 920 = 5 × 920 = 4.600
//   Custo carregamento: (3.000/2) × 7,60 = 11.400
//   Total ≈ 586.000
//   Ganho vs Faixa 1 = 37.251 (economia anual)
//   Ganho vs Faixa 2 = 13.680
//
// PORÉM: Faixa 3 expõe a:
//   - Obsolescência (3.000 latas = 73 dias de consumo médio)
//   - Risco de mudança de tonalidade/lote
//   - Exigência de armazenagem (espaço, paletes, manuseio)
//
// Conclusão: Faixa 2 (Q = 1.000) é o sweet spot — captura 63% do ganho
// total com risco operacional aceitável.
// =============================================================================

export const S3_2: Scenario = {
  id: "s3_2",
  code: "S3.2",
  title: "EOQ com fretes e descontos — Tinta Tropical",
  company: "Tinta Tropical S.A.",
  difficulty: "Intermediário",
  estimatedMinutes: 22,
  context: {
    narrative:
      "Você é responsável pelas **compras estratégicas** da **Tinta Tropical**, fabricante regional de tintas decorativas. O SKU mais relevante — **lata 18 L de tinta branca acrílica** — tem **demanda anual de 15.000 latas**, custo de pedido **R$ 120** (processamento + recepção + inspeção) e custo de carregamento **R$ 8/lata/ano**. O fornecedor principal acaba de **revisar a política comercial** e ofereceu **tabela de desconto por volume**: 3% para pedidos de **1.000 a 2.999 latas** e **5%** para pedidos **acima de 3.000 latas**. O frete é **R$ 800 por pedido** (FOB origem), independente do volume — quanto maior o lote, mais o frete se dilui. Você precisa decidir o **lote ótimo de compra** comparando custo total anual em cada faixa, sabendo que o custo de carregamento é **proporcional ao preço efetivo** (H = 20% × preço unitário).",
    keyFacts: [
      ["Demanda anual (D)", "15.000 latas"],
      ["Custo de pedido (S)", "R$ 120 + R$ 800 frete = R$ 920"],
      ["Custo de carregamento (H)", "20% × preço efetivo"],
      ["Preço base (sem desconto)", "R$ 40,00/lata"],
      ["Desconto faixa 1.000-2.999", "3% → R$ 38,80"],
      ["Desconto faixa ≥ 3.000", "5% → R$ 38,00"],
      ["EOQ clássico (sem desconto)", "≈ 671 latas"],
      ["Capacidade de armazém", "Suficiente até ~4.000 latas"],
    ],
  },
  statements: [
    {
      id: "comparacao_lotes",
      title: "Custo total anual — comparação entre lotes",
      unit: "R$ / latas / pedidos·ano",
      periods: ["Faixa 1: Q=671", "Faixa 2: Q=1.000", "Faixa 3: Q=3.000"],
      sections: [
        {
          label: "Estrutura do lote",
          rows: [
            { label: "Tamanho do pedido (latas)", values: [671, 1000, 3000], emphasis: "bold" },
            { label: "Pedidos por ano (D/Q)", values: [22.4, 15.0, 5.0], indent: 1 },
            { label: "Preço unitário pós-desconto (R$)", values: [40.0, 38.8, 38.0], indent: 1 },
            { label: "Carregamento unitário H (R$/un/ano)", values: [8.0, 7.76, 7.60], indent: 1 },
          ],
        },
        {
          label: "Componentes do custo total anual",
          rows: [
            { label: "Aquisição (D × P)", values: [600000, 582000, 570000], indent: 1 },
            { label: "Custo de pedido (D/Q × S+frete)", values: [20567, 13800, 4600], indent: 1 },
            { label: "Custo de carregamento (Q/2 × H)", values: [2684, 3880, 11400], indent: 1 },
            { label: "Custo total anual (R$)", values: [623251, 599680, 586000], emphasis: "total" },
            { label: "Economia vs Faixa 1 (R$/ano)", values: [0, 23571, 37251], emphasis: "bold" },
          ],
        },
        {
          label: "Métricas operacionais e de risco",
          rows: [
            { label: "Estoque médio (Q/2, latas)", values: [336, 500, 1500], indent: 1 },
            { label: "Cobertura média (dias de demanda)", values: [8.1, 12.2, 36.5], indent: 1 },
            { label: "Risco de obsolescência (escala 0-3)", values: [0, 1, 2], indent: 1 },
            { label: "Ocupação de armazém (% capacidade pico)", values: [17, 25, 75], indent: 1 },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Calcular o EOQ clássico.** Com D = 15.000, S = R$ 120 (sem incluir frete ainda) e H = R$ 8, qual é o EOQ — e qual é a **interpretação correta** desse número?",
      choices: [
        {
          id: "e1_a",
          label:
            "EOQ = √(2·D·S/H) = √(2·15.000·120/8) = √450.000 ≈ **671 latas**. É o lote que **minimiza a soma de custos de pedido e de carregamento** quando não há desconto por volume nem frete relevante por pedido.",
          correct: true,
          score: 20,
          feedback:
            "Correto. EOQ é a fórmula **fundamental** — minimiza (D/Q)·S + (Q/2)·H derivando e igualando a zero. Resultado: **Q* = √(2DS/H)**. A chave da pergunta está na **interpretação**: EOQ pressupõe (1) demanda constante, (2) sem desconto por volume, (3) sem custo fixo de frete relevante. Quando essas premissas são violadas (caso da Tinta Tropical), o EOQ vira **referência inicial** — não a resposta final.",
        },
        {
          id: "e1_b",
          label:
            "EOQ = (D × S) / H = 15.000 × 120 / 8 = **225.000 latas**.",
          correct: false,
          score: 0,
          feedback:
            "Fórmula errada — você esqueceu a **raiz quadrada** (e o fator 2). 225.000 latas é **15 anos de consumo** em um único pedido — fisicamente absurdo. Sempre teste o resultado contra o senso: lote de mais de 1 ano de consumo é sinal de erro.",
        },
        {
          id: "e1_c",
          label:
            "EOQ = D/12 = **1.250 latas** (consumo médio mensal).",
          correct: false,
          score: 0,
          feedback:
            "Confunde EOQ com **consumo médio**. O EOQ não tem relação automática com o período de tempo — depende dos **custos** (S e H). Consumo mensal é referência operacional (frequência de revisão), não tamanho ótimo de pedido.",
        },
        {
          id: "e1_d",
          label:
            "EOQ não se calcula quando há desconto por volume — vai direto para o lote da faixa mais alta.",
          correct: false,
          score: 5,
          feedback:
            "Erro de processo. EOQ **é o ponto de partida** mesmo com descontos — você calcula o EOQ \"limpo\" para ter referência, depois **compara o custo total anual** em cada faixa de desconto. Ir direto para a faixa mais alta ignora que o **custo de carregamento pode comer o desconto** (caso típico em SKUs com obsolescência).",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Incorporar frete e descontos.** Qual é a **estrutura correta** para escolher o lote?",
      choices: [
        {
          id: "e2_a",
          label:
            "Calcular **custo total anual** = aquisição (D × preço efetivo) + pedido ((D/Q) × (S + frete)) + carregamento ((Q/2) × H), **em cada faixa**, e escolher o mínimo. Ajustar H para refletir o preço efetivo (H = 20% × P).",
          correct: true,
          score: 20,
          feedback:
            "Correto e metodologicamente rigoroso. **Três passos essenciais**: (1) frete entra como **custo fixo por pedido** (somado a S), reduzindo o custo unitário de pedido para lotes grandes; (2) preço efetivo **reduz aquisição**, capturando o desconto; (3) H **proporcional ao preço** porque o custo de carregamento financeiro é função do capital empatado por unidade. Calcula-se o **custo total** em cada faixa (671, 1.000, 3.000) e escolhe-se o menor. Resultado neste caso: Faixa 3 = R$ 586.000 (mínimo), seguida de Faixa 2 = R$ 599.680 e Faixa 1 = R$ 623.251.",
        },
        {
          id: "e2_b",
          label:
            "Comparar apenas o **valor do desconto** (3% e 5%) com o **aumento do estoque médio** — escolher o maior diferencial.",
          correct: false,
          score: 5,
          feedback:
            "Captura parte da intuição, mas **falta o frete** — peça-chave deste exercício. Sem incluir o frete no custo de pedido, você **subestima** o ganho de comprar em lotes maiores (frete dilui mais). O cálculo completo é **aquisição + pedido (com frete) + carregamento**; comparar só desconto vs carregamento omite ~R$ 6-15 mil/ano de variação.",
        },
        {
          id: "e2_c",
          label:
            "Adotar o **lote da maior faixa** (3.000) — o desconto de 5% sempre vence o aumento de carregamento.",
          correct: false,
          score: 5,
          feedback:
            "**Frequentemente vence, mas não sempre.** Neste exercício, Faixa 3 minimiza o custo financeiro **em planilha** (R$ 586 mil), mas a faixa 3 expõe a obsolescência (cobertura 36 dias), risco de mudança de tonalidade entre lotes e ocupa 75% do armazém — **fatores não-financeiros** que podem inverter a decisão. Sempre calcular **e** ponderar com restrições operacionais.",
        },
        {
          id: "e2_d",
          label:
            "Manter **Q = EOQ clássico (671)** — descontos por volume não devem alterar a teoria.",
          correct: false,
          score: 0,
          feedback:
            "Inverte o uso do EOQ. EOQ pressupõe **sem desconto**; quando o fornecedor oferece desconto, a teoria correta é **comparar EOQ com lotes nas faixas de desconto** e escolher o de menor custo total. Ignorar o desconto é **deixar R$ 23-37 mil/ano em cima da mesa**.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Decidir o lote.** Qual decisão é **defensável** considerando obsolescência e operação?",
      choices: [
        {
          id: "e3_a",
          label:
            "**Adotar Faixa 2 (Q = 1.000)** — captura **63% do ganho total** (R$ 23,6 mil/ano vs R$ 37,3 mil) com **cobertura razoável** (12 dias), armazém em 25% e risco de obsolescência baixo. Sweet spot operacional.",
          correct: true,
          score: 20,
          feedback:
            "Correto e refletido. A diferença entre Faixa 2 e Faixa 3 é **R$ 13,7 mil/ano** — material, mas pequeno em relação ao **risco de descarte** de centenas de latas se a tonalidade saiu ou houve trocas de fornecedor. Em tintas, obsolescência **não é teórica** — pigmentos sofrem ajuste de batch, e o cliente final percebe variação cromática entre paredes pintadas com lotes diferentes. R$ 13,7 mil/ano é prêmio razoável pelo risco evitado. Boa prática: **escolher Faixa 2 e usar Faixa 3 apenas em SKUs sem risco de obsolescência** (commodities estáveis).",
        },
        {
          id: "e3_b",
          label:
            "**Adotar Faixa 3 (Q = 3.000)** — o ganho de R$ 37 mil/ano é o mínimo absoluto da função custo; sempre que a planilha indica, deve-se seguir.",
          correct: false,
          score: 5,
          feedback:
            "Otimização **só com critério financeiro** ignora restrições reais. Cobertura de 36 dias em tinta acrílica é **operacionalmente arriscada** — se o consumo cair 20% no trimestre, sobram centenas de latas em risco de obsolescência. Decisão correta pondera **custo planilhado vs custo esperado de obsolescência** — em SKUs sensíveis, Faixa 2 é dominante mesmo perdendo R$ 13,7 mil/ano.",
        },
        {
          id: "e3_c",
          label:
            "**Manter Faixa 1 (Q = 671)** — é o EOQ clássico, então é o ótimo matemático.",
          correct: false,
          score: 0,
          feedback:
            "**EOQ clássico não é o ótimo** quando há desconto e frete fixo por pedido. Manter Q = 671 deixa **R$ 23,6 mil/ano** em cima da mesa sem ganho operacional relevante (armazém em 17% vs 25% é diferença marginal). EOQ é referência, não imperativo.",
        },
        {
          id: "e3_d",
          label:
            "**Dividir 50/50 entre Faixa 2 e Faixa 3** — alternar lotes captura parte do desconto sem concentrar risco.",
          correct: false,
          score: 5,
          feedback:
            "Lógica de **diversificação** que não se aplica aqui — a média ponderada do custo de lotes 1.000 e 3.000 está **acima** do custo de manter um único lote ótimo. Alternar tamanhos de pedido também **complica a operação** (logística variável, controle inconsistente). Em compras, **consistência operacional** ganha de mistura ad-hoc.",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Manter EOQ clássico (Q = 671)",
      shortLabel: "EOQ clássico",
      description:
        "Continuar com lote ≈ **671 latas/pedido** (22 pedidos/ano), preço cheio R$ 40, sem capturar desconto. Estoque médio 336 latas, cobertura 8 dias. Custo total anual **R$ 623.251**. Operação simples, sem renegociação.",
      resultPanel: {
        headline: "Custo R$ 623 mil/ano — deixa R$ 23 a R$ 37 mil em cima da mesa, sem ganho operacional",
        deltas: [
          { label: "Custo total anual", value: "R$ 623.251", tone: "neutral" },
          { label: "Δ vs Faixa 2 (Q=1.000)", value: "+R$ 23,6 mil/ano (mais caro)", tone: "negative" },
          { label: "Δ vs Faixa 3 (Q=3.000)", value: "+R$ 37,3 mil/ano (mais caro)", tone: "negative" },
          { label: "Estoque médio", value: "336 latas (8 dias)", tone: "positive" },
          { label: "Pedidos por ano", value: "22 (carga administrativa alta)", tone: "negative" },
          { label: "Risco de obsolescência", value: "Mínimo", tone: "positive" },
          { label: "Ocupação de armazém (pico)", value: "17%", tone: "positive" },
        ],
        commentary:
          "**Política conservadora dominante apenas quando o desconto não vale a pena** — caso de SKUs com **altíssima obsolescência** (tintas especiais com pigmentos voláteis, produtos sazonais com vida útil < 60 dias) ou **armazém saturado**. No SKU aqui analisado (tinta branca acrílica padrão, estável, com vida útil > 12 meses), manter EOQ clássico é **decisão subótima** — deixa R$ 23 mil/ano no fornecedor. Risco operacional principal: **alta carga administrativa** (22 pedidos/ano = quase 2 por mês), com custo escondido em horas de comprador + recepção + lançamento contábil.",
      },
      reflection: {
        prompt:
          "Em que situação **manter EOQ clássico vence** as faixas com desconto?",
        choices: [
          {
            id: "ra_a",
            label:
              "Quando o **custo de carregamento real** é maior que os 20% premissados (ex.: tintas especiais com obsolescência de 6 meses, ou armazém com custo alternativo alto). A R$ 8/lata pode subir a R$ 15-20/lata, invertendo o cálculo.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **H é a variável mais subestimada do EOQ** — em planilha entra 20% (custo financeiro), mas o **carregamento real** inclui obsolescência, perdas, espaço alternativo, seguro, manuseio adicional. Em SKUs sensíveis, H real pode ser **2-3× o premissado**, e aí o custo de carregamento da Faixa 2 ou 3 explode — fazendo Faixa 1 (lote pequeno) ser de fato o ótimo. Boa prática: **estimar H real** por categoria de SKU, não usar premissa única.",
          },
          {
            id: "ra_b",
            label:
              "Sempre — fórmula é fórmula e EOQ é o ótimo por construção.",
            correct: false,
            score: 0,
            feedback:
              "EOQ é ótimo **dentro das suas premissas** (sem desconto, sem frete fixo por pedido relevante). Quando essas premissas são violadas — caso quase universal na prática — o EOQ vira **referência**, não resposta. \"Sempre\" é o sinal de quem aprendeu fórmula sem entender a teoria.",
          },
          {
            id: "ra_c",
            label:
              "Quando o fornecedor oferece **desconto pequeno** (≤ 1%) — aí a economia raramente compensa o aumento de carregamento.",
            correct: false,
            score: 10,
            feedback:
              "Parcialmente correto — descontos pequenos frequentemente não compensam, mas **depende do tamanho do salto de Q exigido para acessar o desconto**. Se o salto é pequeno (de Q=671 para Q=750 com 1% de desconto), o ganho líquido pode existir. Sempre **calcular**, não generalizar.",
          },
          {
            id: "ra_d",
            label:
              "Quando há **alto custo de mudança operacional** — adotar lotes diferentes requer renegociar contrato.",
            correct: false,
            score: 5,
            feedback:
              "Custo de mudança é **transitório** (one-off na renegociação) e tipicamente baixo comparado ao ganho anual recorrente de R$ 23 mil. Argumento usado para **adiar**, não para **decidir não capturar** o desconto.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — Pular para Faixa 2 (Q = 1.000)",
      shortLabel: "Faixa 2",
      description:
        "Adotar lote de **1.000 latas/pedido** (15 pedidos/ano), preço efetivo R$ 38,80 (3% desc). Estoque médio 500 latas, cobertura 12 dias. Custo total anual **R$ 599.680**. Sweet spot — captura 63% do ganho máximo com risco operacional aceitável.",
      resultPanel: {
        headline: "Captura R$ 23,6 mil/ano com risco baixo: o sweet spot para SKUs típicos",
        deltas: [
          { label: "Custo total anual", value: "R$ 599.680", tone: "positive" },
          { label: "Economia vs Faixa 1", value: "R$ 23,6 mil/ano", tone: "positive" },
          { label: "Δ vs Faixa 3 (perda residual)", value: "R$ 13,7 mil/ano", tone: "neutral" },
          { label: "Estoque médio", value: "500 latas (12 dias)", tone: "positive" },
          { label: "Pedidos por ano", value: "15 (carga moderada)", tone: "positive" },
          { label: "Risco de obsolescência", value: "Baixo", tone: "positive" },
          { label: "Ocupação de armazém (pico)", value: "25%", tone: "positive" },
        ],
        commentary:
          "**Política dominante para SKUs típicos** com vida útil > 90 dias e demanda razoavelmente previsível. Captura **63% do ganho total disponível** (R$ 23,6 de R$ 37,3 mil/ano) sem entrar nas zonas de risco que a Faixa 3 exige tolerar. Vantagem adicional: **reduz pedidos de 22 para 15/ano** — alivia a carga administrativa do comprador e do recebimento, gerando ganho de produtividade não-mensurado em planilha (estimativa: 1-2 horas/mês liberadas). Risco residual: **deixar R$ 13,7 mil/ano em cima da mesa** vs Faixa 3 — aceitável dado o prêmio por risco evitado.",
      },
      reflection: {
        prompt:
          "Faixa 2 deixa R$ 13,7 mil em cima da mesa vs Faixa 3. Quando vale a pena **migrar para Faixa 3** e capturar o ganho extra?",
        choices: [
          {
            id: "rb_a",
            label:
              "Quando o SKU tem **demanda muito estável** (σ baixo) e **vida útil longa** (> 12 meses) — duas condições conjuntas que neutralizam o risco de obsolescência da cobertura de 36 dias.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **Estabilidade + vida útil** são as duas alavancas que tornam Faixa 3 dominante. Em SKUs commodity (parafusos, embalagens padronizadas, insumos químicos estáveis) com consumo histórico previsível e sem risco de mudança de fórmula, capturar os R$ 13,7 mil/ano adicionais **é racional**. Boa prática: **classificar SKUs por matriz risco × vida útil** antes de definir política — Faixa 3 vai para a célula \"baixo risco × longa vida\".",
          },
          {
            id: "rb_b",
            label:
              "Quando o **CFO exigir** captura máxima de economia anual — comitê de custos prevalece sobre risco operacional.",
            correct: false,
            score: 0,
            feedback:
              "Argumento de **autoridade**, não de razão. CFO maduro **escuta** o argumento de risco operacional — se o risco de descarte de R$ 30-50 mil em obsolescência cobre os R$ 13,7 mil/ano de ganho, a decisão financeira correta é Faixa 2. Boa prática: levar **ambos os números** (ganho e risco esperado) ao comitê, deixar o comitê decidir com informação completa.",
          },
          {
            id: "rb_c",
            label:
              "Quando o armazém está **vazio** — capacidade ociosa não custa nada.",
            correct: false,
            score: 5,
            feedback:
              "Espaço ocioso **tem custo de oportunidade** (poderia abrigar outro SKU, ou ser reduzido para diminuir aluguel). Mais grave: armazém vazio hoje não significa armazém vazio em 6 meses, quando o pico sazonal chegar. Decisão de lote deve considerar **capacidade marginal** e **flexibilidade**, não foto pontual.",
          },
          {
            id: "rb_d",
            label:
              "Sempre — R$ 13,7 mil/ano é dinheiro real, sem racionalização que justifique deixar.",
            correct: false,
            score: 5,
            feedback:
              "Pensamento que **ignora risco assimétrico**. R$ 13,7 mil/ano é ganho **certo**; obsolescência potencial em SKU sensível pode ser **R$ 30-100 mil em um único episódio**. Esperança matemática do trade-off depende da probabilidade — se P(obsolescência) > 15-20% ao ano, Faixa 2 é dominante. \"Sempre\" é o erro de quem só olha a média, não a cauda.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — Pular para Faixa 3 (Q = 3.000)",
      shortLabel: "Faixa 3",
      description:
        "Adotar lote de **3.000 latas/pedido** (5 pedidos/ano), preço efetivo R$ 38,00 (5% desc). Estoque médio 1.500 latas, cobertura 36 dias. Custo total anual **R$ 586.000** — mínimo absoluto da função custo. Captura ganho máximo mas expõe a obsolescência e ocupa 75% do armazém no pico.",
      resultPanel: {
        headline: "Captura R$ 37 mil/ano (ganho máximo) com cobertura de 36 dias — viável só em SKUs estáveis",
        deltas: [
          { label: "Custo total anual", value: "R$ 586.000", tone: "positive" },
          { label: "Economia vs Faixa 1", value: "R$ 37,3 mil/ano", tone: "positive" },
          { label: "Economia vs Faixa 2", value: "R$ 13,7 mil/ano", tone: "positive" },
          { label: "Estoque médio", value: "1.500 latas (36 dias)", tone: "negative" },
          { label: "Pedidos por ano", value: "5 (carga mínima)", tone: "positive" },
          { label: "Risco de obsolescência", value: "Alto se SKU sensível", tone: "negative" },
          { label: "Ocupação de armazém (pico)", value: "75% — pouca folga", tone: "negative" },
        ],
        commentary:
          "**O ótimo planilhado, com a maior cauda de risco.** Captura **R$ 37,3 mil/ano** — número defensável em comitê — mas concentra a operação em **5 pedidos/ano** com pico de 3.000 latas armazenadas. Em SKU certo (commodity estável, sem risco de batch, com demanda previsível), é dominante. Em SKU errado (tinta especial, fórmula em evolução, demanda volátil), uma única obsolescência de 1.000 latas (R$ 38 mil) **anula 1 ano de ganho**. Risco operacional adicional: **5 pedidos/ano** significa que **um único atraso de fornecedor** gera ruptura — o que demanda backup de fornecedor ou ES adicional (que reduz a economia líquida). Política recomendada apenas após **análise de obsolescência histórica** e **capacidade de armazém com folga**.",
      },
      reflection: {
        prompt:
          "Qual evento, **uma única vez no ano**, anula o ganho de R$ 37 mil da Faixa 3?",
        choices: [
          {
            id: "rc_a",
            label:
              "**Descarte de ~1.000 latas** por obsolescência (mudança de tonalidade, vencimento de validade, reposicionamento de portfólio): 1.000 × R$ 38 = **R$ 38 mil** — neutraliza o ganho do ano. Em SKUs sensíveis, esse evento tem **probabilidade não desprezível**.",
            correct: true,
            score: 25,
            feedback:
              "Correto e dimensionado. **Probabilidade × impacto** é a métrica certa para avaliar lotes grandes em SKUs sensíveis. Se P(evento de descarte de 1.000+ latas) ≥ 15-25% ao ano, **valor esperado da perda excede o ganho**, e Faixa 2 vira dominante. Boa prática: usar **histórico de obsolescência** (não estimativa otimista) para calcular essa probabilidade — empresas frequentemente subestimam o quanto descartam.",
          },
          {
            id: "rc_b",
            label:
              "Um **atraso de 30 dias** de um único pedido — geraria ruptura porque o estoque de segurança é apenas 12 dias.",
            correct: false,
            score: 10,
            feedback:
              "Bom argumento, mas o **custo direto** de uma ruptura de 30 dias (perda de margem em vendas não realizadas) varia muito e pode ser menor ou maior que R$ 37 mil — não é métrica direta. Obsolescência **é** R$ 37 mil em um único evento, mais fácil de calcular.",
          },
          {
            id: "rc_c",
            label:
              "**Variação cambial de 10%** se o fornecedor importa pigmento — neutraliza desconto comercial.",
            correct: false,
            score: 5,
            feedback:
              "Possível, mas **afeta as três faixas igualmente** — todas elas comprariam ao mesmo preço pós-cambial, então a comparação relativa entre faixas permanece (Faixa 3 ainda é a mais barata). Não é o risco diferenciado.",
          },
          {
            id: "rc_d",
            label:
              "Nenhum — o ganho de R$ 37 mil é certo, e cauda de risco é argumento teórico.",
            correct: false,
            score: 0,
            feedback:
              "Negação de risco. Empresas que carregam **muitas semanas de estoque** descobrem rotineiramente lotes obsoletos em inventário anual — não é hipótese teórica, é estatística operacional comum. Tratar como certo um ganho que depende de **não ocorrer** evento de cauda é viés clássico.",
          },
        ],
      },
    },
  ],
};
