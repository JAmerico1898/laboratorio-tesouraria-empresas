import type { Scenario } from "@/types/scenario";

// =============================================================================
// S4.2 — Mudança da política de prazo de 30 para 60 dias
// =============================================================================
// Premissas:
//
// Empresa: Atacadista Theta (materiais de construção).
// Receita anual atual: R$ 80 M com PMRV 30 dias.
// Margem bruta: 28%. Inadimplência atual: 2,2%.
// Custo de capital: WACC = 14% a.a. (premissa realista) ou capital próprio
//   = 18% a.a. (premissa conservadora).
// Custo administrativo carteira: 0,4% do faturado.
//
// Cenário-base de impacto ao estender de 30 para 60 dias (toda carteira):
//   Receita: +12% = R$ 9,6 M de novo volume (R$ 89,6 M total)
//   Inadimplência esperada: +1,0 ponto percentual (de 2,2% para 3,2%)
//     (premissa: novos clientes captados com prazo são marginalmente
//      mais arriscados, e prazo maior aumenta tempo de exposição)
//   PMRV passa de 30 para 60 dias → NCG adicional:
//     = (89,6 M / 360) × 30 = R$ 7,47 M de capital adicional
//   Custo financeiro do prazo adicional:
//     A WACC 14%: 7,47 × 14% = R$ 1.046 mil/ano
//     A custo próprio 18%: 7,47 × 18% = R$ 1.345 mil/ano
//
// Análise marginal (cenário A — adoção plena, com WACC 14%):
//   Margem adicional: 28% × 9,6 M = R$ 2.688 mil
//   Inadimplência adicional:
//     Sobre toda carteira × novo nível: 89,6 × 3,2% = R$ 2.867
//     Vs anterior: 80 × 2,2% = R$ 1.760
//     Δ = R$ 1.107 mil/ano
//   Custo financeiro NCG adicional: R$ 1.046 mil/ano
//   Custo administrativo adicional: 0,4% × 9,6 = R$ 38 mil
//   Ganho líquido: 2.688 − 1.107 − 1.046 − 38 = R$ 497 mil/ano
//
// Análise marginal (cenário A com custo próprio 18%):
//   Ganho líquido: 2.688 − 1.107 − 1.345 − 38 = R$ 198 mil/ano
//   Viável, mas margem mais apertada.
//
// Cenário B — Adoção seletiva (apenas clientes A/B = 60% da carteira):
//   Receita adicional: +12% × 60% = +7,2% = R$ 5,76 M
//   Inadimplência adicional (perfil A/B é menos arriscado):
//     2,2% → 2,5% sobre toda carteira
//     85,76 × 2,5% = R$ 2.144
//     Vs anterior: 1.760
//     Δ = R$ 384
//   NCG adicional: (85,76 × 0,6 / 360) × 30 = R$ 4,29 M
//     A WACC 14%: 4,29 × 14% = R$ 601 mil/ano
//   Margem adicional: 28% × 5,76 = R$ 1.613 mil
//   Admin: 0,4% × 5,76 = R$ 23
//   Ganho líquido: 1.613 − 384 − 601 − 23 = R$ 605 mil/ano
//
// Cenário C — Não adotar — manter 30 dias + desconto à vista 1,5%
//   Receita: estável R$ 80 M
//   ~20% dos clientes tomam desconto → 16 M × 1,5% = R$ 240 mil "perda"
//     Mas: NCG reduz porque parte recebe à vista
//   PMRV efetivo passa de 30 para ~25 dias (mix com 20% à vista)
//   NCG libera: (80/360) × 5 = R$ 1,11 M
//   Ganho financeiro: 1,11 × 14% = R$ 156 mil/ano
//   Ganho líquido: 156 − 240 = −R$ 84 mil/ano
//   Conclusão: desconto à vista isolado é negativo aqui; mas reduz risco
//   e libera capital — pode fazer sentido em ambiente de stress.
// =============================================================================

