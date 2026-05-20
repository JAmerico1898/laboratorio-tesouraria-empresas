import type { Scenario } from "@/types/scenario";

// =============================================================================
// S3.4 — Decisão de adoção de JIT em Indústria Mecânica
// =============================================================================
// Premissas:
//
// Empresa: Indústria Mecânica Lambda.
// Receita anual = R$ 90 M. CMV anual = R$ 65 M.
// Estoque atual: 75 dias de CMV = R$ 13,5 M (modelado para o exercício como
//   R$ 18 M considerando estoque de fábrica + filial + WIP avançado).
// Custo de carregamento: 22% a.a. → R$ 3,96 M/ano sobre R$ 18 M.
//
// Pré-requisitos para JIT:
//   1. Cadeia de fornecimento concentrada/local (≤ 200 km e ≤ 3 fornecedores
//      principais) — Lambda atende parcialmente (60% local, 40% importado).
//   2. Demanda estável (CV < 0,15 mensal) — Lambda CV = 0,11 (✓).
//   3. ERP integrado com EDI/portal fornecedor — Lambda tem SAP, mas EDI
//      cobre apenas 40% dos fornecedores (parcial).
//   4. Time treinado em lean — Lambda fez piloto em uma célula em 2024 (parcial).
//   5. Sponsor sênior (CEO ou COO) — ativo (CEO patrocinou).
// Score: 3 atendidos plenamente, 2 parciais → exige fase preparatória.
//
// Cenário A — Implantação completa em 24 meses
//   Alvo de estoque pós-JIT: 10 dias = R$ 1,8 M
//   Liberação de capital: 18,0 − 1,8 = R$ 16,2 M
//   Ganho carregamento anual: 16,2 × 22% = R$ 3,56 M/ano
//   Custo de implantação: R$ 3,0 M em 24 meses
//     - Treinamento intensivo (R$ 600 k)
//     - Integração EDI fornecedores (R$ 800 k)
//     - Layout fabril e mizusumashi (R$ 900 k)
//     - Consultoria lean (R$ 700 k)
//   Payback: 10-12 meses após estabilização
//   Risco operacional: alto durante transição (ruptura, paradas)
//   Adequado: sponsor + fornecedores parceiros + margem para tropeçar
//
// Cenário B — Implantação parcial — apenas top 20% SKUs (classe A)
//   Aplica JIT em ~120 SKUs (de 600) que respondem por 80% do CMV.
//   Estoque-alvo desses SKUs: 12 dias (vs 75 atual)
//   Liberação: 0,8 × 18 × (75−12)/75 = 12,1 M (mas tira só do segmento A)
//   Estoque dos demais SKUs: mantém 75 dias = 0,2 × 18 = R$ 3,6 M
//   Estoque total pós: ~5,5 M (vs 18 M)
//   Liberação: R$ 12,5 M
//   Ganho carregamento: 12,5 × 22% = R$ 2,75 M/ano
//   Custo implantação: R$ 1,0 M em 12 meses
//   Payback: 5-7 meses
//   Risco operacional: baixo (escopo focado)
//   Adequado: primeira incursão em JIT, time aprendendo, governança nova
//
// Cenário C — Não migrar — manter sistema atual + melhorias incrementais
//   Aplicar ABC + EOQ + ES otimizado nos 600 SKUs
//   Redução de estoque: −15% = R$ 2,7 M de liberação
//   Ganho carregamento: 0,6 M/ano
//   Custo implantação: R$ 200 k (refinamento de políticas)
//   Risco: zero — mantém modelo conhecido
//   Adequado: cadeia sem pré-requisitos, ciclo macro adverso, sponsor fraco
// =============================================================================

