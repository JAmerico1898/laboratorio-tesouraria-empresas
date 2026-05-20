import type { Scenario } from "@/types/scenario";

// =============================================================================
// S3.3 — Estoque de segurança em cadeia internacional
// =============================================================================
// Premissas:
//
// Empresa: Indústria Sigma (Eletrônicos). Importa componente da Ásia.
// Demanda média diária D = 1.000 un, σD = 200 un.
// Lead time fornecedor internacional: LT = 45 dias, σLT = 10 dias.
// Nível de serviço-alvo: 95% (z = 1,65).
// Preço de aquisição internacional: R$ 50/un.
// Custo de carregamento: 25% a.a.
//
// ES — fórmula simples (só variabilidade da demanda):
//   ES = z · σD · √LT
//      = 1,65 · 200 · √45 = 1,65 · 200 · 6,708 = 2.214 unidades
//
// ES — fórmula completa (variabilidade da demanda E do lead time):
//   ES = z · √(LT·σD² + D²·σLT²)
//      = 1,65 · √(45·40.000 + 1.000.000·100)
//      = 1,65 · √(1.800.000 + 100.000.000)
//      = 1,65 · √101.800.000
//      = 1,65 · 10.090
//      = 16.648 unidades
//
// Custo de carregamento do ES internacional:
//   16.648 × R$ 50 × 25% a.a. = R$ 208.100/ano
//
// Fornecedor local alternativo:
//   LT = 7 dias, σLT = 1 dia, preço = R$ 57,50/un (+15%).
//   ES local = 1,65 · √(7·40.000 + 1.000.000·1) = 1,65 · √281.000
//            = 1,65 · 530 = 875 unidades
//   Custo carregamento ES local: 875 × 57,50 × 25% = R$ 12.578/ano
//
// Custo de aquisição anual (D = 365.000 un/ano):
//   Internacional: 365.000 × 50 = R$ 18.250.000
//   Local:         365.000 × 57,50 = R$ 20.987.500
//   Δ aquisição: +R$ 2.737.500/ano (custo do local)
//
// Economia em ES (internacional → local):
//   R$ 208.100 − R$ 12.578 = R$ 195.522/ano (recurrente)
//   + liberação de capital ES: (16.648 − 875) × 50 = R$ 788.650 (one-off)
//   + ganho em risco de ruptura (qualitativo)
//
// Net anual: −2.737.500 + 195.522 = −R$ 2.541.978/ano (local mais caro)
// → preço do local não compensa só em custo direto.
//
// Dual sourcing (70% internacional, 30% local):
//   Aquisição: 0,7·18.250 + 0,3·20.987 = 12.775 + 6.296 = R$ 19.071 (mil)
//     vs internacional puro: +R$ 821 mil/ano
//   σLT mix ≈ √(0,7²·100 + 0,3²·1) = √49,09 = 7 (aprox.)
//   ES mix calculado sobre LT médio ponderado = 33,6 d
//     ES ≈ 1,65 · √(33,6·40.000 + 1.000.000·49) = 1,65 · √50.344.000
//        ≈ 1,65 · 7.095 = 11.707 un
//   Custo carregamento ES: 11.707 × ~52 × 25% = R$ 152.190/ano
//     vs internacional puro: −R$ 55.910/ano (alívio)
//   Net dual vs internacional puro: +821k aquisição − 56k carreg. ES
//     = +R$ 765k/ano (mais caro)
//   Ganho qualitativo: resiliência a choque externo (Covid-like)
// =============================================================================