export const S4_2: Scenario = {
  id: "s4_2",
  code: "S4.2",
  title: "Mudança da política de prazo — Atacadista Theta",
  company: "Atacadista Theta S.A.",
  difficulty: "Avançado",
  estimatedMinutes: 24,
  context: {
    narrative:
      "Você é tesoureiro(a) do **Atacadista Theta**, distribuidor de materiais de construção com **receita anual de R$ 80 milhões**, PMRV de **30 dias** e inadimplência atual de **2,2%**. A **diretoria comercial** propõe **estender o prazo padrão para 60 dias** como instrumento de **conquista de mercado** — projeta +12% de receita em 12 meses. A tesouraria precisa avaliar o impacto agregado: aumento de NCG, custo financeiro adicional, inadimplência marginal e ganho líquido. O custo de capital pode ser premissado de duas formas — **WACC de 14% a.a.** (mais realista para empresa com mix de funding) ou **custo de capital próprio de 18% a.a.** (mais conservador, próprio para análise de risco). Três caminhos sobre a mesa: adoção plena para toda carteira, adoção seletiva para clientes A/B, ou manter 30 dias e oferecer desconto à vista de 1,5%.",
    keyFacts: [
      ["Receita atual", "R$ 80,0 M"],
      ["PMRV atual", "30 dias"],
      ["Margem bruta", "28%"],
      ["Inadimplência atual", "2,2%"],
      ["Custo de capital — WACC", "14% a.a."],
      ["Custo de capital — próprio", "18% a.a."],
      ["Aumento de receita projetado (60 d)", "+12%"],
      ["Aumento de inadimplência esperado (60 d)", "+1,0 pp (plena) / +0,3 pp (seletiva)"],
    ],
  },
  statements: [
    {
      id: "comparacao_politicas",
      title: "Mudança de política de prazo — comparação dos três caminhos (R$ mil/ano)",
      unit: "R$ mil / % / dias",
      periods: ["A: Plena (60 d)", "B: Seletiva A/B", "C: Manter + desc. 1,5%"],
      sections: [
        {
          label: "Volume e prazo",
          rows: [
            { label: "Receita anual (R$ mil)", values: [89600, 85760, 80000], emphasis: "bold" },
            { label: "Δ receita vs atual (R$ mil)", values: [9600, 5760, 0], indent: 1 },
            { label: "PMRV médio (dias)", values: [60, 48, 25], indent: 1 },
            { label: "Inadimplência (%)", values: [3.2, 2.5, 2.2], indent: 1 },
          ],
        },
        {
          label: "Análise marginal anual (WACC 14%)",
          rows: [
            { label: "Margem bruta adicional (28% × Δ rec.)", values: [2688, 1613, 0], indent: 1 },
            { label: "Inadimplência adicional", values: [-1107, -384, 0], indent: 1 },
            { label: "Custo financeiro NCG adicional", values: [-1046, -601, 156], indent: 1 },
            { label: "Custo administrativo adicional", values: [-38, -23, 0], indent: 1 },
            { label: "Desconto à vista concedido (1,5% × 16M)", values: [0, 0, -240], indent: 1 },
            { label: "Ganho líquido anual (R$ mil)", values: [497, 605, -84], emphasis: "total" },
          ],
        },
        {
          label: "Necessidade de funding e risco",
          rows: [
            { label: "NCG adicional (R$ mil)", values: [7470, 4290, -1110], indent: 1 },
            { label: "Capital de giro requerido", values: [7470, 4290, -1110], indent: 1 },
            { label: "Risco de execução (1-5)", values: [4, 2, 1], indent: 1 },
            { label: "Reversibilidade (1=alta)", values: [4, 2, 1], indent: 1 },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Premissa de aumento de receita.** Antes de aceitar a premissa, qual **questionamento crítico** o tesoureiro deve trazer ao comitê?",
      choices: [
        {
          id: "e1_a",
          label:
            "**Origem dos 12%**: vem de **novos clientes** (captação líquida) ou de **clientes atuais comprando mais** (aprofundamento)? E **quem são os concorrentes** que oferecem 30 dias vs 60 dias hoje? Sem esses dados, o número é projeção, não premissa.",
          correct: true,
          score: 20,
          feedback:
            "Correto e essencial. **Origem do crescimento** muda completamente a leitura do risco: (1) **novos clientes** captados pela vantagem de prazo são tipicamente **mais arriscados** (escolheram pelo prazo, não pela qualidade do serviço — adversidade na seleção); (2) **clientes atuais aprofundando** são menos arriscados (já têm histórico). **Concorrência** define se a mudança é **defensiva** (concorrente já oferece 60 d, perdendo cliente) ou **ofensiva** (todos em 30 d, ganho competitivo). Sem essas duas respostas, +12% é wishful thinking — pode vir muito menor ou trazer perfil muito pior do que premissa.",
        },
        {
          id: "e1_b",
          label:
            "**+12% é conservador** — vendedores tipicamente subestimam impacto comercial. Aceitar como piso e premissar +18% no melhor cenário.",
          correct: false,
          score: 0,
          feedback:
            "Inverte o viés. **Vendedores tipicamente superestimam** impacto de mudanças favoráveis (mais prazo, menor preço) porque querem a aprovação — psicologia comercial bem documentada. Premissar acima do número da própria comercial é **otimismo composto** — leva a aprovação de políticas com ganho real muito abaixo do projetado.",
        },
        {
          id: "e1_c",
          label:
            "**Aceitar +12%** sem questionar — comercial é a área que conhece o mercado.",
          correct: false,
          score: 0,
          feedback:
            "Abdicação de função. Tesouraria **não duplica trabalho comercial**, mas tem obrigação de **testar premissas** que entram na análise financeira. Aceitar projeção sem questionar é assinar embaixo de risco que pode não se materializar; aprovação vira responsabilidade de quem aprovou, não de quem projetou.",
        },
        {
          id: "e1_d",
          label:
            "**Premissar +6%** (metade) — sempre cortar projeção comercial pela metade para conservadorismo.",
          correct: false,
          score: 10,
          feedback:
            "**Regra de bolso defensável**, mas inadequada como metodologia. Cortar 50% sem analisar a base **subdimensiona genuinamente** projeções bem fundamentadas e **superdimensiona** projeções vazias. Análise correta é entender **a composição** (novos vs aprofundamento) e ajustar **por fator** específico, não corte cego.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Premissa de custo de capital.** Qual é a **premissa correta** para esta análise marginal de política de crédito?",
      choices: [
        {
          id: "e2_a",
          label:
            "**WACC** — porque o financiamento da NCG adicional virá de **mix de fontes** (capital próprio + dívida), e WACC é a média ponderada correta. Custo próprio só é apropriado em **decisões 100% financiadas por equity** (raras em capital de giro).",
          correct: true,
          score: 20,
          feedback:
            "Correto. **NCG adicional** será financiada pelo mesmo mix de funding da operação — capital próprio + linhas de capital de giro + spread bancário. **WACC reflete o custo médio real** desse mix. Usar custo próprio em decisão de capital de giro **superestima** o custo (porque dívida custa menos que equity), levando a rejeitar projetos rentáveis. Boa prática: **WACC para análise marginal de capital de giro**, custo próprio para decisões de equity (M&A, IPO, retenção de dividendos).",
        },
        {
          id: "e2_b",
          label:
            "**Custo próprio (18%)** — sempre usar a opção mais conservadora; se passa no teste do mais caro, é projeto sólido.",
          correct: false,
          score: 5,
          feedback:
            "Conservadorismo **errôneo** que rejeita projetos viáveis. Se a empresa tem dívida disponível a 14%, financiar NCG a 18% (premissar custo próprio) é forçar a usar capital errado. Premissa correta reflete **o custo da fonte que será efetivamente usada** — em capital de giro, é o mix (WACC).",
        },
        {
          id: "e2_c",
          label:
            "**Custo de dívida bancária** (CDI + spread = ~16%) — porque NCG adicional será financiada por linha bancária.",
          correct: false,
          score: 10,
          feedback:
            "**Defensável em certo recorte** (se a empresa de fato vai contratar linha nova para esta NCG marginal), mas **subestima** o custo se considerar que parte do funding virá de equity (lucro retido). WACC é mais robusto porque captura **mix de longo prazo**. Boa nuance: se a decisão é **incremental e fora do orçamento de equity**, custo de dívida marginal pode ser usado — mas é raro em política de crédito.",
        },
        {
          id: "e2_d",
          label:
            "**Custo de oportunidade do CDI** (~11%) — porque o capital alternativo está no CDI.",
          correct: false,
          score: 0,
          feedback:
            "Confunde **custo do capital** (WACC) com **rendimento alternativo do excedente** (CDI). CDI é referência para **investimentos de excedente de caixa**, não para **custo de financiamento de NCG**. Premissar 11% subestima fortemente o custo (uma empresa com WACC 14% não financia capital a 11%) e leva a aprovar projetos que destroem valor.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Decidir entre A, B e C.** Qual é a **decisão dominante**?",
      choices: [
        {
          id: "e3_a",
          label:
            "**Cenário B (seletiva)** — entrega o **maior ganho líquido** (R$ 605k), com **menor NCG adicional** (R$ 4,3 M vs R$ 7,5 M) e **menor inadimplência marginal**. Foca o benefício de prazo nos clientes que **menos risco trazem**, capturando a margem com perfil saudável.",
          correct: true,
          score: 20,
          feedback:
            "Correto e contraintuitivo. **Política de crédito não escala linearmente** — estender prazo para 100% da carteira **inclui clientes C/D** onde a inadimplência marginal explode. Seletiva (A/B) captura o ganho na faixa onde o risco está controlado e **deixa os clientes de maior risco no prazo curto** (onde o risco é menor pela própria duração). Resultado: ganho **maior** com risco **menor** — dominância matemática rara. Boa prática: **toda mudança de política de crédito deve ser segmentada por perfil de risco**, não uniforme.",
        },
        {
          id: "e3_b",
          label:
            "**Cenário A (plena)** — apesar do ganho menor, política uniforme é mais simples de operacionalizar e comunicar ao mercado.",
          correct: false,
          score: 5,
          feedback:
            "Simplicidade operacional **não compensa R$ 108 mil/ano** de ganho perdido e **R$ 3,2 M** de NCG adicional desnecessária. Sistemas modernos de gestão de crédito (CRM + ERP) operacionalizam segmentação por perfil sem dificuldade. \"Simples de comunicar\" também é falso — \"prazo padrão depende do seu perfil de crédito\" é prática universal em B2B e cliente A/B fica satisfeito por ser tratado preferencialmente.",
        },
        {
          id: "e3_c",
          label:
            "**Cenário C (manter + desconto)** — é o único que **libera caixa** e reduz risco. Ganho negativo é aceitável pelo perfil mais defensivo.",
          correct: false,
          score: 5,
          feedback:
            "**Ganho negativo é destruição de valor** — não vale defesa por simetria. C faz sentido **em ambiente de stress de liquidez** (a empresa precisa de caixa, mesmo perdendo margem). Em operação normal, escolher política que destrói R$ 84 mil/ano para liberar R$ 1,1 M de NCG é **trade-off ruim** — empresa com WACC 14% deveria captar o R$ 1,1 M a 14% (custo R$ 154k) em vez de \"liberar\" perdendo R$ 240k em desconto + R$ 84k de margem.",
        },
        {
          id: "e3_d",
          label:
            "**Combinação A + C** — estender para 60 d na carteira A/B e oferecer desconto à vista 1,5% na carteira C/D. Captura os dois efeitos.",
          correct: false,
          score: 10,
          feedback:
            "**Lógica criativa** que parece atraente mas complica operação sem ganho líquido proporcional. Cliente C/D tomando desconto à vista vira **−R$ 50-80k adicional** que **não compensa** o ganho de B. Política de crédito **dual** (parte estende prazo, parte oferece desconto) cria confusão de pricing e dificulta força de vendas explicar. Simplifique: B sozinho é dominante.",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Adoção plena (60 dias para toda carteira)",
      shortLabel: "Plena 60 d",
      description:
        "Estender prazo padrão para **60 dias em 100% da carteira**. Receita projetada: **+R$ 9,6 M** (+12%). Inadimplência média sobe de 2,2% para 3,2%. NCG adicional **R$ 7,5 M**. Ganho líquido **R$ 497 mil/ano** (WACC 14%). Política uniforme, simples de comunicar.",
      resultPanel: {
        headline: "Ganho R$ 497 mil/ano, mas exige R$ 7,5 M de funding adicional e inadimplência sobe 1 pp",
        deltas: [
          { label: "Δ Receita anual", value: "+R$ 9,6 M (+12%)", tone: "positive" },
          { label: "Ganho líquido anual (WACC 14%)", value: "R$ 497 mil/ano", tone: "positive" },
          { label: "Ganho líquido anual (custo próprio 18%)", value: "R$ 198 mil/ano", tone: "neutral" },
          { label: "NCG adicional necessária", value: "R$ 7,47 M", tone: "negative" },
          { label: "Δ Inadimplência média", value: "2,2% → 3,2% (+1,0 pp)", tone: "negative" },
          { label: "Risco de execução", value: "Alto — clientes C/D ampliam exposição", tone: "negative" },
          { label: "Reversibilidade", value: "Baixa — voltar a 30 d alimenta resistência comercial", tone: "negative" },
        ],
        commentary:
          "**Política viável em premissa WACC, marginal em premissa custo próprio** — sensível à escolha de premissa. Vantagens: ganho de market share visível, política simples. Desvantagens críticas: (1) **NCG adicional de R$ 7,5 M** exige funding novo (CG, debêntures, retenção de lucro); (2) inadimplência marginal **inclui clientes C/D** onde a deterioração é desproporcional; (3) **reversibilidade baixa** — voltar a 30 d em 12-24 meses gera resistência comercial enorme. Em ambiente de Selic baixa, A é mais defensável; em Selic alta (15%+), B captura quase todo o ganho com fração do risco.",
      },
      reflection: {
        prompt:
          "A diferença entre WACC (14%) e custo próprio (18%) muda o ganho de R$ 497k para R$ 198k — fator 2,5×. Que **conclusão prática** se tira dessa sensibilidade?",
        choices: [
          {
            id: "ra_a",
            label:
              "**A análise marginal de crédito é altamente sensível à premissa de custo de capital** — comitê deve aprovar a premissa **explicitamente** antes de avaliar o projeto, e **sensibilizar** com cenários (WACC, custo próprio, custo de dívida marginal) para entender a faixa de ganho real.",
            correct: true,
            score: 25,
            feedback:
              "Correto e disciplinar. **Premissa não-explicitada vira viés** — quem apresenta o projeto escolhe a premissa que favorece sua narrativa. Boa prática: apresentar **tabela de sensibilidade** com 3 premissas (14% WACC, 18% próprio, 16% dívida marginal) e ganho líquido em cada — comitê decide informado, não enganado. **Sensibilidade alta é a regra** em análise marginal de capital de giro, porque o ganho é diferencial pequeno entre fluxos grandes.",
          },
          {
            id: "ra_b",
            label:
              "**Usar sempre o WACC** — é a métrica padrão e elimina ambiguidade.",
            correct: false,
            score: 10,
            feedback:
              "WACC é a premissa **mais correta** (resposta da etapa 2), mas sempre apresentar **sensibilidade** ao comitê é boa prática — confere transparência. \"Sempre WACC\" sem sensibilizar oculta o risco da premissa, que é parte da análise honesta.",
          },
          {
            id: "ra_c",
            label:
              "**A diferença não é material** — entre R$ 198 mil e R$ 497 mil, o projeto é positivo em ambos os casos.",
            correct: false,
            score: 0,
            feedback:
              "**Em B+ (marginal), R$ 198k é diferente de R$ 497k** — em premissa conservadora, ganho mal cobre risco de execução e qualquer surpresa negativa (inadimplência maior, receita menor) vira VPL negativo. Margem é estreita; comitê precisa entender.",
          },
          {
            id: "ra_d",
            label:
              "**Calcular VPL com taxa livre de risco** (CDI) e considerar diferencial como prêmio de risco do projeto.",
            correct: false,
            score: 5,
            feedback:
              "Metodologia válida em **valuation de empresas**, mas não em **análise marginal de capital de giro** — adiciona complexidade sem ganho de precisão. WACC já é a premissa correta; sensibilizar é o ajuste suficiente.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — Adoção seletiva (apenas clientes A e B)",
      shortLabel: "Seletiva A/B",
      description:
        "Estender prazo para **60 dias apenas em clientes A/B** (60% da carteira). Receita projetada: **+R$ 5,76 M** (+7,2%). Inadimplência média sobe de 2,2% para 2,5% (perfil A/B é mais resiliente). NCG adicional **R$ 4,29 M**. Ganho líquido **R$ 605 mil/ano** — **maior** que cenário A.",
      resultPanel: {
        headline: "Ganho R$ 605 mil/ano (+R$ 108 vs A) com 57% do NCG adicional — dominância matemática",
        deltas: [
          { label: "Δ Receita anual", value: "+R$ 5,76 M (+7,2%)", tone: "positive" },
          { label: "Ganho líquido anual (WACC 14%)", value: "R$ 605 mil/ano", tone: "positive" },
          { label: "Δ vs cenário A", value: "+R$ 108 mil/ano (ganho)", tone: "positive" },
          { label: "NCG adicional necessária", value: "R$ 4,29 M (vs 7,47)", tone: "positive" },
          { label: "Δ Inadimplência média", value: "2,2% → 2,5% (+0,3 pp)", tone: "positive" },
          { label: "Risco de execução", value: "Baixo — escopo focado em perfil controlado", tone: "positive" },
          { label: "Sinalização ao mercado", value: "Política de mérito — premia bons clientes", tone: "positive" },
        ],
        commentary:
          "**Política dominante em quase qualquer premissa** — captura **122%** do ganho do cenário A com **57%** da NCG adicional e **30%** da inadimplência marginal. Vantagem estratégica adicional: **clientes A/B sentem-se reconhecidos** (recebem prazo preferencial), o que reforça lealdade e abre porta para venda incremental ainda maior. Mensagem comercial clara: \"qualidade de pagamento dá benefício\". Risco residual: **clientes C/D podem reclamar discriminação** — comunicar como \"política de mérito\" e oferecer caminho de evolução (\"pague em dia por 6 meses e migra para A/B\") neutraliza atrito. Único cenário em que A seria preferível: se o **objetivo é captação massiva de mercado** (intenção estratégica de conquistar clientes novos rapidamente, mesmo de pior perfil) — tipicamente em entrada de mercado novo.",
      },
      reflection: {
        prompt:
          "Cenário B é dominante em ganho e em risco. Por que então **algumas empresas insistem em A** (plena)?",
        choices: [
          {
            id: "rb_a",
            label:
              "Por **pressão da área comercial** que prefere oferecer ao máximo de clientes (mais volume é mais comissão) ou por **viés de simplicidade** do comitê (\"política uniforme é mais fácil\"). Ambos são vieses, não decisões técnicas.",
            correct: true,
            score: 25,
            feedback:
              "Correto e politicamente realista. **Decisões de crédito sofrem captura por incentivos comerciais** — vendedor é remunerado por volume, não por margem após risco. Vendedor prefere oferecer 60 d para todo mundo (mais fechamentos); tesouraria precisa **proteger a margem ajustada a risco**. \"Simplicidade\" do comitê é versão organizacional do mesmo viés — preferência por norma única em vez de norma calibrada. Boa prática: tesouraria apresenta **comparação explícita A vs B** e mostra a dominância de B; força a discussão a ser **técnica**, não política.",
          },
          {
            id: "rb_b",
            label:
              "Porque cenário B **discrimina** clientes C/D e pode gerar **ação legal** por tratamento desigual.",
            correct: false,
            score: 0,
            feedback:
              "Discriminação por **perfil de risco** é prática **legal e padrão** em todo o sistema financeiro brasileiro — bancos cobram juros diferentes por score, seguradoras precificam por perfil. Em B2B, política de prazo segmentada é universal e não gera risco jurídico.",
          },
          {
            id: "rb_c",
            label:
              "Porque a **diferença de R$ 108 mil/ano é imaterial** em empresa de R$ 80 M de receita.",
            correct: false,
            score: 5,
            feedback:
              "R$ 108 mil/ano é **material** — equivale a 1 vendedor júnior por ano em economia, ou 5-10% do orçamento de marketing. Mais importante: cenário B também economiza **R$ 3,2 M de NCG**, que tem custo de oportunidade adicional. Total de vantagem ≈ R$ 550 mil/ano. Sempre material.",
          },
          {
            id: "rb_d",
            label:
              "Porque **clientes C/D são maioria** em muitas carteiras — limitar a A/B perde acesso a 70-80% do mercado.",
            correct: false,
            score: 10,
            feedback:
              "**Premissa estatística parcialmente correta** (em algumas carteiras, A/B é minoria), mas **lógica invertida**: justamente porque C/D é maioria, **estender prazo para eles aumenta exposição de risco desproporcionalmente**. Política seletiva é ainda mais importante em carteiras pulverizadas em C/D — não menos.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — Manter 30 dias e oferecer desconto à vista 1,5%",
      shortLabel: "Manter + desc.",
      description:
        "Manter prazo padrão de **30 dias** e oferecer **desconto à vista de 1,5%** para clientes que pagarem antecipadamente. Receita mantida em R$ 80 M; PMRV efetivo cai para ~25 dias (mix). Libera R$ 1,11 M de NCG, mas desconto concedido é R$ 240 mil. Ganho líquido **−R$ 84 mil/ano** — destrói valor em operação normal.",
      resultPanel: {
        headline: "Ganho líquido −R$ 84 mil/ano: destrói valor isoladamente, mas alivia caixa em stress",
        deltas: [
          { label: "Δ Receita anual", value: "R$ 0 (estável)", tone: "neutral" },
          { label: "Ganho líquido anual", value: "−R$ 84 mil/ano", tone: "negative" },
          { label: "Δ NCG", value: "−R$ 1,11 M (libera capital)", tone: "positive" },
          { label: "Desconto concedido", value: "R$ 240 mil/ano", tone: "negative" },
          { label: "Δ Inadimplência", value: "Inalterada (mesma carteira)", tone: "neutral" },
          { label: "Reversibilidade", value: "Alta — cancela desconto facilmente", tone: "positive" },
          { label: "Adequação", value: "Apenas em ambiente de stress de liquidez", tone: "negative" },
        ],
        commentary:
          "**Política defensável apenas em stress de liquidez** — quando a empresa precisa **liberar R$ 1,1 M de caixa** mais do que precisa preservar R$ 84k de margem. Em operação normal, captar R$ 1,1 M via CG a WACC 14% custa R$ 154k/ano — mais barato que perder R$ 240k em desconto. Trade-off de liquidez vs margem que **só faz sentido em emergência**. Risco operacional: **clientes que tomam desconto** tornam-se permanentes nessa condição — depois de 6 meses, retirar o desconto vira fricção comercial (mesmo que retira a margem perdida). Política reversível em teoria, **pegajosa** na prática.",
      },
      reflection: {
        prompt:
          "Quando exatamente **C** (manter + desconto) **vence** as alternativas A e B?",
        choices: [
          {
            id: "rc_a",
            label:
              "Quando a empresa **enfrenta restrição de funding** — banco não aprova mais CG, covenants comprometem novos empréstimos, ou Selic muito alta encarece dramaticamente o custo de financiar NCG adicional. Aí, **liberar caixa pagando margem** é trade-off racional.",
            correct: true,
            score: 25,
            feedback:
              "Correto e específico. **Restrição de funding** muda completamente a aritmética: se a empresa **não consegue** captar a R$ 7,5 M (cenário A) ou R$ 4,3 M (cenário B) que a expansão de prazo exigiria, então A e B viram **inviáveis** — não importa que o ganho líquido seja positivo, falta capital para executar. Em Selic 15-18%, custo de NCG marginal pode chegar a 20% a.a. (CDI + spread), e desconto à vista de 1,5% sobre 30 dias = ~20% a.a. — **paridade**, com vantagem para C (mais reversível).",
          },
          {
            id: "rc_b",
            label:
              "Quando a empresa **não confia na previsão de +12% de receita** — sem ter certeza do ganho, preserva-se status quo.",
            correct: false,
            score: 10,
            feedback:
              "Argumento válido (incerteza favorece status quo), mas **fraco**: se a empresa **não acredita em +12%**, deveria solicitar **revisão da projeção** ou rodar **cenário com +6%** — não escolher política que destrói valor. C é resposta ao **stress de liquidez**, não à **incerteza de receita**.",
          },
          {
            id: "rc_c",
            label:
              "Sempre — conservadorismo financeiro é virtude.",
            correct: false,
            score: 0,
            feedback:
              "Conservadorismo **destruindo valor** não é virtude — é evitação de risco que custa margem. Tesouraria madura distingue \"conservar caixa\" (legítimo) de \"perder margem\" (destruição de valor).",
          },
          {
            id: "rc_d",
            label:
              "Quando os clientes **demandam fortemente** opção de pagamento à vista com desconto.",
            correct: false,
            score: 5,
            feedback:
              "Demanda do cliente é **input**, não decisão. Se clientes querem desconto à vista mas a economia não compensa, **não conceda** ou **ajuste o percentual** (1% em vez de 1,5% inverte o sinal: +R$ 76k em vez de −R$ 84k). Calibrar pricing é parte da decisão; aceitar demanda sem calibrar destrói valor.",
          },
        ],
      },
    },
  ],
};
