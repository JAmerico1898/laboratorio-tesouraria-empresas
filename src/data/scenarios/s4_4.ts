import type { Scenario } from "@/types/scenario";

// =============================================================================
// S4.4 — Antecipação de recebíveis — banco × FIDC
// =============================================================================
// Premissas:
//
// Empresa: Indústria Phi (autopeças).
// Geração de duplicatas: R$ 12 M/mês = R$ 144 M/ano.
// Prazo médio das duplicatas: 45 dias.
// Carteira média antecipada: 100% das duplicatas (necessidade de funding
//   recorrente). Volume antecipado anual: ~R$ 144 M (estoque rotativo).
// CDI de referência: 11,75% a.a.
//
// Cenário A — Antecipação bancária tradicional (3 bancos)
//   Deságio médio: 2,5% a.m. composto + IOF 0,38% sobre principal + tarifa
//     bancária 0,15% por operação.
//   CET ≈ (1,025)^12 − 1 + 0,38% × (12/45 × 30) + 0,15% × 12
//        ≈ 34,5% + IOF ~3% + tarifa 1,8% ≈ 32,0% a.a. efetivo médio
//   Custo anual: 144 M × 32% × (45/360) = R$ 5.760 mil/ano
//     (forma simplificada: spread × volume × duration)
//   Vantagens: zero estruturação, flexibilidade total, sem comprometimento.
//
// Cenário B — FIDC próprio fechado
//   Custos fixos: administração R$ 15 mil/mês + custódia R$ 8 mil/mês +
//     auditoria R$ 5 mil/mês + gestor R$ 7 mil/mês = R$ 35 mil/mês = R$ 420 mil/ano
//   Custos variáveis: cota sênior CDI + 2,5% = 14,25% a.a.
//     Cota subordinada (perda esperada absorvida pelo originador): ~2%
//   Cota sênior representa ~85% do volume; subordinada 15% (cushion)
//   CET aprox: 85% × 14,25% + 15% × 0% (subordinada paga zero direto;
//     o originador recebe perda esperada) + 420k de custos fixos
//   CET total efetivo: ~22-24% a.a. (escala R$ 144 M dilui custos fixos)
//   Custo anual: 144 M × 23% × (45/360) = R$ 4.140 mil/ano + 420k fixos
//     = R$ 4.560 mil/ano
//   Economia vs banco: R$ 1.200 mil/ano (~21%)
//   Setup inicial: R$ 600-800 mil (estruturação CVM, prospecto,
//     governança), 4-6 meses para operar.
//
// Cenário C — FIDC multicedente (condomínio)
//   Adesão a fundo existente: setup R$ 80-150 mil, 6-8 semanas.
//   Custos fixos diluídos entre originadores: ~R$ 8-12 mil/mês
//   Cota sênior CDI + 3% = 14,75% a.a. (prêmio adicional por
//     pulverização e governança coletiva)
//   CET aprox: 25-27% a.a.
//   Custo anual: 144 M × 26% × (45/360) = R$ 4.680 mil/ano + 130k fixos
//     = R$ 4.810 mil/ano
//   Economia vs banco: R$ 950 mil/ano (~16,5%)
//   Setup mais rápido, menor compromisso estruturante.
// =============================================================================