export const S3_3: Scenario = {
  id: "s3_3",
  code: "S3.3",
  title: "Estoque de segurança em cadeia internacional — Indústria Sigma",
  company: "Indústria Sigma S.A.",
  difficulty: "Avançado",
  estimatedMinutes: 24,
  context: {
    narrative:
      "Você é responsável pelo **planejamento de suprimentos** da **Indústria Sigma**, fabricante de eletrônicos que importa um **componente crítico** da Ásia. A demanda diária média é de **1.000 unidades** (σ = 200) e o **lead time** do fornecedor internacional é **45 dias com σ de 10 dias** — alta variabilidade tipicamente vista em rotas marítimas longas. O nível de serviço-alvo aprovado pelo comitê é **95% (z = 1,65)**. O componente custa **R$ 50/unidade** e o custo de carregamento é **25% a.a.** O CFO está pressionando para **reduzir o capital empatado em estoque de segurança** e pediu para você avaliar três alternativas: manter o fornecedor internacional, migrar para um **fornecedor local** (LT = 7 dias, σ = 1 dia, mas preço 15% maior) ou estruturar **dual sourcing** (70/30) que combina o melhor dos dois mundos.",
    keyFacts: [
      ["Demanda média diária", "1.000 un (σ = 200)"],
      ["Demanda anual", "365.000 un"],
      ["LT internacional", "45 dias (σ = 10)"],
      ["LT local", "7 dias (σ = 1)"],
      ["Preço internacional / local", "R$ 50 / R$ 57,50 (+15%)"],
      ["Nível de serviço-alvo", "95% (z = 1,65)"],
      ["Custo de carregamento", "25% a.a."],
      ["Decisão", "Internacional puro × Local × Dual 70/30"],
    ],
  },
  statements: [
    {
      id: "comparacao_fornecedores",
      title: "Estoque de segurança e custos anuais por estratégia",
      unit: "un / R$ mil / dias",
      periods: ["Internacional", "Local", "Dual 70/30"],
      sections: [
        {
          label: "Premissas da cadeia",
          rows: [
            { label: "Lead time médio (dias)", values: [45, 7, 33.6], indent: 1 },
            { label: "σ do lead time (dias)", values: [10, 1, 7.0], indent: 1 },
            { label: "Preço unitário (R$/un)", values: [50.0, 57.5, 52.25], indent: 1 },
          ],
        },
        {
          label: "Dimensionamento do estoque de segurança",
          rows: [
            { label: "ES — fórmula simples (z·σD·√LT, un)", values: [2214, 873, 1912], indent: 1 },
            { label: "ES — fórmula completa (un)", values: [16648, 875, 11707], emphasis: "bold" },
            { label: "ES em dias de demanda", values: [16.6, 0.9, 11.7], indent: 1 },
            { label: "Capital empatado em ES (R$ mil)", values: [832, 50, 612], emphasis: "subtotal" },
          ],
        },
        {
          label: "Custos anuais consolidados (R$ mil)",
          rows: [
            { label: "Aquisição anual (365.000 un × preço)", values: [18250, 20988, 19071], indent: 1 },
            { label: "Carregamento do ES (25% a.a.)", values: [208, 13, 153], indent: 1 },
            { label: "Custo total anual (aquisição + ES)", values: [18458, 21001, 19224], emphasis: "total" },
            { label: "Δ vs Internacional (R$ mil/ano)", values: [0, 2543, 766], emphasis: "bold" },
          ],
        },
        {
          label: "Aspectos qualitativos",
          rows: [
            { label: "Resiliência a choques externos (1-5)", values: [1, 4, 5], indent: 1 },
            { label: "Risco cambial (FX) (1-5)", values: [5, 1, 3], indent: 1 },
            { label: "Complexidade operacional (1-5)", values: [3, 1, 4], indent: 1 },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Calcular o ES considerando apenas variabilidade da demanda.** Com z = 1,65, σD = 200 e LT = 45 dias, qual é o ES — e o que **falta** nessa fórmula?",
      choices: [
        {
          id: "e1_a",
          label:
            "ES = z · σD · √LT = 1,65 × 200 × √45 = 1,65 × 200 × 6,708 ≈ **2.214 unidades**. Falta incluir a **variabilidade do lead time** (σLT = 10 dias) — em cadeia internacional, ignorar σLT subestima o ES em ordem de grandeza.",
          correct: true,
          score: 20,
          feedback:
            "Correto. A **fórmula simples** ES = z·σD·√LT assume **LT determinístico** — premissa razoável em cadeia curta e estável (fornecedor local), **inadequada** em cadeia internacional onde o LT varia (tempestades, congestão portuária, paralisações alfandegárias). Aqui, com σLT = 10 dias, ignorar essa variabilidade subestima o ES de **2.214 para o valor real de 16.648** — fator 7,5×. Erro material que **destrói** o nível de serviço prometido.",
        },
        {
          id: "e1_b",
          label:
            "ES = D × LT = 1.000 × 45 = **45.000 unidades** — cobertura completa para o lead time.",
          correct: false,
          score: 0,
          feedback:
            "Confunde ES com **estoque em trânsito** (pipeline = D × LT). ES é o **colchão sobre o pipeline** para absorver variabilidade. Calcular ES como D × LT triplica o capital empatado sem fundamento estatístico. Pipeline e ES são **componentes distintos** do estoque total.",
        },
        {
          id: "e1_c",
          label:
            "ES = z · σD = 1,65 × 200 = **330 unidades**.",
          correct: false,
          score: 0,
          feedback:
            "Esqueceu o termo **√LT** — fator crítico que escala o ES com a duração do lead time. ES de 330 un é suficiente para **1 dia** de demanda incerta, não 45. Subestimaria o ES em ordem de grandeza e geraria ruptura constante.",
        },
        {
          id: "e1_d",
          label:
            "ES = z² · σD · LT = 1,65² × 200 × 45 = **24.503 unidades**.",
          correct: false,
          score: 5,
          feedback:
            "Fórmula inventada. O **z entra linearmente** (não ao quadrado) e **LT entra com raiz** (não linearmente, no termo da demanda). A consequência matemática é central: dobrar LT **não dobra** o ES — multiplica por √2 ≈ 1,41. Esquecer essa não-linearidade gera estoques excessivos.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Incluir variabilidade do lead time.** Qual é o ES real — e qual a interpretação correta do **enorme aumento** vs a fórmula simples?",
      choices: [
        {
          id: "e2_a",
          label:
            "ES = 1,65 × √(45·40.000 + 1.000.000·100) = 1,65 × √101,8 M ≈ **16.648 unidades**. O termo D²·σLT² **domina** o cálculo: em cadeia internacional, a **variabilidade do lead time** é o componente mais caro do ES, não a demanda.",
            correct: true,
            score: 20,
          feedback:
            "Correto e revelador. A decomposição mostra: **D²·σLT² = 100.000.000** vs **LT·σD² = 1.800.000** — variabilidade do LT contribui **98%** do termo dentro da raiz. Em cadeia longa, **5 dias a mais de incerteza no LT** custam mais ES do que **dobrar o σ da demanda**. Implicação estratégica: **investir em previsibilidade do fornecedor** (contratos com SLA, monitoramento de embarques, dual sourcing) **rende mais** do que melhorar forecast da demanda. Inversão clássica do senso comum.",
        },
        {
          id: "e2_b",
          label:
            "ES ≈ 2.214 un — a fórmula simples já é suficiente; a completa é refinamento acadêmico sem ganho prático.",
          correct: false,
          score: 0,
          feedback:
            "Subestima o ES em **fator 7,5×**, comprometendo o nível de serviço prometido. Em cadeia onde **σLT > 5-10% do LT**, a fórmula completa **não é refinamento — é necessidade**. Empresa que opera com ES de 2.214 un em vez de 16.648 un terá **ruptura observada de 30-50%**, não 5%, e o cliente vai embora.",
        },
        {
          id: "e2_c",
          label:
            "ES = 2.214 + 1.000 × 10 = **12.214 unidades** — somar pipeline durante a janela de incerteza do LT.",
          correct: false,
          score: 5,
          feedback:
            "Intuição na direção certa (incluir efeito do LT incerto), mas **fórmula errada**: a combinação correta é **estatística** (raiz da soma dos quadrados), não soma linear. Soma linear superestima quando os σ's são pequenos e subestima quando são grandes — viola a teoria de combinação de variâncias.",
        },
        {
          id: "e2_d",
          label:
            "ES = z · σLT · D = 1,65 × 10 × 1.000 = **16.500 unidades** — aproximação direta dominada pelo lead time.",
          correct: false,
          score: 15,
          feedback:
            "Resultado **numericamente próximo** do correto (16.648), e a intuição está certa (LT domina). Mas você **eliminou** o termo da demanda — em cadeia onde σD também é relevante, a aproximação falha. A fórmula completa é geral e robusta; a aproximação só vale quando D²·σLT² >> LT·σD² (que é o caso aqui, mas não sempre).",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Decidir o sourcing.** Qual decisão é **defensável**?",
      choices: [
        {
          id: "e3_a",
          label:
            "**Dual 70/30** — mantém 70% do preço baixo do internacional **e** reduz substancialmente o ES via 30% local (que age como buffer). Custo adicional **R$ 766 mil/ano** comprado por **resiliência** (lição 2020-2022) e ES 30% menor. Trade-off explícito entre custo e robustez.",
          correct: true,
          score: 20,
          feedback:
            "Correto e maduro. **Dual sourcing** captura **a maior parte** do ganho de preço (70% × diferencial) e **resiliência crítica**: se a Ásia fechar (Covid, conflito geopolítico, paralisação portuária), a parcela local **mantém a linha operando** por semanas enquanto se reorganiza o sourcing internacional. Lições da pandemia: empresas com **single sourcing internacional** sofreram paradas de produção de 2-6 meses; empresas com dual sourcing sofreram 2-4 semanas. R$ 766 mil/ano é **prêmio de seguro** contra evento de baixa probabilidade e altíssimo impacto. Boa prática: dimensionar a parcela local pelo **tempo necessário para reativar internacional em caso de choque** (4-12 semanas típicas).",
        },
        {
          id: "e3_b",
          label:
            "**Manter internacional puro** — diferencial de preço (+R$ 2,5 M) é enorme vs ganho em ES (R$ 195 mil/ano). Não há justificativa financeira para mudar.",
          correct: false,
          score: 5,
          feedback:
            "**Cálculo correto, conclusão incompleta.** Em conta direta, internacional vence por **R$ 2,3 M/ano** vs local. Mas a análise ignora **risco de cauda**: probabilidade de evento disruptivo (5-15% em horizonte de 3 anos para rota asiática) × impacto (paralisação de 2-6 meses × custo diário de não-produção). Em produto com margem alta e cliente exigente, expectativa do risco vale R$ 1-3 M/ano. Conta fica empate ou negativa para internacional puro — o que justifica pelo menos **dual sourcing parcial**.",
        },
        {
          id: "e3_c",
          label:
            "**Migrar 100% para local** — economia de R$ 195 mil/ano em ES + liberação de R$ 788 mil de capital + zero risco cambial. Justifica os R$ 2,5 M/ano adicionais de preço.",
          correct: false,
          score: 5,
          feedback:
            "Inversão excessiva. Pagar **+R$ 2,5 M/ano** em aquisição para economizar **R$ 195 mil/ano em ES + R$ 788 mil one-off** é **trade-off financeiro negativo** — payback **nunca acontece**. Resiliência total ao fornecedor local também é **falsa segurança**: dependência de fornecedor único local cria outro tipo de risco (interrupção do fornecedor, alavancagem comercial dele). Dual é dominante.",
        },
        {
          id: "e3_d",
          label:
            "**Dual 50/50** — distribui igualmente para diversificar máximo.",
          correct: false,
          score: 10,
          feedback:
            "Lógica correta (diversificar), mistura **errada**. 50/50 custa **+R$ 1,37 M/ano** (vs +R$ 766 mil do 70/30) sem ganho proporcional em resiliência — 30% local já cobre 60-90 dias de produção (tempo suficiente para reativar internacional). Adicionar mais 20% no local **paga prêmio sem reduzir risco material**. Princípio: dimensionar dual sourcing pelo **período de reativação**, não por simetria arbitrária.",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Manter fornecedor internacional puro",
      shortLabel: "Internacional",
      description:
        "Continuar 100% com fornecedor asiático. ES = **16.648 unidades** (R$ 832 mil de capital empatado). Custo total anual **R$ 18,46 milhões** (aquisição + carregamento do ES). Menor custo nominal, maior risco de cauda.",
      resultPanel: {
        headline: "Custo R$ 18,46 M/ano — menor preço, mas R$ 832 mil em ES e exposição a choque externo",
        deltas: [
          { label: "Custo total anual", value: "R$ 18,46 M", tone: "positive" },
          { label: "Capital empatado em ES", value: "R$ 832 mil", tone: "negative" },
          { label: "Risco cambial (BRL/USD)", value: "Alto — exposição plena", tone: "negative" },
          { label: "Resiliência a choque externo", value: "Baixa — single source", tone: "negative" },
          { label: "Tempo de reposição em emergência", value: "45-90 dias (mínimo)", tone: "negative" },
          { label: "Custo de oportunidade do ES", value: "R$ 208 mil/ano (25% × 832)", tone: "negative" },
          { label: "Adequação operacional", value: "Apta se produto é commodity e margem é apertada", tone: "neutral" },
        ],
        commentary:
          "**Decisão de custo nominal dominante**, mas que carrega **risco de cauda material**. ES de 16.648 unidades é função direta da **variabilidade do lead time** (σLT = 10 dias domina o cálculo) — investimento em monitoramento de embarques e contratos com SLA pode **reduzir σLT** de 10 para 5-6 dias, cortando o ES para ~10-12 mil un. Risco principal é **evento de cauda**: pandemia, conflito geopolítico, paralisação portuária — em 2020-2022 muitas empresas com single source asiática perderam **2-6 meses de produção**. Adequado quando a margem do produto é apertada (não há espaço para premium do local) e o histórico operacional é estável.",
      },
      reflection: {
        prompt:
          "Mesmo mantendo internacional puro, qual **investimento marginal** reduz materialmente o ES sem mudar de fornecedor?",
        choices: [
          {
            id: "ra_a",
            label:
              "Investir em **redução de σLT** — contratos com SLA + monitoramento de embarques via plataforma (BlueTrack, Project44) + freteiros premium. Reduzir σLT de 10 para 5 dias corta ES de 16.648 para ~9.000 (− R$ 380 mil em capital empatado e R$ 95 mil/ano em carregamento).",
            correct: true,
            score: 25,
            feedback:
              "Correto e alavancagem mais relevante. Como **D²·σLT² domina** o cálculo do ES, **reduzir σLT** é o investimento de maior retorno. Plataformas de visibilidade de cadeia custam R$ 30-80 mil/ano e contratos com SLA + multas (mesmo com prêmio de 2-3% no preço) entregam **σLT consistentemente menor**. Boa prática: tratar **variabilidade do lead time como passivo financeiro** — cada dia de σLT a mais custa R$ 30-50 mil de carregamento extra.",
          },
          {
            id: "ra_b",
            label:
              "Investir em **previsão de demanda** (machine learning) para reduzir σD de 200 para 100.",
            correct: false,
            score: 5,
            feedback:
              "Verdade técnica, mas **alavancagem fraca** neste cenário: como D²·σLT² domina (98% do termo), reduzir σD de 200 para 100 muda o ES apenas marginalmente (de 16.648 para 16.620). Investimento em ML faz sentido **quando σD domina** (cadeia local com LT estável). Em cadeia internacional, **σLT é a alavanca**.",
          },
          {
            id: "ra_c",
            label:
              "Aumentar o **z para 99%** (z = 2,33) para melhorar nível de serviço.",
            correct: false,
            score: 0,
            feedback:
              "**Aumenta** ES, não reduz — passa de 16.648 para 23.504 un (+40%). Sobe capital empatado em R$ 343 mil e carregamento em R$ 86 mil/ano. Faz sentido apenas se a perda por ruptura justifica (componente crítico, cliente exigente), mas é o **oposto** do pedido do CFO.",
          },
          {
            id: "ra_d",
            label:
              "**Reduzir z para 90%** (z = 1,28) para reduzir ES — basta aceitar nível de serviço menor.",
            correct: false,
            score: 5,
            feedback:
              "Reduz ES (de 16.648 para 12.910, −22%) mas **degrada nível de serviço prometido** — vai de 95% para 90%, ou seja, **ruptura passa de 5% para 10%**. Em componente crítico para a produção, dobrar ruptura tem custo operacional alto. Reduzir z é **trade-off de nível de serviço**, não otimização — e exige aprovação do comitê, não decisão de tesouraria.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — Migrar 100% para fornecedor local",
      shortLabel: "Local 100%",
      description:
        "Trocar **integralmente** para fornecedor local. ES cai para **875 unidades** (R$ 50 mil), libera R$ 788 mil de capital. Mas aquisição sobe **+R$ 2,5 M/ano** (+15% no preço). Custo total **R$ 21,0 milhões**. Resiliência máxima a choque externo, custo nominal muito superior.",
      resultPanel: {
        headline: "Custo R$ 21 M/ano (+R$ 2,5 M vs internacional) — paga premium alto por resiliência local",
        deltas: [
          { label: "Custo total anual", value: "R$ 21,00 M", tone: "negative" },
          { label: "Δ vs Internacional", value: "+R$ 2,54 M/ano (mais caro)", tone: "negative" },
          { label: "Capital liberado em ES", value: "+R$ 788 mil (one-off)", tone: "positive" },
          { label: "Economia em carregamento de ES", value: "+R$ 195 mil/ano", tone: "positive" },
          { label: "Resiliência a choque externo", value: "Máxima", tone: "positive" },
          { label: "Risco cambial (FX)", value: "Eliminado", tone: "positive" },
          { label: "Adequação operacional", value: "Apta se margem suporta +15% e se fornecedor local tem capacidade", tone: "neutral" },
        ],
        commentary:
          "**Decisão dominante em produtos com alta margem ou em empresas que sofreram disrupção recente.** Custo adicional de **R$ 2,54 M/ano** (R$ 2,74 M de aquisição − R$ 195 mil de ES) é prêmio elevado — só se justifica se: (1) a margem unitária do produto absorve +15% sem perder competitividade, (2) o cliente final valoriza \"feito no Brasil\" (mercados específicos), (3) a empresa tem **histórico recente** de paralisação por single source (memória institucional fresca tende a justificar o premium). Risco principal: **trocar um single source por outro single source** — agora dependente de um fornecedor local que pode ter sua própria interrupção, e cuja **capacidade pode não escalar** com a demanda da Sigma.",
      },
      reflection: {
        prompt:
          "Quando o **premium de R$ 2,5 M/ano** do fornecedor local **se justifica isoladamente** (sem dual sourcing)?",
        choices: [
          {
            id: "rb_a",
            label:
              "Quando o **produto final tem margem alta** (40%+) e o cliente exige **\"sourced in Brazil\"** por motivo regulatório ou de marca — aí o premium pode ser repassado em parte, e o risco-país do single source local é compensado pela vantagem comercial.",
            correct: true,
            score: 25,
            feedback:
              "Correto e específico. Margem alta absorve premium; exigência regulatória/marca **monetiza** a origem local — defesa, equipamento médico estratégico, setores com conteúdo nacional mínimo (PPB). Em situações específicas, a aquisição local **vira receita** (cliente paga mais), não custo adicional. Fora desse contexto, dual sourcing é dominante porque captura resiliência sem pagar premium em 100% do volume.",
          },
          {
            id: "rb_b",
            label:
              "Quando o **diferencial de preço cai para ≤ 5%** — local sempre que economicamente viável.",
            correct: false,
            score: 10,
            feedback:
              "Boa intuição (preço aproximado, decisão muda), mas o critério **não é apenas o preço relativo** — também é a capacidade do fornecedor local, o risco-país, a estabilidade do câmbio (se BRL valoriza muito, internacional fica ainda mais barato). Decisão multi-fator, não single-trigger.",
          },
          {
            id: "rb_c",
            label:
              "Sempre — **resiliência sempre vence preço** após 2020.",
            correct: false,
            score: 0,
            feedback:
              "Visão pós-traumática que **superestima** evento de baixa probabilidade. Pandemia foi evento de cauda raro — pagar +R$ 2,5 M/ano em **todos** os SKUs como seguro contra evento que ocorre a cada 10-20 anos é trade-off ruim. Resiliência se compra **seletivamente** (dual sourcing nos críticos), não absolutamente.",
          },
          {
            id: "rb_d",
            label:
              "Nunca — em qualquer cenário, internacional + ES alto vence local + premium.",
            correct: false,
            score: 0,
            feedback:
              "Excesso oposto. Em produtos onde +15% é absorvível pela margem ou repassável ao cliente, local pode ser dominante. Decisão é **case-by-case**, não regra geral.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — Dual sourcing (70% internacional, 30% local)",
      shortLabel: "Dual 70/30",
      description:
        "Distribuir compras: **70% via fornecedor asiático**, **30% via fornecedor local**. ES misto cai para **11.707 unidades** (vs 16.648 do internacional puro). Custo total anual **R$ 19,22 milhões** — premium de **R$ 766 mil/ano** vs internacional puro. Compra resiliência preservando boa parte da vantagem de preço.",
      resultPanel: {
        headline: "Custo R$ 19,22 M/ano (+R$ 766 mil): resiliência crítica com premium aceitável",
        deltas: [
          { label: "Custo total anual", value: "R$ 19,22 M", tone: "neutral" },
          { label: "Δ vs Internacional puro", value: "+R$ 766 mil/ano", tone: "negative" },
          { label: "Δ vs Local puro", value: "−R$ 1,78 M/ano", tone: "positive" },
          { label: "ES total", value: "11.707 un (−30% vs internacional)", tone: "positive" },
          { label: "Capital liberado em ES", value: "+R$ 247 mil (one-off)", tone: "positive" },
          { label: "Resiliência a choque externo", value: "Alta (30% local cobre 60-90 dias)", tone: "positive" },
          { label: "Complexidade operacional", value: "Maior — gerir dois fornecedores", tone: "negative" },
        ],
        commentary:
          "**Solução de equilíbrio recomendada para a maioria das cadeias críticas pós-2020.** O premium de R$ 766 mil/ano é **30% do prêmio do local puro** e compra **80-90% da resiliência** — porque a parcela local de 30% representa **~110.000 unidades/ano** = ~110 dias de demanda, tempo suficiente para reorganizar sourcing internacional em caso de choque. ES misto cai 30% (de 16.648 para 11.707) porque o **σLT médio ponderado** é menor que o do internacional puro (7 vs 10 dias). Risco operacional: **gerir dois fornecedores** exige planejamento, alocação de pedidos e visibilidade dupla — custo de R$ 50-100 mil/ano em horas de comprador, embutido implicitamente no premium. Em cadeias críticas, é a política dominante a menos que a margem seja muito apertada ou o histórico operacional seja excepcionalmente estável.",
      },
      reflection: {
        prompt:
          "A parcela local de 30% custa R$ 766 mil/ano de premium. Em que situação esse premium **se paga literalmente** (não apenas em valor esperado)?",
        choices: [
          {
            id: "rc_a",
            label:
              "Quando ocorre **um único evento disruptivo na cadeia internacional** (4-8 semanas de paralisação) — a parcela local **mantém a linha operando** e evita perdas de margem que tipicamente excedem R$ 2-5 milhões em um trimestre de não-produção. O premium de R$ 766 mil/ano paga-se 3-7×.",
            correct: true,
            score: 25,
            feedback:
              "Correto e dimensionado. Em uma única disrupção de 6-8 semanas, **perda de margem por linha parada** (digamos, R$ 30 mil/dia × 50 dias = R$ 1,5 M) **excede em muito** o premium anual acumulado de R$ 766 mil. Dual sourcing **transfere o trade-off** de \"perda enorme rara\" para \"premium pequeno recorrente\" — gestão de risco financeiro padrão. Frequência esperada de eventos disruptivos significativos: 5-15% ao ano em rota asiática (pós-2020 elevou esse número). Esperança matemática favorece dual sourcing.",
          },
          {
            id: "rc_b",
            label:
              "Quando o BRL desvaloriza 20% — o premium do local se torna desconto.",
            correct: false,
            score: 5,
            feedback:
              "Verdade pontual (BRL fraco favorece local em preço relativo), mas **não é o motivo central** do dual sourcing. Câmbio é volátil em ambas as direções; a aposta de dual não deveria ser baseada em direção do FX. O motivo é **resiliência operacional**, não hedge cambial.",
          },
          {
            id: "rc_c",
            label:
              "Quando o **fornecedor local oferece desconto adicional** se passar a 30% do volume — aproximadamente equiparando o preço ao internacional.",
            correct: false,
            score: 10,
            feedback:
              "Ótimo cenário se conseguir negociar, mas **depende da capacidade do fornecedor local** e do **poder de barganha da Sigma**. Premissa raramente verificada em primeiro contrato; pode-se evoluir para isso com 12-24 meses de relacionamento, mas não é o cenário base do dimensionamento.",
          },
          {
            id: "rc_d",
            label:
              "Nunca — premium é custo afundado; resiliência é benefício intangível que não \"se paga\".",
            correct: false,
            score: 0,
            feedback:
              "Visão que **subestima eventos de cauda**. Resiliência **se paga literalmente** quando o evento ocorre — e em cadeias internacionais críticas, frequência é material (5-15% ao ano). Tratar como custo afundado leva a single sourcing por inércia, que é a doutrina que **fracassou em 2020**.",
          },
        ],
      },
    },
  ],
};
