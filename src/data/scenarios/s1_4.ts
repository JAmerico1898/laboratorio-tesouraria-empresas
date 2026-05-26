// S1.4 — Construtora Delta: efeito tesoura clássico em 5 anos
// Anchors numéricos (todos derivados da tabela histórica abaixo):
//   Receita (R$ M): 200, 240, 290, 340, 400 → CAGR 4 períodos ≈ 18,9% (dobrou em 5 anos)
//   EBITDA (R$ M): 70, 80, 90, 95, 95 → margem caiu de 35% para 23,8%
//   NCG (R$ M): 80, 120, 170, 240, 340 → CAGR ≈ 43,5% (efeito tesoura agudo)
//   CCL (R$ M): 130, 140, 155, 170, 180 → CAGR ≈ 8,5%
//   ST = CCL − NCG: +50, +20, −15, −70, −160 (R$ M)
//   Dívida CP (R$ M): 40, 60, 105, 175, 280
//   Dívida LP (R$ M): 120, 130, 135, 145, 160
//   Dívida Total: 160, 190, 240, 320, 440
//   Dívida CP / Total: 25%, 32%, 44%, 55%, 64%  (alinhado com spec "25→60%")
//   Caixa: 30, 30, 25, 20, 20
//   Dívida Líquida: 130, 160, 215, 300, 420
//   Dívida Líquida / EBITDA: 1,86×; 2,00×; 2,39×; 3,16×; 4,42×  (sobe de 1,8× para 4,4×)
//
// Branches:
//  A) Reestruturação de dívida: Dívida CP 280→160, LP 160→280. ST +120 (de −160 → −40).
//     DL/EBITDA inalterado em 4,4× → covenant continua estourado.
//  B) Venda banco de terrenos R$ 80 M: amortiza Dívida CP 280→200; DL 420→340.
//     DL/EBITDA = 340/95 = 3,58×. ST +80 (de −160 → −80).
//  C) Follow-on equity R$ 100 M: PL +100, R$ 80 amortiza Dívida CP, R$ 20 colchão.
//     DL 420→320; DL/EBITDA = 320/95 = 3,37×. ST +100 (de −160 → −60). Diluição ~22%.

import type { Scenario } from "@/types/scenario";