export const S3_4: Scenario = {
  id: "s3_4",
  code: "S3.4",
  title: "Decisão de adoção de JIT — Indústria Mecânica Lambda",
  company: "Indústria Mecânica Lambda S.A.",
  difficulty: "Avançado",
  estimatedMinutes: 24,
  context: {
    narrative:
      "Você é diretor(a) de operações da **Indústria Mecânica Lambda**, fabricante de equipamentos rodoviários com **receita anual de R$ 90 milhões** e **CMV de R$ 65 milhões**. O estoque atual representa **75 dias** (R$ 18 milhões considerando fábrica, filial e WIP avançado), com **custo de carregamento de 22% a.a.** — quase **R$ 4 milhões/ano** apenas em capital empatado. O CEO trouxe da última feira do setor a ideia de **migrar para Just-in-Time (JIT)**, inspirado em fabricantes japoneses e europeus que operam com 7-15 dias de estoque. O comitê quer uma análise honesta: a Lambda tem **3 pré-requisitos plenamente atendidos** (demanda estável, sponsor ativo, ERP SAP) e **2 parciais** (cadeia 60% local / 40% importada, EDI apenas em 40% dos fornecedores, time com piloto lean em uma célula). Há três caminhos sobre a mesa — adoção completa em 24 meses, adoção parcial focada em top 20% dos SKUs, ou não migrar e apenas refinar a gestão atual.",
    keyFacts: [
      ["Receita anual", "R$ 90,0 M"],
      ["CMV anual", "R$ 65,0 M"],
      ["Estoque atual", "R$ 18,0 M (≈ 75 dias)"],
      ["Custo de carregamento", "22% a.a. = R$ 3,96 M/ano"],
      ["SKUs ativos", "≈ 600"],
      ["Cadeia local / importada", "60% / 40%"],
      ["EDI / portal fornecedor", "40% dos fornecedores"],
      ["Sponsor sênior", "CEO ativo"],
    ],
  },
  statements: [
    {
      id: "comparacao_caminhos",
      title: "Adoção de JIT — comparação dos três caminhos",
      unit: "R$ milhões / dias / meses",
      periods: ["A: JIT completo", "B: JIT parcial (top 20%)", "C: Não migrar"],
      sections: [
        {
          label: "Alvo de estoque e liberação de capital",
          rows: [
            { label: "Estoque pós-projeto (R$ M)", values: [1.8, 5.5, 15.3], emphasis: "bold" },
            { label: "Estoque pós (dias de CMV)", values: [10, 30, 64], indent: 1 },
            { label: "Liberação de capital (R$ M)", values: [16.2, 12.5, 2.7], emphasis: "total" },
          ],
        },
        {
          label: "Ganho financeiro recorrente",
          rows: [
            { label: "Ganho em carregamento (R$ M/ano)", values: [3.56, 2.75, 0.6], emphasis: "bold" },
            { label: "Custo de implantação (R$ M, one-off)", values: [3.0, 1.0, 0.2], indent: 1 },
            { label: "Payback estimado (meses)", values: [11, 6, 4], emphasis: "subtotal" },
            { label: "Horizonte do projeto (meses)", values: [24, 12, 6], indent: 1 },
          ],
        },
        {
          label: "Risco operacional e organizacional",
          rows: [
            { label: "Risco de ruptura durante transição (1-5)", values: [4, 2, 1], indent: 1 },
            { label: "Esforço organizacional (1-5)", values: [5, 3, 2], indent: 1 },
            { label: "Reversibilidade (1=alta, 5=baixa)", values: [4, 2, 1], indent: 1 },
            { label: "Pré-requisitos atendidos (de 5)", values: [3, 5, 5], indent: 1 },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Avaliar pré-requisitos.** Qual leitura é **honesta** desse diagnóstico?",
      choices: [
        {
          id: "e1_a",
          label:
            "**JIT completo (cenário A) exige fase preparatória de 12-18 meses** para fechar os gaps: desenvolver fornecedores locais que substituam os 40% importados (ou negociar SLA com penalidade), expandir EDI/portal para 80%+ dos fornecedores, treinar o time além da célula-piloto. Sem essa preparação, A vira projeto com alto risco de ruptura.",
          correct: true,
          score: 20,
          feedback:
            "Correto e maduro. **JIT não é \"ligar uma chave\"** — pré-requisitos parciais são **passivos operacionais** que afloram em produção real. Cadeia 40% importada significa LT longo e variável (irreconciliável com JIT); EDI em 40% significa pedidos manuais para 60% dos fornecedores (irreconciliável com cadência diária). Boa prática: **18 meses de fase preparatória** para fechar gaps, depois 24 meses de rollout. Quem pula a preparação \"para acelerar\" sofre ruptura constante nos primeiros 6 meses e o CEO desiste do JIT. Alternativa: começar com **cenário B** (parcial em top 20%) onde os pré-requisitos podem ser atendidos no escopo focado.",
        },
        {
          id: "e1_b",
          label:
            "**3 de 5 já é maioria** — partir para implantação completa (A) imediatamente; os gaps se resolvem no processo.",
          correct: false,
          score: 5,
          feedback:
            "Visão otimista que **subestima dor de transição**. Em JIT, pré-requisitos **não atendidos** não são detalhes — são pontos de falha que param a linha. Cadeia 40% importada com LT de 45-60 dias **é incompatível** com inventário de 10 dias; ruptura é matemática. Resolver \"no processo\" significa **sofrer rupturas reais por 6-12 meses** enquanto se reorganiza fornecedores — risco organizacional altíssimo, frequentemente fatal para o sponsorship do projeto.",
        },
        {
          id: "e1_c",
          label:
            "**Pré-requisitos parciais inviabilizam JIT** — descartar cenários A e B, ir direto para C (não migrar).",
          correct: false,
          score: 5,
          feedback:
            "Excesso oposto. Parciais **podem ser fechados** com 12-18 meses de preparação (cenário A) ou **circundados** com escopo focado em top 20% (cenário B) — segmento onde a Lambda provavelmente atende todos os pré-requisitos. Descartar JIT completamente é abrir mão de **R$ 12-16 M de liberação de capital** sem necessidade. C é correto **se** não houver capacidade organizacional para fase preparatória.",
        },
        {
          id: "e1_d",
          label:
            "Os pré-requisitos são **referenciais teóricos** — empresas brasileiras adaptam o JIT a sua realidade local, e o Lambda já tem o suficiente.",
          correct: false,
          score: 0,
          feedback:
            "Confunde **adaptação contextual** (legítima) com **negação de fundamentos** (perigosa). JIT funciona porque **elimina buffer** — se a cadeia não consegue entregar com confiabilidade, JIT é puro risco. \"Empresa brasileira adapta\" é narrativa que justifica não fazer o trabalho de preparação, e foi a causa direta do fracasso de muitos projetos JIT no Brasil nos anos 2000-2010.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Quantificar o ganho.** Qual é a **leitura defensável** do trade-off A vs B?",
      choices: [
        {
          id: "e2_a",
          label:
            "**B captura 77% do ganho de A com 33% do custo de implantação, 50% do tempo e risco operacional muito menor.** Em qualquer cenário onde a fase preparatória de A é incerta ou o sponsor pode rotacionar, B é dominante — entrega valor cedo, prova o método e abre janela para evoluir para A no ano 3-4.",
          correct: true,
          score: 20,
          feedback:
            "Correto e típico de tomador de decisão experiente. **Cenário B é o sweet spot** porque (1) captura a maior parte do ganho, (2) reduz risco organizacional ao escopo administrável, (3) **gera caso de sucesso** que destrava aprovação e investimento maior. Risco de ir direto ao A: cada rupture severa em mês 4-6 **mata o projeto** (CEO retira sponsorship, time perde fé) — e tudo o que se conseguiu fica para trás. Política sequencial: **B nos meses 1-12, fase preparatória para gaps nos meses 6-18, A no ano 2-3** se os indicadores autorizarem.",
        },
        {
          id: "e2_b",
          label:
            "**A é dominante** — entrega R$ 3,56 M/ano vs R$ 2,75 M/ano (+30%). Em finanças, sempre escolher o maior NPV.",
          correct: false,
          score: 5,
          feedback:
            "Olha apenas o **valor de regime** — ignora **risco de execução**. A diferença de R$ 810 mil/ano entre A e B é importante, mas a **probabilidade de A entregar plenamente é menor** que a de B (escopo maior, mais pré-requisitos a fechar, sponsor a manter por 24 meses, time a treinar). NPV ajustado a risco frequentemente favorece B em projetos transformacionais. Maximizar NPV nominal é a forma mais comum de fracassar em projetos de transformação operacional.",
        },
        {
          id: "e2_c",
          label:
            "**C é dominante** — payback de 4 meses, risco zero. Os R$ 0,6 M/ano são suficientes para o porte da empresa.",
          correct: false,
          score: 5,
          feedback:
            "Subestima drasticamente o ganho disponível. R$ 0,6 M/ano vs R$ 2,75 M/ano (cenário B) é diferença **enorme** em empresa de R$ 90 M de receita — 2,4% do faturamento adicional em margem operacional. C é correto **só** se não houver capacidade organizacional para qualquer projeto transformacional; em qualquer outro contexto, B domina.",
        },
        {
          id: "e2_d",
          label:
            "**A e B são equivalentes** — ambos geram payback < 12 meses, então a escolha é indiferente.",
          correct: false,
          score: 5,
          feedback:
            "Payback é métrica grosseira — não captura **risco de execução, reversibilidade ou impacto organizacional**. A e B podem ter paybacks parecidos em planilha, mas perfis de risco muito diferentes. Decisão entre A e B é sobre **maturidade organizacional**, não sobre payback.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Estruturar a transição.** Qual sequência de implantação **minimiza risco**?",
      choices: [
        {
          id: "e3_a",
          label:
            "**Fase 1 (meses 1-3): selecionar 20-30 SKUs** dos 120 top (não todos), com fornecedores **já EDI-habilitados e localizados**. **Fase 2 (meses 4-9): expandir para 50-80 SKUs**, desenvolvendo fornecedores em paralelo. **Fase 3 (meses 10-12): escalar para os 120 SKUs**, com cadência diária estabilizada.",
          correct: true,
          score: 20,
          feedback:
            "Correto — sequência **gradual e controlada**. Começar com **20-30 SKUs em fornecedores já maduros** permite (1) testar o modelo sem risco material, (2) refinar processos com baixo blast radius, (3) **gerar caso interno** que convence os 30+ fornecedores que precisarão se adaptar. Cada fase **valida** a anterior antes de escalar. Boa prática: estabelecer **gate de revisão** entre fases (KPIs: ruptura < 1%, lead time efetivo < 7 dias, aderência ao kanban > 95%) — se gate falhar, **não escala** até resolver.",
        },
        {
          id: "e3_b",
          label:
            "**Big bang**: lançar os 120 SKUs simultaneamente no mês 1, para maximizar impacto e demonstrar comprometimento.",
          correct: false,
          score: 0,
          feedback:
            "**Antipadrão clássico** de transformação. Big bang em 120 SKUs maximiza **probabilidade de falha catastrófica** — qualquer SKU com fornecedor mal preparado vira ruptura, e ruptura em 1-2 SKUs **derruba a linha inteira** em produção integrada. Fracassos públicos no mês 1 matam o projeto. Implantação gradual é **regra fundamental** de gestão de mudança operacional.",
        },
        {
          id: "e3_c",
          label:
            "**Começar pelos SKUs mais difíceis** (com fornecedores importados) — se funcionar nos piores, funciona em todos.",
          correct: false,
          score: 0,
          feedback:
            "Inverte a lógica. Começar pelo difícil **maximiza** chance de falha precoce — e falha precoce em projeto transformacional **mata o sponsorship**. Princípio de gestão de mudança: **demonstrar sucesso cedo no fácil** (\"quick wins\") para destravar tempo e paciência para o difícil depois. Engenharia faz \"stress test\" no fim, não no início.",
        },
        {
          id: "e3_d",
          label:
            "**Selecionar por sorteio** entre os 120 SKUs — evita viés e gera amostra representativa.",
          correct: false,
          score: 0,
          feedback:
            "Sorteio em projeto de transformação organizacional é **negação de gestão**. Critério deve ser **probabilidade de sucesso** (fornecedores prontos, criticidade operacional baixa, volume manejável) — não aleatoriedade. Amostra representativa é objetivo de **pesquisa estatística**, não de **rollout de projeto**.",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Implantação completa em 24 meses",
      shortLabel: "JIT completo",
      description:
        "Implantação de JIT em **todos os SKUs** ao longo de 24 meses. Estoque-alvo **10 dias** (vs 75 atuais). Liberação de **R$ 16,2 M** e ganho recorrente de **R$ 3,56 M/ano**. Custo de implantação **R$ 3 M** (treinamento, EDI, layout, consultoria). Exige fase preparatória de 12-18 meses para fechar gaps de pré-requisitos.",
      resultPanel: {
        headline: "Liberação R$ 16,2 M + ganho R$ 3,56 M/ano, mas exige 24 meses e alto risco operacional",
        deltas: [
          { label: "Liberação de capital (one-off)", value: "R$ 16,2 M", tone: "positive" },
          { label: "Ganho de carregamento", value: "R$ 3,56 M/ano", tone: "positive" },
          { label: "Custo de implantação", value: "R$ 3,0 M (one-off)", tone: "negative" },
          { label: "Payback", value: "≈ 11 meses pós-estabilização", tone: "positive" },
          { label: "Horizonte do projeto", value: "24 meses (+ fase preparatória)", tone: "negative" },
          { label: "Risco de ruptura na transição", value: "Alto — 6-12 meses críticos", tone: "negative" },
          { label: "Dependência de sponsor", value: "Crítica por 30+ meses", tone: "negative" },
        ],
        commentary:
          "**Política dominante apenas com sponsor estável de 30+ meses + fornecedores parceiros estratégicos + capacidade financeira para tropeçar.** O ganho máximo (R$ 3,56 M/ano) é real, mas vem com **alta carga de execução** — 600 SKUs migrando para cadência diária exige time grande de planejamento, fornecedores treinados, EDI universal e capacidade de recuperação rápida de qualquer falha. Em empresas brasileiras médias, fracasso em JIT pleno é comum por **subestimar pré-requisitos** e por **rotação de sponsor** antes da estabilização. Recomenda-se **executar B primeiro** (12 meses), aprender, depois evoluir para A no ano 2-3 com pré-requisitos já fechados.",
      },
      reflection: {
        prompt:
          "Se a fase preparatória (12-18 meses) **for descartada** para acelerar a entrega do projeto, qual é a consequência mais provável nos primeiros 6 meses de rollout?",
        choices: [
          {
            id: "ra_a",
            label:
              "**Rupturas frequentes** (5-15 episódios por mês), perdas de produção entre **R$ 200-500 mil/mês**, queda no nível de serviço ao cliente — e **retirada de sponsorship pelo CEO** ao primeiro trimestre ruim. Projeto é arquivado, capital de implantação **R$ 3 M vira sunk cost**.",
            correct: true,
            score: 25,
            feedback:
              "Correto e dolorosamente realista. **Pular preparação em projeto transformacional é a fórmula de fracasso mais previsível**. A matemática é simples: cadeia com 40% importado e EDI em 40% dos fornecedores **não consegue** sustentar estoque de 10 dias — ruptura é certeza, não risco. CEO que aprovou projeto perde credibilidade política ao primeiro trimestre ruim e tipicamente **abandona o projeto** para preservar carreira. Lição: **preparação é parte integral do projeto**, não overhead que se possa cortar para acelerar.",
          },
          {
            id: "ra_b",
            label:
              "**Pequenas dificuldades iniciais, mas equipe aprende rápido** — projeto entrega em 20 meses em vez de 24, com ganho similar.",
            correct: false,
            score: 0,
            feedback:
              "Narrativa **otimista que ignora estatística de projetos JIT no Brasil**. Pulando preparação, a taxa de fracasso histórica é **60-80%** (vs 30-40% com preparação plena). \"Aprender rápido\" assume que o time tem capacidade ociosa para reagir a falhas — em produção real, falhas em cascata superam capacidade de resposta.",
          },
          {
            id: "ra_c",
            label:
              "**Custo de implantação aumenta** (R$ 4-5 M em vez de R$ 3 M) mas projeto ainda entrega, com payback estendido para 18 meses.",
            correct: false,
            score: 5,
            feedback:
              "Captura parte do efeito (custo extra de remediar gaps em produção), mas **subestima o risco binário**: pular preparação não \"aumenta o custo um pouco\" — frequentemente **mata o projeto**. Custo extra de execução remediada é o **melhor cenário** de quem pula preparação; pior cenário (mais comum) é arquivamento.",
          },
          {
            id: "ra_d",
            label:
              "**Sem consequência** — JIT é robusto e absorve gaps de pré-requisitos no rollout.",
            correct: false,
            score: 0,
            feedback:
              "Inverso do JIT como filosofia. JIT é robusto **dado pré-requisitos atendidos** — fora deles, JIT é **mais frágil** que sistema tradicional (que tem buffer para absorver falhas). Confundir robustez do JIT pronto com robustez do rollout é erro conceitual grave.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — Implantação parcial em top 20% (~120 SKUs)",
      shortLabel: "JIT parcial",
      description:
        "JIT aplicado apenas nos **120 SKUs de classe A** (80% do CMV) em 12 meses. Estoque-alvo desses SKUs: **12 dias** (vs 75). Demais 480 SKUs mantêm política atual. Liberação de **R$ 12,5 M**, ganho **R$ 2,75 M/ano**. Custo de implantação **R$ 1 M**. Escopo focado, risco operacional baixo.",
      resultPanel: {
        headline: "Liberação R$ 12,5 M (77% do A) + ganho R$ 2,75 M/ano com 1/3 do custo e metade do tempo",
        deltas: [
          { label: "Liberação de capital", value: "R$ 12,5 M", tone: "positive" },
          { label: "Ganho de carregamento", value: "R$ 2,75 M/ano", tone: "positive" },
          { label: "Custo de implantação", value: "R$ 1,0 M (one-off)", tone: "negative" },
          { label: "Payback", value: "≈ 6 meses", tone: "positive" },
          { label: "Horizonte do projeto", value: "12 meses", tone: "positive" },
          { label: "Risco de ruptura na transição", value: "Baixo — escopo focado", tone: "positive" },
          { label: "Caminho para evoluir para A", value: "Aberto — gera dados e caso interno", tone: "positive" },
        ],
        commentary:
          "**A política recomendada para a maioria das empresas brasileiras com perfil similar à Lambda.** Captura **77% do ganho do cenário A** com **33% do custo** e **50% do tempo**, num escopo onde os pré-requisitos podem ser plenamente atendidos (selecionando os 120 SKUs com fornecedores já EDI-habilitados e locais). Vantagens organizacionais: (1) **prova o método** em escala administrável; (2) **gera dados** que justificam expansão; (3) **forma time** que poderá liderar fase A no ano 2-3; (4) **mantém buffer** nos demais 480 SKUs durante aprendizado. Risco residual: **acomodação** — após sucesso em B, time pode resistir a evoluir para A. Mitigação: já desenhar o plano A no início e estabelecer datas de revisão.",
      },
      reflection: {
        prompt:
          "Quando B é executado com sucesso, deveria a Lambda **evoluir para A no ano seguinte** — ou parar aqui e consolidar?",
        choices: [
          {
            id: "rb_a",
            label:
              "**Depende da matemática marginal**: A traria **R$ 810 mil/ano adicionais** (R$ 3,56 − R$ 2,75) e **R$ 3,7 M de liberação adicional**. Se o time está formado e os pré-requisitos podem ser fechados em 12-18 meses, evoluir vale. Se o esforço marginal é equivalente ao de um projeto novo (pré-requisitos longe de prontos), consolidar é racional.",
            correct: true,
            score: 25,
            feedback:
              "Correto e maduro. A pergunta certa é **\"qual é o custo marginal de A dado que B já foi executado?\"** — não custo absoluto. Se B já fechou EDI e treinou time, o **delta para A é menor** que projeto greenfield (estimativa: R$ 1,2-1,8 M em vez de R$ 3 M originais). Nesse caso, payback marginal fica em 18-24 meses, defensável. Se gaps remanescentes são grandes (importações estruturais, fornecedores resistentes), consolidar B + buscar melhorias incrementais nos 480 SKUs restantes pode ser dominante. Decisão **caso a caso**, não regra geral.",
          },
          {
            id: "rb_b",
            label:
              "**Sempre evoluir para A** — projeto inacabado deixa valor em cima da mesa.",
            correct: false,
            score: 5,
            feedback:
              "Não considera **custo marginal**. Se os 480 SKUs restantes têm cada um valor anual baixo (são classe C), gerar EDI e treinar fornecedor para esses **pode custar mais que o ganho**. Curva de retorno marginal é **declinante** — após B, o próximo R$ 1 de liberação custa mais do que custou o anterior.",
          },
          {
            id: "rb_c",
            label:
              "**Sempre consolidar** — JIT em apenas 20% dos SKUs é o ótimo de Pareto; expandir é sobreengenharia.",
            correct: false,
            score: 5,
            feedback:
              "Generalização sem base. Em empresas com **fornecedores muito concentrados** (10-20 fornecedores cobrindo 80% dos SKUs), expandir A para os 480 restantes pode ter **custo marginal muito baixo** (mesmo fornecedor já em EDI cobre 50 SKUs) e payback rápido. Argumento de \"sempre\" omite estrutura de custos marginais.",
          },
          {
            id: "rb_d",
            label:
              "Esperar **3-5 anos** para revisar — JIT em B precisa estabilizar muito antes de qualquer mudança.",
            correct: false,
            score: 10,
            feedback:
              "Cautela razoável, mas **excessiva**. 12 meses pós-estabilização (≈ 24 meses do início) já dá visibilidade suficiente para decidir sobre A. Esperar 3-5 anos **arrisca perder momentum** — time se acomoda, sponsor rotaciona, e A nunca acontece.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — Não migrar — refinar gestão atual",
      shortLabel: "Não migrar",
      description:
        "Manter sistema atual e aplicar **melhorias incrementais**: ABC refinado, EOQ otimizado, ES dimensionado por nível de serviço, redução seletiva de SKUs obsoletos. Reduz estoque em **15%** (R$ 2,7 M), gera **R$ 0,6 M/ano** em carregamento. Custo **R$ 200 mil**, payback 4 meses. Risco operacional zero.",
      resultPanel: {
        headline: "Liberação R$ 2,7 M + ganho R$ 0,6 M/ano: risco zero, mas deixa R$ 10 M em cima da mesa",
        deltas: [
          { label: "Liberação de capital", value: "R$ 2,7 M", tone: "positive" },
          { label: "Ganho de carregamento", value: "R$ 0,6 M/ano", tone: "positive" },
          { label: "Custo de implantação", value: "R$ 200 mil (one-off)", tone: "positive" },
          { label: "Payback", value: "≈ 4 meses", tone: "positive" },
          { label: "Horizonte do projeto", value: "6 meses", tone: "positive" },
          { label: "Risco operacional", value: "Zero — mantém modelo conhecido", tone: "positive" },
          { label: "Custo de oportunidade vs B", value: "−R$ 2,15 M/ano + R$ 9,8 M de liberação não-realizada", tone: "negative" },
        ],
        commentary:
          "**Política correta apenas em contextos específicos**: cadeia estruturalmente incompatível com JIT (volátil, internacional dominante), ausência de sponsor sênior, ciclo macro adverso (recessão profunda em que se preserva caixa para não-investir), ou empresa em meio a outra transformação maior (ERP, fusão) que consumiria a capacidade organizacional. Em qualquer cenário onde **B é executável**, C é **subótimo** — deixa R$ 2,15 M/ano em ganho recorrente e R$ 9,8 M de liberação de capital em cima da mesa. Risco de escolher C \"por conservadorismo\": ao revisitar em 3 anos, o mercado avançou e a empresa está em desvantagem competitiva em margem operacional.",
      },
      reflection: {
        prompt:
          "Em que situação C **é dominante** sobre B?",
        choices: [
          {
            id: "rc_a",
            label:
              "Quando a empresa está em **outra transformação prioritária** (ERP novo, integração de aquisição, mudança de planta) que consumiria toda a capacidade organizacional disponível — e tentar B em paralelo geraria fracasso em ambos os projetos.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **Capacidade organizacional é o recurso mais escasso** em projetos transformacionais — não dinheiro, não tecnologia, mas **atenção da liderança + tempo do time + tolerância à mudança**. Empresa que está implementando ERP novo (12-18 meses, 30-50% do time envolvido) **não tem espaço** para JIT em paralelo. Nesse contexto, C captura ganho marginal disponível sem competir por recursos, e **adia B para após o pico do projeto prioritário**. Decisão sequencial, não rejeição.",
          },
          {
            id: "rc_b",
            label:
              "Quando o **CFO prefere conservadorismo financeiro** — não correr risco de R$ 1 M de implantação.",
            correct: false,
            score: 0,
            feedback:
              "Preferência sem fundamento técnico **destrói valor**. R$ 1 M de implantação com payback de 6 meses e ganho recorrente de R$ 2,75 M/ano é **decisão financeira óbvia** — recusar é abrir mão de R$ 2,15 M/ano + liberação de R$ 12,5 M. Conservadorismo do CFO faz sentido em **alocação de capital de risco**, não em projetos de eficiência operacional com payback rápido.",
          },
          {
            id: "rc_c",
            label:
              "Sempre — JIT não funciona em empresa brasileira média; cultura latina não aceita disciplina japonesa.",
            correct: false,
            score: 0,
            feedback:
              "**Mito cultural** desmontado por décadas de prática. Empresas brasileiras — Embraer, Marcopolo, Randon, várias automotivas — operam com JIT bem-sucedido há 20+ anos. \"Cultura\" não é barreira; **liderança, processo e disciplina técnica** são. Quem usa \"cultura latina\" como motivo de não tentar está racionalizando inação.",
          },
          {
            id: "rc_d",
            label:
              "Quando o ganho de B (R$ 2,75 M/ano) é menor que **3% da receita** — tipicamente não-material para o comitê.",
            correct: false,
            score: 5,
            feedback:
              "R$ 2,75 M / R$ 90 M = 3,1% — **material** para qualquer comitê de empresa de porte médio. Em margem líquida típica de 8-12%, R$ 2,75 M representa 25-35% do lucro líquido anual — definitivamente acima do radar.",
          },
        ],
      },
    },
  ],
};