export const S4_4: Scenario = {
  id: "s4_4",
  code: "S4.4",
  title: "Antecipação de recebíveis — banco × FIDC — Indústria Phi",
  company: "Indústria Phi S.A.",
  difficulty: "Avançado",
  estimatedMinutes: 24,
  context: {
    narrative:
      "Você é tesoureiro(a) da **Indústria Phi**, fabricante de autopeças que gera **R$ 12 milhões/mês em duplicatas** com prazo médio de **45 dias** — R$ 144 milhões/ano em volume antecipado para sustentar o capital de giro operacional. Atualmente, a empresa **antecipa 100% das duplicatas** via três bancos com **deságio médio de 2,5% a.m.** (CET aproximado de **32% a.a.** considerando IOF e tarifas), gastando **R$ 5,76 milhões/ano** em juros + tarifas. O CFO contratou um estudo para avaliar se vale **montar um FIDC próprio** (estruturação CVM, governança própria, escala suficiente) ou aderir a um **FIDC multicedente** (condomínio com outros originadores, setup rápido, menor compromisso). O comitê precisa avaliar CET efetivo, custos fixos, tempo de implantação e dependência operacional — sob CDI de referência de **11,75% a.a.**",
    keyFacts: [
      ["Geração mensal de duplicatas", "R$ 12,0 M/mês"],
      ["Volume antecipado anual", "R$ 144 M"],
      ["Prazo médio das duplicatas", "45 dias"],
      ["CDI de referência", "11,75% a.a."],
      ["CET antecipação bancária", "~32% a.a."],
      ["CET FIDC próprio (estimado)", "22-24% a.a."],
      ["CET FIDC multicedente (estimado)", "25-27% a.a."],
      ["Custo bancário atual", "R$ 5,76 M/ano"],
    ],
  },
  statements: [
    {
      id: "comparacao_estruturas",
      title: "Comparação de custos e estruturas (R$ mil)",
      unit: "R$ mil / % / meses",
      periods: ["A: Banco", "B: FIDC próprio", "C: FIDC multicedente"],
      sections: [
        {
          label: "Custo financeiro anual",
          rows: [
            { label: "CET efetivo (% a.a.)", values: [32.0, 23.0, 26.0], emphasis: "bold" },
            { label: "Custo variável anual (R$ mil)", values: [5760, 4140, 4680], indent: 1 },
            { label: "Custo fixo anual (R$ mil)", values: [0, 420, 130], indent: 1 },
            { label: "Custo total anual (R$ mil)", values: [5760, 4560, 4810], emphasis: "total" },
            { label: "Economia vs banco (R$ mil/ano)", values: [0, 1200, 950], emphasis: "bold" },
          ],
        },
        {
          label: "Estruturação e tempo de implantação",
          rows: [
            { label: "Custo de setup (R$ mil)", values: [0, 700, 115], indent: 1 },
            { label: "Tempo para operar (meses)", values: [0, 5, 1.5], indent: 1 },
            { label: "Payback do setup (meses)", values: [0, 7, 1.5], indent: 1 },
            { label: "Volume mínimo para viabilidade (R$ M/ano)", values: [0, 80, 30], indent: 1 },
          ],
        },
        {
          label: "Governança e flexibilidade",
          rows: [
            { label: "Complexidade governança (1-5)", values: [1, 5, 3], indent: 1 },
            { label: "Compromisso de volume (% obrigatório)", values: [0, 60, 40], indent: 1 },
            { label: "Diversificação de funding (1-5)", values: [3, 1, 4], indent: 1 },
            { label: "Reversibilidade (1=alta)", values: [1, 5, 3], indent: 1 },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Cálculo correto do CET bancário.** Por que o CET efetivo é **~32% a.a.** e não **30% a.a.** (12 × 2,5%)?",
      choices: [
        {
          id: "e1_a",
          label:
            "Porque (1) **2,5% a.m. composto** = (1,025)^12 − 1 = **34,5% a.a.** apenas com juros, (2) **IOF** sobre principal adiciona ~3% efetivo anual, (3) **tarifas bancárias** por operação somam mais 1-2%. CET correto considera os três; linearizar (12 × 2,5%) subestima sistematicamente.",
          correct: true,
          score: 20,
          feedback:
            "Correto e fundamental. **CET (Custo Efetivo Total)** é métrica regulada (BCB Res. 3.517) e deve incluir **todos os encargos** — juros (compostos, não lineares), IOF, tarifas, seguros embutidos. \"12 × 2,5%\" é o erro mais comum: ignora **composição** (que adiciona 4,5 pp ao ano) e ignora **encargos não-juros** (que adicionam 3-5 pp). Boa prática: sempre exigir do banco a **planilha CET** com todos os componentes, e refazer o cálculo internamente — bancos frequentemente apresentam só a taxa nominal.",
        },
        {
          id: "e1_b",
          label:
            "**12 × 2,5% = 30% a.a.** é o cálculo correto — composição mensal não se aplica em antecipação.",
          correct: false,
          score: 0,
          feedback:
            "**Composição se aplica sempre** que há juros sobre saldo devedor reinvestidos. Em antecipação de duplicatas, o spread é cobrado **na operação** (deságio sobre o valor de face), e essa operação **se repete mensalmente** — composição é matemática, não \"se aplica\" ou \"não se aplica\". Linearização **subestima** em 4-5 pp, levando a comparação enganosa.",
        },
        {
          id: "e1_c",
          label:
            "CET é **CDI + 2,5% × 12 = 11,75% + 30% = ~42% a.a.** somando CDI base.",
          correct: false,
          score: 0,
          feedback:
            "**CDI não soma duplo**. O deságio de 2,5% a.m. **já é spread sobre alguma base** — não se soma o CDI por cima. Em antecipação, o 2,5% é o **preço total** do dinheiro mensal; calcular composição mensal sobre ele dá CET.",
        },
        {
          id: "e1_d",
          label:
            "CET é **deságio × 12 = 30%** menos **CDI = 11,75%**, gerando **18,25% a.a. líquido** sobre o CDI.",
          correct: false,
          score: 0,
          feedback:
            "**Confunde CET com spread sobre CDI**. CET é o custo total absoluto que o tomador paga; spread sobre CDI é apenas um componente. Em antecipação a 32% a.a., o spread sobre CDI é ~20 pp — número diferente do CET.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Avaliar FIDC próprio.** Qual leitura é **estrategicamente correta**?",
      choices: [
        {
          id: "e2_a",
          label:
            "**Payback do setup é ~7 meses** (R$ 700k / R$ 1,2 M × 12). Economia recorrente substancial **a partir do 8º mês**, e a estrutura **gera dados próprios** (histórico de inadimplência, scoring interno) que apoiam outras decisões de tesouraria. Faz sentido para volume ≥ R$ 80 M/ano e necessidade recorrente projetada > 24 meses.",
          correct: true,
          score: 20,
          feedback:
            "Correto. **FIDC próprio é decisão estratégica**, não tática — investimento de R$ 700k + 5 meses justifica-se quando: (1) **volume atinge escala** (R$ 80-100 M/ano mínimo para diluir custos fixos), (2) **necessidade é recorrente** (não é solução para gap pontual), (3) **empresa tem governança madura** (comitês, auditoria, capacidade de compliance CVM). Benefícios secundários: histórico de carteira **vira ativo** que pode ser apresentado a bancos para melhorar condições futuras; cota subordinada **fica com originador**, criando alinhamento com a qualidade da originação.",
        },
        {
          id: "e2_b",
          label:
            "**Setup de R$ 700 mil é proibitivo** — empresa industrial deve focar em produção, não em estruturar veículos financeiros.",
          correct: false,
          score: 0,
          feedback:
            "Visão **provinciana** que desconsidera economia recorrente. R$ 700 mil com payback de 7 meses e ganho recorrente de R$ 1,2 M/ano é **investimento financeiro excelente** (TIR > 150% a.a.). \"Empresa não-financeira não estrutura FIDC\" é mito; **muitas indústrias brasileiras** (Iochpe, Eternit, Tigre, etc.) têm FIDC próprio há décadas como instrumento de capital de giro.",
        },
        {
          id: "e2_c",
          label:
            "**5 meses de implantação é tempo perdido** — durante esse período, paga-se 32% no banco. Melhor ir direto ao multicedente (1,5 meses).",
          correct: false,
          score: 10,
          feedback:
            "Argumento **válido** sobre time-to-market, mas **subestima ganho de longo prazo**: economia adicional de R$ 250k/ano (B vs C, R$ 1,2 M − R$ 950k) por **muitos anos**. Total NPV em 5 anos: B vence C por R$ 1+ milhão. Multicedente é correto se a empresa **prioriza velocidade** ou **incerteza sobre recorrência** do volume.",
        },
        {
          id: "e2_d",
          label:
            "**Comparar com WACC** — se WACC ≤ 23% (CET do FIDC próprio), seguir com banco (zero overhead).",
          correct: false,
          score: 0,
          feedback:
            "Comparação **errada de métricas**. WACC é custo de capital da empresa; CET é custo do funding **específico** da antecipação. A pergunta correta é: **qual fonte de funding tem o menor custo** para essa necessidade específica — e o FIDC (23%) é mais barato que banco (32%) por margem substancial. WACC não substitui análise marginal de fonte de funding.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Decidir entre B e C.** Qual é a **decisão dominante**?",
      choices: [
        {
          id: "e3_a",
          label:
            "**Depende do horizonte e da recorrência**: se a Phi tem certeza do volume recorrente por **3+ anos**, B é dominante (R$ 250k × 3 = R$ 750k de NPV adicional, paga setup duas vezes). Se há **incerteza** sobre o volume futuro (próximo plano estratégico em revisão), C é mais prudente — menor compromisso estruturante e fácil saída.",
          correct: true,
          score: 20,
          feedback:
            "Correto e nuançado. **Decisão entre B e C é sobre certeza do horizonte**, não sobre vantagem financeira pontual. NPV de B em 3 anos: economia adicional R$ 750k − setup adicional R$ 585k = +R$ 165k → B vence. NPV em 5 anos: economia R$ 1.250k − setup R$ 585k = +R$ 665k → B vence claramente. Mas **incerteza alta sobre volume** (M&A em curso, mudança estratégica) inverte: C oferece **opção real** de sair sem custo afundado significativo. Boa prática: comitê **declara horizonte de planejamento** antes de comparar.",
        },
        {
          id: "e3_b",
          label:
            "**B é sempre dominante** — economia recorrente vence custo fixo em qualquer horizonte.",
          correct: false,
          score: 5,
          feedback:
            "Em horizonte **curto** (< 2 anos), B perde — setup adicional de R$ 585k não é amortizado pela economia incremental anual de R$ 250k. Em empresa com incerteza estratégica alta (M&A, fechamento de unidade, mudança de modelo), C é dominante.",
        },
        {
          id: "e3_c",
          label:
            "**C é sempre dominante** — menor compromisso, mais flexibilidade, captura 80% do ganho.",
          correct: false,
          score: 10,
          feedback:
            "Captura **79% do ganho com 16% do custo de setup** (R$ 950k / R$ 1,2 M; R$ 115k / R$ 700k), mas em horizonte longo, R$ 250k/ano se acumula em montante material — **R$ 1,25 M em 5 anos**. \"Sempre\" ignora dimensão temporal. C é dominante em horizonte curto-médio (< 3 anos) ou em alta incerteza.",
        },
        {
          id: "e3_d",
          label:
            "**Combinar B e C** — 60% volume via FIDC próprio + 40% via multicedente para diversificar.",
          correct: false,
          score: 5,
          feedback:
            "Lógica de diversificação que **não compensa custo fixo duplo**: rodar dois veículos simultaneamente multiplica governança, comitês e auditorias. Diversificação de funding em FIDC já está em **dentro da estrutura** (múltiplas cotas seniores podem ser distribuídas a múltiplos investidores). Combinação dois veículos é antipadrão de gestão de tesouraria.",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Antecipação bancária tradicional (3 bancos)",
      shortLabel: "Banco",
      description:
        "Continuar com antecipação pulverizada em **3 bancos de relacionamento**, deságio médio **2,5% a.m.** (CET ~32% a.a.). Custo total **R$ 5,76 M/ano**. Zero investimento estruturante, flexibilidade total. Adequado para volumes baixos, necessidade não-recorrente, ou empresas sem governança madura.",
      resultPanel: {
        headline: "Custo R$ 5,76 M/ano, CET 32%: sem investimento, mas paga prêmio enorme pela flexibilidade",
        deltas: [
          { label: "CET efetivo", value: "~32% a.a.", tone: "negative" },
          { label: "Custo anual", value: "R$ 5,76 M", tone: "negative" },
          { label: "Custo de setup", value: "R$ 0", tone: "positive" },
          { label: "Tempo para operar", value: "Imediato", tone: "positive" },
          { label: "Δ vs FIDC próprio", value: "+R$ 1,2 M/ano (mais caro)", tone: "negative" },
          { label: "Flexibilidade", value: "Total — pode parar a qualquer momento", tone: "positive" },
          { label: "Risco de funding (capacidade dos 3 bancos)", value: "Médio — depende de apetite recorrente", tone: "neutral" },
        ],
        commentary:
          "**Política dominante apenas em contextos específicos**: volume anual < R$ 80 M (FIDC não dilui custos fixos), necessidade pontual ou sazonal (não recorrente o ano inteiro), empresa sem governança madura para sustentar FIDC, ou em fase de transição corporativa (M&A, mudança de modelo) que torna estruturação prematura. Em qualquer cenário recorrente com volume material como o da Phi, **deixar R$ 1,2 M/ano em cima da mesa** é difícil de justificar tecnicamente — o argumento real é tipicamente **falta de capacidade organizacional** para estruturar, não economia.",
      },
      reflection: {
        prompt:
          "Qual é o **principal risco oculto** de depender 100% de antecipação bancária no longo prazo?",
        choices: [
          {
            id: "ra_a",
            label:
              "**Concentração de funding** — os 3 bancos podem **ajustar apetite** (reduzir limites, aumentar deságio, exigir reciprocidade adicional) em ciclos de aperto monetário, ciclo de crédito ruim, ou se a Phi enfrentar deterioração de rating. Sem FIDC alternativo, a empresa fica **refém da decisão dos bancos**.",
            correct: true,
            score: 25,
            feedback:
              "Correto e crítico. **Bancos não têm compromisso de manutenção** — em ciclos adversos (2015-2016, 2020 inicial, 2022 pós-Selic alta), reduziram limites de antecipação em 20-50% para clientes não-estratégicos. Empresa que depende exclusivamente dessa modalidade **perde capacidade de financiar capital de giro** justamente quando precisa mais. FIDC oferece **diversificação estrutural** — cotistas são investidores institucionais com mandato próprio, menos correlacionados a ciclo bancário. Boa prática: ter **fonte alternativa estruturada** (FIDC, próprio ou multicedente) **mesmo se for menor escala** — opção real importa mais que pequena economia.",
          },
          {
            id: "rb_b",
            label:
              "**IOF pode subir** — alíquota é decisão fiscal e pode ser ajustada.",
            correct: false,
            score: 5,
            feedback:
              "Risco real mas **secundário** — IOF subiu pontualmente em 2022 (de 0,38% para 0,95%) e voltou em 2024. Impacto material mas gerenciável; afeta FIDC também (estruturas têm IOF embutido). Não é o risco principal de concentração bancária.",
          },
          {
            id: "ra_c",
            label:
              "**Reputação** — empresas que antecipam muito \"parecem\" descapitalizadas no mercado.",
            correct: false,
            score: 0,
            feedback:
              "**Mito desatualizado**. Antecipação é instrumento normal de capital de giro em B2B — não sinaliza descapitalização. Bancos, investidores e clientes entendem como gestão de fluxo de caixa, não fragilidade. Reputação não é risco material aqui.",
          },
          {
            id: "ra_d",
            label:
              "**Custo administrativo** — gerenciar 3 contratos bancários consome tempo do time.",
            correct: false,
            score: 5,
            feedback:
              "Custo real mas **menor** — gerir 3 contratos bancários consome talvez 5-10% do tempo de uma pessoa. FIDC consome mais (comitês, auditorias, prestadores). Custo administrativo não é o risco principal; concentração de funding é.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — FIDC próprio fechado",
      shortLabel: "FIDC próprio",
      description:
        "Estruturar **FIDC fechado** dedicado às duplicatas da Phi. Setup **R$ 700 mil** (CVM, prospecto, prestadores), **5 meses** para operar. CET efetivo **~23% a.a.**, custo total **R$ 4,56 M/ano**. Economia **R$ 1,2 M/ano** (~21%). Governança própria, escala permite diluição de custos fixos.",
      resultPanel: {
        headline: "Economia R$ 1,2 M/ano (−21%), payback do setup em 7 meses — para volume e horizonte recorrentes",
        deltas: [
          { label: "CET efetivo", value: "~23% a.a.", tone: "positive" },
          { label: "Custo anual", value: "R$ 4,56 M", tone: "positive" },
          { label: "Δ vs banco", value: "−R$ 1,2 M/ano", tone: "positive" },
          { label: "Custo de setup", value: "R$ 700 mil (one-off)", tone: "negative" },
          { label: "Tempo para operar", value: "5 meses", tone: "negative" },
          { label: "Payback do setup", value: "~7 meses", tone: "positive" },
          { label: "Governança exigida", value: "Alta — comitê, auditoria, CVM", tone: "negative" },
        ],
        commentary:
          "**Política dominante para volumes recorrentes acima de R$ 100 M/ano com governança madura.** Economia de R$ 1,2 M/ano (21% do custo bancário) **acumula em montante material** ao longo dos anos — R$ 6 M em 5 anos. Benefícios secundários relevantes: (1) **independência operacional** de apetite bancário; (2) **dados próprios** de inadimplência da carteira (vira ativo informacional); (3) **alinhamento via cota subordinada** (originador absorve perda esperada, gera disciplina de originação); (4) **possibilidade de evoluir** para FIDC aberto ou estruturações mais sofisticadas (cotas mezanino, securitização de safras). Risco principal: **dependência de governança recorrente** — comitês mensais, auditoria, conformidade CVM. Time de tesouraria precisa **ter capacidade ou contratar** prestadores especializados.",
      },
      reflection: {
        prompt:
          "FIDC próprio gera **economia recorrente substancial** mas exige governança contínua. Quando essa governança vira **peso operacional** que justifica migrar para multicedente?",
        choices: [
          {
            id: "rb_a",
            label:
              "Quando a empresa enfrenta **mudança estratégica relevante** (M&A, joint venture, pivot de negócio) que reduz o **volume projetado** ou cria **incerteza sobre recorrência** — o ganho marginal não compensa a sobrecarga de manter FIDC dedicado com volume em queda.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **FIDC próprio precisa de escala constante** para diluir custos fixos (R$ 420 mil/ano são fixos, independentes do volume). Se volume cai de R$ 144 M para R$ 60-80 M (M&A vendeu unidade, pivot de produto, etc.), a economia desaparece — custo fixo passa a corroer a vantagem. Multicedente **escala melhor para baixo** porque custos fixos são diluídos com outros originadores. Boa prática: **revisar viabilidade do FIDC próprio anualmente** com base em volume projetado dos próximos 24 meses.",
          },
          {
            id: "rb_b",
            label:
              "Quando a equipe de tesouraria **rotaciona** — novo tesoureiro pode preferir simplicidade.",
            correct: false,
            score: 5,
            feedback:
              "Decisão **não pode depender de preferência pessoal** do tesoureiro — FIDC é estrutura que sobrevive à rotação de pessoa. Boa governança documenta processo e capacita sucessor; \"preferência\" do novo é argumento fraco para mudança que destrói R$ 250k/ano de economia.",
          },
          {
            id: "rb_c",
            label:
              "Quando o CDI cai abaixo de 8% a.a. — em juros baixos, economia em FIDC vira marginal.",
            correct: false,
            score: 10,
            feedback:
              "**CDI baixo reduz** economia absoluta (spread sobre CDI menor em moeda), mas o **diferencial entre estruturas** se mantém — banco continua sendo mais caro que FIDC por mecanismo (markup vs custo direto). Em CDI baixo, economia pode cair de R$ 1,2 M para R$ 700-900 mil/ano — ainda material, ainda paga setup.",
          },
          {
            id: "rb_d",
            label:
              "Nunca — FIDC próprio é sempre superior quando o volume justifica.",
            correct: false,
            score: 5,
            feedback:
              "Visão **estática** que ignora ciclo de negócio. Empresas mudam, volumes mudam, prioridades mudam. Manter FIDC próprio \"para sempre\" sem reavaliar é tão errado quanto não montar inicialmente — boa governança **revisa** decisões estruturantes periodicamente.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — FIDC multicedente (condomínio)",
      shortLabel: "FIDC multicedente",
      description:
        "Aderir a **FIDC multicedente existente** com outros originadores. Setup **R$ 115 mil**, **1,5 mês** para operar. CET ~26% a.a. (prêmio adicional pela governança coletiva). Custo total **R$ 4,81 M/ano**. Economia **R$ 950 mil/ano** (~16,5%). Setup rápido, menor compromisso estruturante.",
      resultPanel: {
        headline: "Economia R$ 950 mil/ano com setup em 6 semanas — sweet spot entre velocidade e economia",
        deltas: [
          { label: "CET efetivo", value: "~26% a.a.", tone: "positive" },
          { label: "Custo anual", value: "R$ 4,81 M", tone: "positive" },
          { label: "Δ vs banco", value: "−R$ 950 mil/ano", tone: "positive" },
          { label: "Δ vs FIDC próprio", value: "+R$ 250 mil/ano (mais caro)", tone: "negative" },
          { label: "Custo de setup", value: "R$ 115 mil (one-off)", tone: "positive" },
          { label: "Tempo para operar", value: "6 semanas", tone: "positive" },
          { label: "Payback do setup", value: "~1,5 mês", tone: "positive" },
        ],
        commentary:
          "**Sweet spot para a maioria das empresas brasileiras** com volume entre R$ 30 M e R$ 100 M/ano ou para empresas maiores em fase de avaliação antes de FIDC próprio. Captura **79% do ganho do FIDC próprio com 16% do setup e 30% do tempo**. Vantagens adicionais: (1) **governança compartilhada** (administrador, custodiante e gestor são da estrutura, não precisam ser contratados); (2) **menor compromisso de volume** (sai com aviso de 30-60 dias tipicamente); (3) **diversificação automática** (cota sênior absorve risco médio da carteira agregada). Limitação: **homogeneização da carteira** — fundo aceita papéis dentro de padrão definido (ratings, prazo, concentração), podendo recusar safras atípicas; **menor flexibilidade** que FIDC próprio. Risco operacional: **dependência da gestora do fundo** — se gestora muda política, originador pode precisar migrar.",
      },
      reflection: {
        prompt:
          "Multicedente é \"sweet spot\". Em que cenário **B (próprio) é claramente dominante** sobre C?",
        choices: [
          {
            id: "rc_a",
            label:
              "Quando a Phi tem **volume estável e crescente** (R$ 150 M+/ano projetado para 5+ anos), **governança madura** (comitês operantes, capacidade de absorver compliance CVM) e **expectativa de evoluir** para estruturas mais sofisticadas (cota mezanino, securitização de safras específicas) — onde FIDC próprio é base estrutural, não solução pontual.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **B é estratégico, C é tático.** Quando a Phi enxerga capital de giro estruturado como **vantagem competitiva sustentável** (taxa menor que concorrentes = pode oferecer prazos maiores aos clientes ou comprimir preço sem perder margem), FIDC próprio é a base — e R$ 250k/ano de economia adicional **se acumula** em montante material. Em 10 anos: R$ 2,5 M de economia adicional + benefícios estratégicos (cota subordinada como ativo informacional, capacidade de estruturação personalizada). Boa prática: começar com C, evoluir para B em 2-3 anos quando volume e governança maturarem.",
          },
          {
            id: "rc_b",
            label:
              "Quando **R$ 250 mil/ano de economia adicional** é material para o resultado da empresa.",
            correct: false,
            score: 10,
            feedback:
              "Verdade simples (R$ 250k é material em qualquer empresa de R$ 150 M de receita), mas **incompleta** — esquece a dimensão estratégica e o horizonte temporal. \"B é dominante quando dinheiro é importante\" é tautologia; pergunta era específica sobre **contexto estratégico**.",
          },
          {
            id: "rc_c",
            label:
              "Quando a Phi **quer ter controle total** sobre prestadores e cotistas — multicedente impõe estrutura padrão.",
            correct: false,
            score: 10,
            feedback:
              "Argumento **válido** sobre flexibilidade, mas \"controle\" é meio, não fim. Sem propósito estratégico que justifique controle (segregação de carteiras, estruturação custom, alinhamento com investidor específico), \"controle\" sozinho não compensa custo e governança adicional. B só é dominante quando há **uso estratégico** do controle, não pelo controle em si.",
          },
          {
            id: "rc_d",
            label:
              "Nunca — multicedente é sempre superior por simplicidade.",
            correct: false,
            score: 0,
            feedback:
              "Visão que **ignora escala**. Em volumes R$ 150+ M/ano, custos fixos do FIDC próprio (R$ 420k/ano) são diluídos em fração mínima do volume (0,3%), enquanto o prêmio de governança coletiva do multicedente (R$ 250k/ano) é custo direto. Em escala, B é dominante.",
          },
        ],
      },
    },
  ],
};