export const S1_4: Scenario = {
  id: "s1_4",
  code: "S1.4",
  title: "Construtora Delta — efeito tesoura em 5 anos",
  company: "Construtora Delta S.A.",
  difficulty: "Avançado",
  estimatedMinutes: 25,
  context: {
    narrative:
      "A **Construtora Delta** é uma incorporadora de médio porte (médio e alto padrão urbano) com **ciclo financeiro de ~240 dias** (terreno + obra + recebimento parcelado pós-chaves). Nos últimos 5 anos a empresa **dobrou de tamanho** (Receita: R$ 200 M → R$ 400 M), mas a margem EBITDA **deteriorou de 35% para ~24%** por pressão de custos de insumos e prazos comerciais mais longos. O tesoureiro acendeu o alerta: o **ST caiu de +R$ 50 M para −R$ 160 M** em 5 anos, a **Dívida de Curto Prazo cresceu de R$ 40 M para R$ 280 M**, e o covenant de **Dívida Líquida / EBITDA ≤ 4,0×** está estourado (atual: **4,42×**). Você é o CFO recém-contratado e precisa diagnosticar a causa, avaliar a gravidade e propor uma intervenção estrutural.",
    keyFacts: [
      ["Receita Ano 5", "R$ 400 M"],
      ["Crescimento 5 anos", "Dobrou (CAGR ≈ 18,9% em 4 períodos)"],
      ["CAGR", "Taxa composta anual: (Vf/Vi)^(1/n) − 1, com n = nº de períodos"],
      ["Ciclo financeiro", "~240 dias"],
      ["ST Ano 5", "−R$ 160 M"],
      ["Dívida CP Ano 5", "R$ 280 M (64% da dívida total)"],
      ["Dívida Líquida / EBITDA", "4,42× (covenant: ≤ 4,0×)"],
      ["Banco de terrenos não estratégico", "R$ 80 M acionáveis"],
      ["Prazo médio da dívida", "18 meses"],
      ["EBITDA Ano 5 (margem 23,8%)", "R$ 95 M"],
      ["Caixa Ano 5", "R$ 20 M"],
    ],
  },
  statements: [
    {
      id: "historico_5a",
      title: "Histórico consolidado — 5 anos (Fleuriet + estrutura de dívida)",
      unit: "R$ milhões",
      periods: ["Ano 1", "Ano 2", "Ano 3", "Ano 4", "Ano 5"],
      sections: [
        {
          label: "DRE — visão resumida",
          rows: [
            { label: "Receita líquida", values: [200, 240, 290, 340, 400], emphasis: "bold" },
            { label: "Crescimento (%)", values: [null, 0.2, 0.208, 0.172, 0.176] },
            { label: "EBITDA", values: [70, 80, 90, 95, 95] },
            { label: "Margem EBITDA (%)", values: [0.35, 0.333, 0.31, 0.279, 0.238] },
            { label: "Resultado financeiro líquido", values: [-12, -16, -22, -32, -50] },
            { label: "Lucro líquido", values: [40, 42, 45, 42, 30] },
          ],
        },
        {
          label: "Modelo Fleuriet — CCL, NCG e ST",
          rows: [
            { label: "NCG", values: [80, 120, 170, 240, 340], emphasis: "bold" },
            { label: "NCG / Receita (%)", values: [0.40, 0.50, 0.586, 0.706, 0.85] },
            { label: "CCL", values: [130, 140, 155, 170, 180] },
            { label: "ST = CCL − NCG", values: [50, 20, -15, -70, -160], emphasis: "total" },
          ],
        },
        {
          label: "Estrutura de dívida e alavancagem (covenant DL/EBITDA ≤ 4,0×)",
          rows: [
            { label: "Dívida CP", values: [40, 60, 105, 175, 280] },
            { label: "Dívida LP", values: [120, 130, 135, 145, 160] },
            { label: "Dívida total", values: [160, 190, 240, 320, 440], emphasis: "subtotal" },
            { label: "Dívida CP / Dívida total (%)", values: [0.25, 0.316, 0.438, 0.547, 0.636] },
            { label: "(−) Caixa e equivalentes", values: [-30, -30, -25, -20, -20] },
            { label: "Dívida líquida", values: [130, 160, 215, 300, 420], emphasis: "subtotal" },
            { label: "Dívida líquida / EBITDA (×) — limite 4,0×", values: [1.86, 2.00, 2.39, 3.16, 4.42], emphasis: "total" },
          ],
        },
      ],
    },
    {
      id: "bp_ano5",
      title: "Balanço Patrimonial — Ano 5 (foto atual)",
      unit: "R$ milhões",
      periods: ["Ano 5"],
      sections: [
        {
          label: "Ativo",
          rows: [
            { label: "Caixa e aplicações", values: [20] },
            { label: "Contas a receber (clientes + SFH)", values: [180] },
            { label: "Estoques (obras em andamento)", values: [220] },
            { label: "Outros AC", values: [30] },
            { label: "Ativo Circulante", values: [450], emphasis: "subtotal" },
            { label: "Banco de terrenos (estratégico)", values: [180] },
            { label: "Banco de terrenos (não estratégico, vendável)", values: [80] },
            { label: "Imobilizado e outros ANC", values: [40] },
            { label: "Ativo Não Circulante", values: [300], emphasis: "subtotal" },
            { label: "Ativo Total", values: [750], emphasis: "total" },
          ],
        },
        {
          label: "Passivo + PL",
          rows: [
            { label: "Fornecedores e empreiteiros", values: [60] },
            { label: "Adiantamentos de clientes", values: [30] },
            { label: "Dívida CP (bancária + debêntures)", values: [280] },
            { label: "Passivo Circulante", values: [370], emphasis: "subtotal" },
            { label: "Dívida LP", values: [160] },
            { label: "Outros PNC", values: [20] },
            { label: "Passivo Não Circulante", values: [180], emphasis: "subtotal" },
            { label: "Patrimônio Líquido", values: [200] },
            { label: "Passivo + PL", values: [750], emphasis: "total" },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Análise histórica e CAGRs.** Qual é a leitura **estruturalmente correta** desses CAGRs?",
      choices: [
        {
          id: "etapa_1_a",
          label:
            "Receita CAGR ≈ 19% a.a., NCG CAGR ≈ 44% a.a., CCL CAGR ≈ 9% a.a. — efeito tesoura clássico: a NCG cresce dramaticamente mais rápido que a capacidade de financiamento estrutural (CCL), abrindo o gap (ST cai).",
          correct: true,
          score: 20,
          feedback:
            "**Correto.** CAGRs precisos sobre 4 períodos: Receita = (400/200)^(1/4) − 1 = **18,9% a.a.**; NCG = (340/80)^(1/4) − 1 = **43,5% a.a.**; CCL = (180/130)^(1/4) − 1 = **8,5% a.a.**. O **diagnóstico Fleuriet**: NCG cresce muito mais rápido que CCL, então **ST = CCL − NCG cai sistematicamente** (+50 → −160). A NCG/Receita também subiu de 40% para 85% — a empresa consome cada vez mais caixa por real de receita, indicador de **deterioração operacional** (prazos alongando, estoques inflando, ou ambos).",
        },
        {
          id: "etapa_1_b",
          label:
            "O crescimento de NCG é proporcional ao crescimento de receita — é normal e esperado em qualquer empresa que dobra de tamanho.",
          correct: false,
          score: 0,
          feedback:
            "**Erro de leitura.** Se NCG fosse proporcional à receita, NCG/Receita ficaria **constante**. Aqui ela **dobrou** (40% → 85%) — a NCG cresceu **muito mais** que proporcionalmente. Isso revela **deterioração de ciclo financeiro**: prazos médios de recebimento (PMRV) e/ou estoque (PMRE) se alongaram além do necessário. Tratar como 'normal' é o erro que faz tesoureiros não ligarem o alerta a tempo.",
        },
        {
          id: "etapa_1_c",
          label:
            "O problema é a queda de margem EBITDA (35% → 24%); NCG e CCL são consequência da margem.",
          correct: false,
          score: 5,
          feedback:
            "Você identificou um problema real (deterioração de margem), mas confundiu causa e efeito. Margem afeta o **lucro retido** (alimenta CCL via PL), mas **NCG depende de prazos operacionais**, não de margem. Empresas com margem baixa e ciclo curto (varejo de alta rotação) podem ter NCG até negativa. Aqui, **o ciclo financeiro de 240 dias é o problema estrutural** — margem é um agravante secundário.",
        },
        {
          id: "etapa_1_d",
          label:
            "O CCL aumentou em valor absoluto (130 → 180), então o CCL está saudável e o problema é só a dívida CP.",
          correct: false,
          score: 0,
          feedback:
            "Erro clássico de **olhar valor absoluto ignorando o contexto de crescimento**. CCL cresceu 8,5% a.a. enquanto a empresa cresceu ~19% a.a. e a NCG cresceu ~44% a.a. **Em termos relativos, o CCL encolheu**: CCL/Receita caiu de 65% (130/200) para 45% (180/400). Olhar 'aumento em R$' sem comparar com a expansão do negócio é o que mascara a tesoura.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Decompor as causas do alongamento da NCG.** Considerando o setor (incorporadora, ciclo 240 dias), qual é o **driver provavelmente dominante**?",
      choices: [
        {
          id: "etapa_2_a",
          label:
            "Alongamento do PMRV (prazos comerciais mais longos pós-chaves) combinado com inflação do estoque de obras em andamento — ambos típicos em cenário de demanda fraca e custos de insumos em alta.",
          correct: true,
          score: 20,
          feedback:
            "**Correto.** Em incorporadoras, a NCG é dominada por: (i) **estoque de obras em andamento** (custo acumulado de obras não entregues — sensível a inflação de insumos como aço, cimento, mão de obra) e (ii) **contas a receber pós-chaves** (carteira de financiamento direto + repasse ao SFH). Quando a demanda fraqueja, os incorporadores **alongam prazos comerciais** (financiamento próprio mais longo, entrada menor) para sustentar vendas, e os estoques de obras paradas ou em ritmo lento incham. A combinação leva NCG/Receita aos 80%+ — **exatamente o sintoma observado**.",
        },
        {
          id: "etapa_2_b",
          label:
            "Encurtamento do PMPF (fornecedores apertando prazos) é o driver dominante.",
          correct: false,
          score: 5,
          feedback:
            "PMPF mais curto **aumenta** NCG (PCO menor), e é um vetor real em momentos de estresse setorial (fornecedores desconfiam e exigem pagamento à vista). Mas em incorporadoras, o **lado do ativo (estoques + recebíveis)** é estruturalmente muito maior que o de fornecedores. PMPF é agravante, não driver dominante.",
        },
        {
          id: "etapa_2_c",
          label:
            "Aumento da margem por melhoria de mix de produto — empresa subiu para alto padrão.",
          correct: false,
          score: 0,
          feedback:
            "Margem subindo seria um efeito **positivo**, e os dados mostram margem EBITDA **caindo** (35% → 24%). Além disso, mix de produto afeta margem, não diretamente a NCG. A causa do balão de NCG está nos **prazos e estoques**, não no mix.",
        },
        {
          id: "etapa_2_d",
          label:
            "Crescimento da receita de aluguel recorrente, que tem PMRV maior que vendas à vista.",
          correct: false,
          score: 0,
          feedback:
            "Aluguel recorrente é receita de **patrimoniais** (build-to-suit, shoppings), modelo distinto de incorporação. Delta é uma **incorporadora** (constrói e vende), não uma patrimonial. O driver da NCG aqui é o **ciclo de obra + recebíveis pós-chaves**.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Avaliar gravidade incluindo covenants.** Em que estado a empresa **realmente** está?",
      choices: [
        {
          id: "etapa_3_a",
          label:
            "Frágil mas administrável — covenant ainda permite negociação de waiver com os bancos antes da próxima medição.",
          correct: false,
          score: 10,
          feedback:
            "Parcialmente correto, mas **subestima o risco**. Waiver é possível, **mas** o concentrado de Dívida CP (R$ 280 M, 64% da dívida total) significa que mesmo SEM quebra de covenant, a empresa precisa **rolar R$ 280 M nos próximos 12 meses**. Em ambiente de estresse setorial e covenant já estourado, bancos endurecem condições, pedem garantias adicionais e podem se recusar a rolar. **Não é só uma negociação técnica, é risco de liquidez agudo.**",
        },
        {
          id: "etapa_3_b",
          label:
            "Pré-default técnico: covenant já estourado (4,42× > 4,0×), R$ 280 M de Dívida CP a rolar em 12 meses sob condição desfavorável, ST profundamente negativo e caixa de R$ 20 M — a empresa tem risco de liquidez iminente se um banco recusar rolagem.",
          correct: true,
          score: 20,
          feedback:
            "**Correto e essa é a leitura honesta.** Três indicadores convergem para risco agudo: (i) **covenant estourado** → vencimento antecipado é direito do credor; (ii) **64% da dívida em CP** → R$ 280 M para rolar em 12 meses, com bancos cientes do covenant breach; (iii) **caixa de R$ 20 M cobre só ~7% da Dívida CP** → qualquer interrupção de rolagem trava a operação. A combinação **ST negativo + dívida CP alta + covenant quebrado** é exatamente o padrão de empresas que entram em recuperação judicial. **A intervenção precisa ser estrutural, não tática.**",
        },
        {
          id: "etapa_3_c",
          label:
            "Saudável — a empresa tem PL de R$ 200 M e ativos de R$ 750 M, então a alavancagem em si não é problema.",
          correct: false,
          score: 0,
          feedback:
            "**Erro de confundir solvência com liquidez.** Ativo > Passivo (R$ 750 M vs R$ 550 M) garante **solvência contábil**, mas o problema da Delta é **liquidez de curto prazo**: PC de R$ 370 M vs AC de R$ 450 M, dos quais R$ 220 M são estoques de obras (não convertíveis em caixa em 30 dias). Empresas quebram por **iliquidez, não por insolvência** — Lehman Brothers tinha PL positivo no dia da falência.",
        },
        {
          id: "etapa_3_d",
          label:
            "Crítico, mas o problema é puramente operacional (margem EBITDA caindo). Reestruturação financeira é prematura.",
          correct: false,
          score: 5,
          feedback:
            "Margem caindo é um sintoma, mas **o problema imediato é financeiro**: covenant estourado e R$ 280 M a rolar. Reestruturação operacional (corte de custos, foco em produto rentável) leva 2-4 trimestres para impactar EBITDA. A empresa **não tem 2-4 trimestres** — tem semanas até a próxima medição de covenant. **A reestruturação financeira é urgente; a operacional é estrutural. Ambas precisam acontecer em paralelo.**",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Reestruturação de dívida — alongamento de 18 para 36 meses",
      shortLabel: "Reestruturação de dívida",
      description:
        "Renegociar o portfólio com os 4 bancos credores, **alongando o prazo médio de 18 para 36 meses**. Resultado: R$ 120 M migram de Dívida CP para Dívida LP. Custo: spread sobe ~150 bps (CDI + 4% → CDI + 5,5%), garantias adicionais (banco de terrenos estratégico hipotecado), covenants mais apertados. **Não traz caixa novo** — apenas reperfila o existente.",
      resultPanel: {
        headline:
          "ST sobe ~R$ 120 M (de −160 para ~−40), mas DL/EBITDA fica inalterado em 4,4× — covenant continua estourado.",
        deltas: [
          { label: "Dívida CP", value: "R$ 280 M → R$ 160 M (−R$ 120 M)", tone: "positive" },
          { label: "Dívida LP", value: "R$ 160 M → R$ 280 M (+R$ 120 M)", tone: "negative" },
          { label: "CCL", value: "+R$ 120 M (LP financiando parte do AC)", tone: "positive" },
          { label: "ST", value: "−R$ 160 M → ≈ −R$ 40 M (+R$ 120 M)", tone: "positive" },
          { label: "Dívida líquida total", value: "Inalterada (R$ 420 M)", tone: "neutral" },
          { label: "DL / EBITDA", value: "4,42× → 4,42× (covenant permanece estourado)", tone: "negative" },
          { label: "Custo financeiro anual", value: "+R$ 7 M (~150 bps sobre R$ 440 M)", tone: "negative" },
        ],
        commentary:
          "Reestruturação resolve **o problema imediato de liquidez** (rolagem de R$ 120 M sai do calendário dos próximos 12 meses), mas **não cura a alavancagem**. DL/EBITDA continua 4,42×, covenant continua estourado. A renegociação **precisa incluir flexibilização ou waiver do covenant** — caso contrário a empresa estará tecnicamente em default no dia seguinte. Solução **necessária mas insuficiente** — geralmente vem combinada com Branch B ou C.",
      },
      reflection: {
        prompt:
          "Qual é a limitação fundamental da reestruturação de dívida sem nenhuma ação complementar?",
        choices: [
          {
            id: "branch_a_r_a",
            label:
              "Não reduz a alavancagem efetiva (DL/EBITDA continua 4,4×) — apenas redistribui o mesmo passivo no tempo. O covenant continua estourado e o EBITDA insuficiente, então o problema estrutural persiste e voltará a se manifestar em 18-24 meses.",
            correct: true,
            score: 25,
            feedback:
              "**Correto.** Reestruturação resolve **timing**, não **magnitude**. Sem geração de caixa nova (venda de ativos ou aporte) ou recuperação de EBITDA, a empresa volta ao mesmo aperto em poucos trimestres — agora com **dívida mais cara** (spread aumentou) e **covenants mais apertados** (bancos exigiram mais). É a 'estratégia de empurrar com a barriga' — válida como **componente** de um plano integrado, mas perigosa como ação isolada.",
          },
          {
            id: "branch_a_r_b",
            label: "O custo financeiro fica maior porque o spread sobe 150 bps.",
            correct: false,
            score: 5,
            feedback:
              "É um efeito real (+R$ 7 M/ano de despesa financeira), mas é **consequência**, não a limitação fundamental. O problema central é a **alavancagem inalterada** — mesmo com spread original, o covenant continuaria estourado.",
          },
          {
            id: "branch_a_r_c",
            label: "Os bancos podem se recusar a renegociar com covenant estourado.",
            correct: false,
            score: 10,
            feedback:
              "Risco real, mas geralmente bancos preferem reestruturar a forçar default (recuperam mais). O problema **fundamental** após a reestruturação é que a alavancagem permanece — o ganho de tempo precisa ser usado para outra ação (venda de ativos ou aporte).",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Venda de banco de terrenos não estratégico — R$ 80 M",
      shortLabel: "Venda de ativos",
      description:
        "Vender o **banco de terrenos não estratégico** (R$ 80 M de valor contábil, assume-se venda a valor contábil pela urgência). O caixa entra e amortiza Dívida CP. **Custo**: perda de pipeline futuro (~R$ 200 M de VGV potencial em 3-4 anos), comprimindo crescimento e EBITDA futuros.",
      resultPanel: {
        headline:
          "DL/EBITDA cai para 3,58× (volta ao espaço do covenant), ST melhora ~R$ 80 M, mas sacrifica crescimento futuro.",
        deltas: [
          { label: "Caixa transitório", value: "+R$ 80 M, usado para amortizar Dívida CP", tone: "positive" },
          { label: "Dívida CP", value: "R$ 280 M → R$ 200 M (−R$ 80 M)", tone: "positive" },
          { label: "Dívida total", value: "R$ 440 M → R$ 360 M", tone: "positive" },
          { label: "Dívida líquida", value: "R$ 420 M → R$ 340 M", tone: "positive" },
          { label: "DL / EBITDA", value: "4,42× → 3,58× (volta ao espaço do covenant)", tone: "positive" },
          { label: "ST", value: "−R$ 160 M → ≈ −R$ 80 M (+R$ 80 M)", tone: "positive" },
          { label: "Banco de terrenos não estratégico", value: "R$ 80 M → R$ 0", tone: "negative" },
          { label: "Pipeline de VGV futuro", value: "−R$ 200 M (3-4 anos)", tone: "negative" },
        ],
        commentary:
          "Venda de ativo é a opção **operacionalmente mais limpa**: traz caixa de fonte interna, reduz alavancagem absoluta, devolve a empresa ao covenant. Não dilui acionistas, não aumenta serviço de dívida. **Trade-off**: o pipeline futuro encolhe — se o banco de terrenos era 'gordura', ótimo; se era estratégico mal-classificado, a empresa terá problema de crescimento em 2-3 anos. Em geral, **a melhor opção isolada quando há ativos não estratégicos vendáveis** — combina diagnóstico Fleuriet com disciplina de portfólio.",
      },
      reflection: {
        prompt:
          "Quando a Venda de Ativos é claramente superior ao Aporte de Equity (Branch C) como ação isolada?",
        choices: [
          {
            id: "branch_b_r_a",
            label:
              "Quando os ativos são realmente não estratégicos (não geram VGV/EBITDA relevante no plano de 3-5 anos), o valor de mercado é próximo do contábil (sem precisar vender a fire sale), e os fundadores valorizam controle (evitando diluição).",
            correct: true,
            score: 25,
            feedback:
              "**Correto.** Os três pré-requisitos são necessários: (i) **estratégico**: vender ativo gerador de caixa futuro é trocar curto por longo a custo alto; (ii) **liquidez de mercado**: em downturn imobiliário, terrenos podem ser ilíquidos e fire sales destroem valor; (iii) **preferência**: equity é mais 'estrutural' mas dilui. Quando os três se alinham, venda de ativos é **superior pelo critério de custo de capital** (não há custo de equity novo, não há aumento de serviço de dívida).",
          },
          {
            id: "branch_b_r_b",
            label: "Sempre que os ativos têm valor de mercado positivo, vender é melhor que diluir.",
            correct: false,
            score: 5,
            feedback:
              "Generalização perigosa. Se o ativo é **estratégico** (gera VGV/EBITDA recorrente), vendê-lo apenas para evitar diluição **destrói valor de longo prazo**. A regra é: vender ativos cuja contribuição para EBITDA futuro é menor que o custo de capital, manter os demais.",
          },
          {
            id: "branch_b_r_c",
            label: "Quando o mercado de capitais está fechado e não há equity disponível.",
            correct: false,
            score: 10,
            feedback:
              "Em mercado fechado, a venda de ativos vira **necessidade** (não há alternativa), não 'superioridade'. A pergunta é quando a venda é **objetivamente melhor**, não quando é a única opção. Resposta correta requer pré-requisitos sobre o ativo e o trade-off de controle.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Follow-on equity de R$ 100 milhões",
      shortLabel: "Equity (follow-on)",
      description:
        "Realizar **follow-on (oferta secundária)** de R$ 100 M no mercado de capitais. R$ 80 M amortizam Dívida CP, R$ 20 M reforçam o caixa. **Diluição estimada: ~22%** dos acionistas atuais (valuation atual deprimido pelo estresse financeiro). Sem ajuste de covenant, sem aumento de serviço de dívida.",
      resultPanel: {
        headline:
          "DL/EBITDA cai para 3,37× (folga sobre o covenant) e a empresa fica capitalizada — ao custo de ~22% de diluição.",
        deltas: [
          { label: "Caixa", value: "+R$ 20 M de colchão (R$ 80 M para amortizar Dívida CP)", tone: "positive" },
          { label: "Patrimônio Líquido", value: "R$ 200 M → R$ 300 M", tone: "positive" },
          { label: "Dívida CP", value: "R$ 280 M → R$ 200 M (−R$ 80 M)", tone: "positive" },
          { label: "Dívida líquida", value: "R$ 420 M → R$ 320 M", tone: "positive" },
          { label: "DL / EBITDA", value: "4,42× → 3,37× (folga sobre covenant)", tone: "positive" },
          { label: "CCL", value: "+R$ 100 M (PL financiando AC)", tone: "positive" },
          { label: "ST", value: "−R$ 160 M → ≈ −R$ 60 M", tone: "positive" },
          { label: "Diluição dos acionistas atuais", value: "≈ −22%", tone: "negative" },
        ],
        commentary:
          "Follow-on é a opção **financeiramente mais robusta**: traz caixa novo, não pressiona o EBITDA futuro com serviço adicional de dívida, reduz alavancagem e cria colchão. **Custo principal**: diluição (~22%) a valuation deprimido — é o pior momento de captar equity, mas pode ser o único momento em que captar é **necessário**. Em recuperações de empresas alavancadas, follow-ons em momento de estresse são **comuns e estrategicamente corretos** quando alternativas (alongar dívida, vender ativos) são insuficientes ou indisponíveis.",
      },
      reflection: {
        prompt:
          "Qual é a crítica mais sofisticada ao follow-on neste momento — não a crítica óbvia de 'dilui muito'?",
        choices: [
          {
            id: "branch_c_r_a",
            label: "A diluição de 22% é grande e os fundadores perdem influência.",
            correct: false,
            score: 5,
            feedback:
              "Crítica óbvia e parcial. A pergunta pede a crítica **sofisticada** — relacionada a timing, sequência das ações e transferência de valor entre acionistas.",
          },
          {
            id: "branch_c_r_b",
            label:
              "Captar equity a valuation deprimido transfere valor permanentemente dos acionistas existentes para os novos. Se a empresa tivesse resolvido a crise primeiro com reestruturação + venda de ativos (Branches A+B), o valuation seria mais alto e a captação posterior (se ainda necessária) diluiria menos. A sequência das ações importa: captar equity deve ser a última carta, não a primeira.",
            correct: true,
            score: 25,
            feedback:
              "**Correto — essa é a leitura sofisticada.** Em finanças corporativas, a **pecking order theory (Myers, 1984)** diz: empresas captam primeiro com dívida (barata e não-diluente), depois com híbridos, **por último com equity** — porque equity em momento ruim sinaliza estresse e transfere valor permanentemente. A sequência típica de reestruturação é: (1) cortar custos e WCM, (2) alongar dívida, (3) vender ativos não estratégicos, (4) captar equity se ainda necessário. Pular direto para (4) sem (1–3) pode resolver a crise **e custar valor permanentemente**.",
          },
          {
            id: "branch_c_r_c",
            label: "O follow-on não é sustentável: o problema operacional volta em 2-3 anos.",
            correct: false,
            score: 10,
            feedback:
              "Crítica válida (problemas operacionais não somem com capital novo), mas igualmente aplicável aos outros branches. A crítica **sofisticada e específica ao equity** é sobre **timing e sequência** — captar equity caro (= valuation baixo) transfere mais valor que captar barato (= valuation alto).",
          },
        ],
      },
    },
  ],
};
