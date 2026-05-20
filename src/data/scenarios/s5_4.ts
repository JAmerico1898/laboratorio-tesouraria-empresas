import type { Scenario } from "@/types/scenario";

// =============================================================================
// S5.4 — Gestão de covenants em cenário de retração
// =============================================================================
// Premissas:
//
// Empresa: Indústria Pi (autopeças, capital aberto).
// Covenant atual: Dívida Líquida / EBITDA ≤ 3,5x (em escritura de debênture)
// Covenant secundário: EBITDA / Despesa Financeira ≥ 2,5x
//
// Posição atual (LTM):
//   Dívida Bruta: R$ 100 M
//   Caixa: R$ 10 M
//   Dívida Líquida (DL): R$ 90 M
//   EBITDA LTM: R$ 30 M
//   DL/EBITDA atual: 3,00x ✓ (cushion 0,5x até o cap)
//   EBITDA/Desp Fin atual: 3,3x ✓
//
// Cenário-base (projeção próximos 12 meses): EBITDA cai 20% (retração setorial)
//   EBITDA projetado: R$ 24 M
//   Para atender 3,5x: DL máxima = R$ 84 M
//   Excesso projetado: R$ 6 M (DL precisa cair de 90 para 84)
//   DL/EBITDA projetado sem ação: 90/24 = 3,75x (VIOLAÇÃO)
//   EBITDA/Desp Fin projetado: 24/9 = 2,67x (apertado mas dentro)
//
// Alavancas internas mapeadas:
//   Reduzir CAPEX adiável .................. R$ 5 M (de R$ 12 M planejado)
//   Reduzir estoque (projeto Kanban) ....... R$ 8 M em 9 meses
//   Acelerar recebimento (cobrança ativa) .. R$ 3 M em 6 meses
//   Vendor finance para top 3 fornecedores  R$ 4 M de PCO adicional (≈ DL menor)
//   Atrasar pagamentos (não recomendado) .... R$ 6 M (risco alto)
//
// Cenário A — Combinar ações operacionais + waiver pontual
//   Reduzir CAPEX: R$ 5 M
//   Vender estoque obsoleto: R$ 3 M (subset do projeto Kanban, viável em 6m)
//   Total redução DL: R$ 8 M → DL = R$ 82 M
//   DL/EBITDA = 82/24 = 3,42x ✓ (dentro do covenant 3,5x, com 0,08x de buffer)
//   Waiver preventivo para janela de incerteza: fee 0,5% × 100 M = R$ 500 mil
//   Spread incremental: +50 bps × R$ 100 M × 1 ano = R$ 500 mil/ano
//   Total custo: R$ 1.000 mil one-off + condicional
//   Vantagem: solução cirúrgica, preserva flexibilidade estratégica
//
// Cenário B — Renegociação estrutural do covenant para 4,0x por 24 meses
//   Renegociar com debenturistas (R$ 60 M de R$ 100 M de dívida)
//   Custo: spread incremental 75 bps × 60 M × 2 anos = R$ 900 mil
//   Fee de renegociação: 1% × 60 M = R$ 600 mil one-off
//   Total custo: R$ 1.500 mil
//   Vantagem: alívio estrutural, evita waivers múltiplos em retração prolongada
//   Desvantagem: sinalização (mercado interpreta como fragilidade)
//
// Cenário C — Captar follow-on / equity de R$ 15 M
//   Diluição estimada: 6-10% (depende do múltiplo)
//   Custo de capital próprio: WACC equity 18-20%
//   Reduz DL em R$ 15 M (se usado para amortizar dívida): DL = R$ 75 M
//   DL/EBITDA = 75/24 = 3,13x ✓ (cushion confortável)
//   Custo "puro" (diluição × WACC equity): difícil de quantificar diretamente
//   Vantagem: solução estrutural duradoura, melhora rating
//   Desvantagem: janela de mercado, custo de assessoria, comunicação
// =============================================================================

export const S5_4: Scenario = {
  id: "s5_4",
  code: "S5.4",
  title: "Gestão de covenants em cenário de retração — Indústria Pi",
  company: "Indústria Pi S.A.",
  difficulty: "Avançado",
  estimatedMinutes: 26,
  context: {
    narrative:
      "Você é tesoureiro(a) da **Indústria Pi**, autopeças de capital aberto. A empresa tem **Dívida Líquida de R$ 90 milhões** e **EBITDA LTM de R$ 30 milhões** (DL/EBITDA = **3,00x**, com cushion de 0,5x até o cap do covenant de **3,5x**). A área de planejamento projeta **retração de 20% no EBITDA** dos próximos 12 meses (queda da indústria automotiva, repasses de preço inviáveis no curto prazo). Sem ação, EBITDA cai para **R$ 24 M** e DL/EBITDA vai a **3,75x** — **violação do covenant**, com risco de aceleração de R$ 60 M em debêntures e **cross-default** em mais R$ 40 M de capital de giro. Você tem três caminhos: (A) **combinar ações operacionais** (reduzir CAPEX, vender estoque) e pleitear **waiver pontual** ao trustee; (B) **renegociar estruturalmente o covenant** para 4,0x por 24 meses; ou (C) **captar follow-on de R$ 15 M** em equity para reduzir DL.",
    keyFacts: [
      ["Dívida Bruta", "R$ 100 M"],
      ["Caixa", "R$ 10 M"],
      ["Dívida Líquida atual", "R$ 90 M"],
      ["EBITDA LTM", "R$ 30 M"],
      ["DL/EBITDA atual", "3,00x (cushion 0,5x)"],
      ["EBITDA projetado (−20%)", "R$ 24 M"],
      ["DL/EBITDA projetado sem ação", "3,75x (violação)"],
      ["Covenant cap", "DL/EBITDA ≤ 3,5x"],
    ],
  },
  statements: [
    {
      id: "covenants_cenarios",
      title: "Comparação dos três caminhos (R$ M / x)",
      unit: "R$ M / x / pp",
      periods: ["A: Operacional + waiver", "B: Renegociação", "C: Equity R$ 15 M"],
      sections: [
        {
          label: "Posição pós-ação (próximos 12 meses)",
          rows: [
            { label: "Dívida Líquida (R$ M)", values: [82, 90, 75], emphasis: "bold" },
            { label: "EBITDA projetado (R$ M)", values: [24, 24, 24], indent: 1 },
            { label: "DL/EBITDA resultante (x)", values: [3.42, 3.75, 3.13], emphasis: "subtotal" },
            { label: "Covenant aplicado (x)", values: [3.5, 4.0, 3.5], indent: 1 },
            { label: "Cushion (x)", values: [0.08, 0.25, 0.37], emphasis: "bold" },
          ],
        },
        {
          label: "Custos da solução (R$ mil)",
          rows: [
            { label: "Custo de implantação operacional", values: [200, 0, 800], indent: 1 },
            { label: "Fee de waiver / renegociação", values: [500, 600, 0], indent: 1 },
            { label: "Spread incremental anual", values: [500, 450, 0], indent: 1 },
            { label: "Diluição (custo implícito, R$ mil/ano)", values: [0, 0, 1500], indent: 1 },
            { label: "Custo total ano 1 (R$ mil)", values: [1200, 1050, 2300], emphasis: "total" },
          ],
        },
        {
          label: "Aspectos estratégicos",
          rows: [
            { label: "Reversibilidade (1=alta, 5=baixa)", values: [2, 4, 5], indent: 1 },
            { label: "Sinalização ao mercado (1=neutra, 5=negativa)", values: [2, 4, 3], indent: 1 },
            { label: "Tempo de execução (meses)", values: [3, 4, 6], indent: 1 },
            { label: "Robustez se retração se prolongar", values: [2, 5, 5], indent: 1 },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Quantificar o gap.** Qual é a **DL máxima admissível** e o **excesso projetado**?",
      choices: [
        {
          id: "e1_a",
          label:
            "**DL máxima = 3,5 × R$ 24 M = R$ 84 M.** DL atual R$ 90 M − DL máxima R$ 84 M = **excesso de R$ 6 M** que precisa ser reduzido (ou EBITDA recuperado) para evitar violação. Cushion zero é arriscado — meta operacional deve ser **DL ≤ R$ 80 M** (3,33x) para absorver volatilidade.",
          correct: true,
          score: 20,
          feedback:
            "Correto e prudente. **Cálculo direto** do gap e **buffer adicional** para volatilidade. Boa prática: tesouraria não deve mirar **exatamente** o covenant (cushion zero = violação ao primeiro tropeço); deve mirar **80-85% do limite** para absorver flutuações trimestrais de EBITDA. Aqui: mirar 3,2-3,3x (DL R$ 77-80 M) seria política conservadora; **R$ 84 M é o teto absoluto, não a meta**.",
        },
        {
          id: "e1_b",
          label:
            "**DL máxima = 3,5 × R$ 30 M = R$ 105 M** (usar EBITDA atual). Sem excesso projetado, basta manter.",
          correct: false,
          score: 0,
          feedback:
            "**Erro grave**: covenants são calculados sobre **EBITDA LTM atualizado** trimestre a trimestre, não sobre EBITDA do momento de assinatura. Quando EBITDA cair para R$ 24 M (em 12 m), o ratio sobe automaticamente — usar EBITDA atual subdimensiona o risco e leva a inércia até a violação real.",
        },
        {
          id: "e1_c",
          label:
            "**DL máxima depende do banco** — cada banco usa cálculo próprio.",
          correct: false,
          score: 0,
          feedback:
            "**Covenant é cláusula contratual padronizada** dentro de cada escritura — fórmula é fixa (DL/EBITDA dos últimos 12 meses, definições escrituradas). Não \"depende do banco\" — depende do que está escrito. Tesoureiro deve **ter a fórmula em mãos** e calcular com precisão; não pode terceirizar para o banco.",
        },
        {
          id: "e1_d",
          label:
            "**Não é possível calcular** sem mais detalhes sobre cronograma da retração.",
          correct: false,
          score: 5,
          feedback:
            "**Pode-se calcular o cenário-base** com a premissa fornecida (queda de 20% em 12 m). Esperar \"mais detalhes\" antes de agir é antipadrão — gestão de covenants exige **monitoramento proativo** com cenários, não certeza absoluta. Premissa de queda é input para análise; tesoureiro **age** com cenário-base e refina conforme dados chegam.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Quando conversar com banco/debenturistas.** Qual é a **abordagem correta** para comunicação?",
      choices: [
        {
          id: "e2_a",
          label:
            "**Iniciar conversa agora**, com 6-9 meses de antecedência da violação projetada. Apresentar **plano de remediação** com ações operacionais (CAPEX cortado, estoque reduzido) **e** pedir **waiver preventivo** para janela específica caso o pior cenário se materialize. Preserva relacionamento, dá tempo de estruturar, evita aceleração unilateral.",
          correct: true,
          score: 20,
          feedback:
            "Correto e regra **fundamental** de gestão de covenants. **Bancos/debenturistas preferem informação antecipada** + plano + waiver negociado a violação surpresa. Conversa antecipada (1) **preserva relacionamento** (banco vê tesoureiro como parceiro maduro), (2) **reduz custo do waiver** (fee menor, sem spread punitivo), (3) **abre janela** para co-construir solução. Boa prática: **gatilho interno** quando ratio atinge **80% do covenant cap** dispara comunicação automática — não esperar atingir o limite.",
        },
        {
          id: "e2_b",
          label:
            "**Esperar até 30-60 dias antes da violação** — dar tempo para ações operacionais funcionarem antes de envolver banco.",
          correct: false,
          score: 5,
          feedback:
            "**Risco material** — 30-60 dias é insuficiente para estruturar waiver ou renegociação (processo leva 60-120 dias). Esperar gera duas situações ruins: (1) tesouraria perde **opção de waiver preventivo** e cai em waiver emergencial (mais caro); (2) banco percebe demora como **negação do problema** — relacionamento se deteriora.",
        },
        {
          id: "e2_c",
          label:
            "**Esperar a violação** acontecer e então pedir waiver reativo — bancos preferem fatos a projeções.",
          correct: false,
          score: 0,
          feedback:
            "**Antipadrão grave**. Violação configura **evento de inadimplemento** que dispara aceleração (vencimento imediato) e **cross-default** em outras operações. Pedir waiver **após** violação é negociar do lado fraco — banco pode exigir condições punitivas (spread +100-200 bps, garantias adicionais, restrição de dividendos, monitoramento intensivo). Antecipação é boa fé contratual; reação é fraqueza.",
        },
        {
          id: "e2_d",
          label:
            "**Não comunicar** e gerir internamente — bancos não acompanham covenants em tempo real.",
          correct: false,
          score: 0,
          feedback:
            "**Bancos acompanham covenants trimestralmente** via certificados de cumprimento (compliance certificate) que a empresa **é obrigada contratualmente** a entregar. Esconder violação é fraude contratual com consequências legais (responsabilidade do CFO + tesoureiro pessoalmente). Não é opção viável.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Decidir entre A, B e C.** Qual é a **decisão dominante** se a retração for **temporária** (12-18 meses)?",
      choices: [
        {
          id: "e3_a",
          label:
            "**Cenário A** — combina **ações operacionais** (cortar CAPEX, reduzir estoque) **com waiver pontual**. Custo total razoável (R$ 1,2 M) e **preserva flexibilidade estratégica** para o ciclo seguinte. Se a retração for mesmo temporária, em 12-18 meses a empresa recupera EBITDA e covenant volta a ter folga sem mudanças estruturais.",
          correct: true,
          score: 20,
          feedback:
            "Correto para **retração temporária**. **A é cirúrgica**: resolve o problema imediato, não compromete a estrutura de capital, e **deixa a porta aberta** para reconstituir cushion via recuperação operacional. Risco residual: **cushion apertado** (0,08x) — qualquer choque adicional dispara violação real. Mitigação: gatilho interno para revisar trimestralmente e escalar para B se o cenário-base se mostrar otimista. Boa prática: **planos em camada** (\"Plan A funciona até X; gatilho dispara Plan B em Y\").",
        },
        {
          id: "e3_b",
          label:
            "**Cenário B (renegociação para 4,0x)** — alívio estrutural elimina ansiedade dos próximos trimestres.",
          correct: false,
          score: 10,
          feedback:
            "**Defensável mas excessivo** para retração temporária. Renegociar covenant tem **custo sinalizatório alto** (mercado interpreta como fraqueza estrutural) e **custo financeiro recorrente** (spread +75 bps por 2 anos = R$ 900 mil). Se a recuperação for mesmo em 12-18 meses, B paga mais que A sem ganho proporcional. B vence quando **retração projetada é estrutural** (3+ anos) ou quando A é insuficiente para o gap.",
        },
        {
          id: "e3_c",
          label:
            "**Cenário C (equity R$ 15 M)** — solução definitiva que elimina risco de covenants futuros.",
          correct: false,
          score: 5,
          feedback:
            "**Excessivo para o problema**. Captar R$ 15 M em equity para resolver gap de R$ 6 M é **diluição desproporcional** (6-10% dos acionistas) com custo de capital próprio alto (~18-20%) — em 12-18 meses, custo total supera R$ 2-3 M. C é dominante apenas se (1) janela de mercado é excepcional (múltiplo alto), (2) retração é estrutural com sinais de longo prazo, ou (3) empresa quer fazer **captação estratégica** independente do covenant (M&A planejado, CAPEX expansionista).",
        },
        {
          id: "e3_d",
          label:
            "**Combinação A + parte de B** — fazer operacional, pedir waiver pequeno **e** negociar renegociação parcial.",
          correct: false,
          score: 15,
          feedback:
            "**Lógica criativa** que pode fazer sentido em contextos específicos, mas adiciona **complexidade negocial** (duas conversas com debenturistas em paralelo) sem ganho proporcional. Em geral, escolher uma estratégia clara (A ou B) é dominante sobre combinações híbridas, que diluem a mensagem e geram custos de transação adicionais.",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Ações operacionais + waiver pontual",
      shortLabel: "Operacional + waiver",
      description:
        "**Cortar CAPEX em R$ 5 M** (de R$ 12 M planejado para R$ 7 M) + **vender estoque obsoleto em R$ 3 M** (parte do projeto Kanban) = redução de R$ 8 M na DL → DL = R$ 82 M, DL/EBITDA = **3,42x** (cushion 0,08x). Pleitear **waiver preventivo** ao trustee com fee de 0,5% (R$ 500 mil). Spread incremental contratado: +50 bps por 12 meses. Custo total ano 1: **R$ 1,2 M**.",
      resultPanel: {
        headline: "Cushion 0,08x e custo R$ 1,2 M: solução cirúrgica para retração temporária",
        deltas: [
          { label: "DL pós-ação", value: "R$ 82 M (de 90)", tone: "positive" },
          { label: "DL/EBITDA resultante", value: "3,42x (vs cap 3,5x)", tone: "positive" },
          { label: "Cushion sobre o cap", value: "0,08x (apertado)", tone: "negative" },
          { label: "Custo total ano 1", value: "R$ 1,2 M", tone: "neutral" },
          { label: "Reversibilidade", value: "Alta — CAPEX pode ser retomado quando recuperar", tone: "positive" },
          { label: "Sinalização ao mercado", value: "Neutra — ações operacionais comuns", tone: "positive" },
          { label: "Robustez se retração se prolongar", value: "Baixa — cushion 0,08x não absorve choque adicional", tone: "negative" },
        ],
        commentary:
          "**Política dominante para retração temporária (12-18 meses)** quando há capacidade operacional de cortar CAPEX e reduzir estoque sem comprometer competitividade. Custo razoável, preserva flexibilidade estratégica, evita sinalização negativa ao mercado. **Risco principal: cushion apertado** (0,08x) — qualquer choque adicional (cliente importante atrasou, custos subiram, depreciação cambial elevou dívida em USD) dispara violação real. Mitigação obrigatória: **gatilho interno** que dispara escalada para B se ratio passar de 3,4x em qualquer trimestre. Boa prática: tratar A como **\"plano de contingência tier 1\"** com plano B pronto em gaveta.",
      },
      reflection: {
        prompt:
          "Cushion de 0,08x é apertado. Qual **mitigação adicional** o tesoureiro deve implementar para sustentar o cenário A?",
        choices: [
          {
            id: "ra_a",
            label:
              "**Monitoramento mensal** (não trimestral) do ratio DL/EBITDA + **gatilho automático** que dispara renegociação estrutural (cenário B) se ratio passar de 3,4x em qualquer mês. Comunicação proativa com debenturistas a cada trimestre, mesmo dentro do covenant, preservando relação para eventual escalada.",
            correct: true,
            score: 25,
            feedback:
              "Correto e operacionalmente robusto. **Cushion apertado exige cadência de monitoramento mais densa** — trimestral vira mensal; certificado de compliance vira reporte voluntário interno. **Gatilho automático** elimina decisão humana sob pressão (\"vamos esperar mais um trimestre\"). Comunicação proativa com debenturistas é **investimento em relacionamento** — quando precisar de waiver, encontra trustee preparado em vez de surpreso. Boa prática: **\"early warning system\"** com 3 níveis (verde 3,0-3,2x, amarelo 3,2-3,4x, vermelho > 3,4x), cada um com ações pré-definidas.",
          },
          {
            id: "ra_b",
            label:
              "**Reduzir mais R$ 5 M de CAPEX** para criar cushion maior — segurança financeira deve sempre vencer investimento.",
            correct: false,
            score: 10,
            feedback:
              "**Trade-off real**: cortar CAPEX adicional cria cushion, mas **compromete competitividade futura** (CAPEX é renovação de capacidade, modernização, projetos de crescimento). Resolver covenant via CAPEX residual é solução boa; sacrificar CAPEX produtivo é destruição de valor de longo prazo para alívio de curto prazo. Resposta correta é **monitoramento + gatilho** em vez de mais corte.",
          },
          {
            id: "ra_c",
            label:
              "**Contratar consultoria de M&A** para vender ativo não-estratégico e reduzir DL.",
            correct: false,
            score: 5,
            feedback:
              "Venda de ativo é **decisão estratégica de longo prazo** — não cabe como mitigação de covenant apertado. Processo leva 6-12 meses (avaliação, due diligence, negociação), e \"vender sob pressão\" rende menos. Se há ativo não-estratégico a vender, é projeto separado; não substitui monitoramento + gatilho.",
          },
          {
            id: "ra_d",
            label:
              "**Não fazer nada adicional** — cushion 0,08x é suficiente se o cenário-base se materializar.",
            correct: false,
            score: 0,
            feedback:
              "**Cushion zero é violação ao primeiro tropeço**. Cenário-base é projeção, não certeza — variabilidade real exige buffer operacional. Não preparar contingência é apostar que tudo correrá conforme planejado, o que estatisticamente é improvável em 18-24 meses.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — Renegociação estrutural do covenant para 4,0x por 24 meses",
      shortLabel: "Renegociação",
      description:
        "**Renegociar covenant** com debenturistas (R$ 60 M de R$ 100 M da dívida total) para **DL/EBITDA ≤ 4,0x por 24 meses**, voltando a 3,5x depois. Fee de renegociação 1% (R$ 600 mil) + spread incremental +75 bps por 24 meses (R$ 450 mil/ano). Custo total ano 1: **R$ 1,05 M**. Alívio estrutural, sinalização negativa ao mercado.",
      resultPanel: {
        headline: "Cushion 0,25x e custo R$ 1,05 M: alívio estrutural, com pegada sinalizatória negativa",
        deltas: [
          { label: "DL projetada (sem ações operacionais)", value: "R$ 90 M", tone: "neutral" },
          { label: "DL/EBITDA projetado", value: "3,75x", tone: "negative" },
          { label: "Covenant renegociado", value: "4,0x (de 3,5x)", tone: "positive" },
          { label: "Cushion sobre novo cap", value: "0,25x (confortável)", tone: "positive" },
          { label: "Custo total ano 1", value: "R$ 1,05 M", tone: "neutral" },
          { label: "Spread incremental (24 meses)", value: "+75 bps = R$ 900 k em 2 anos", tone: "negative" },
          { label: "Sinalização ao mercado", value: "Negativa — \"empresa pediu folga\"", tone: "negative" },
        ],
        commentary:
          "**Política dominante quando retração projetada é estrutural (24+ meses)** ou quando cenário A teria cushion **insuficiente** mesmo com plano de remediação. Vantagem central: **alívio duradouro** elimina ansiedade trimestre a trimestre e dá tempo para reorganização operacional (transformação, pivots, M&A). Desvantagem central: **custo sinalizatório** — investidores e analistas interpretam renegociação como sinal de fragilidade estrutural; ações podem cair 5-15% no curto prazo. Boa prática: **comunicar renegociação no contexto de plano estratégico maior** (\"renegociamos covenant para preservar capacidade de investimento em transformação digital\"), não como reação a queda de EBITDA.",
      },
      reflection: {
        prompt:
          "B tem alívio estrutural mas sinalização negativa. Como **minimizar o custo sinalizatório** da renegociação?",
        choices: [
          {
            id: "rb_a",
            label:
              "**Comunicar a renegociação dentro de um plano estratégico maior** (\"liability management para sustentar investimentos em ESG / transformação digital / expansão\") em vez de \"alívio para acomodar queda de EBITDA\". Reframing transforma sinal negativo em narrativa de gestão proativa.",
            correct: true,
            score: 25,
            feedback:
              "Correto e prática consagrada em IR (relações com investidores). **Narrativa importa** — a mesma operação financeira pode ser lida como \"empresa em apuros\" ou \"empresa em transformação\". Reframing exige (1) plano estratégico genuíno por trás da narrativa (não pode ser pretexto vazio); (2) comunicação coordenada (CEO, CFO, IR alinhados); (3) ações concretas que sustentem a narrativa nos próximos 6-12 meses. Boa prática: **liability management** é tradicionalmente bem visto quando associado a estratégia ofensiva; mal visto quando isolado.",
          },
          {
            id: "rb_b",
            label:
              "**Esconder a renegociação** dos analistas — fato relevante é decisão da empresa.",
            correct: false,
            score: 0,
            feedback:
              "**Ilegal em capital aberto** — renegociação de covenant material é **fato relevante** que deve ser divulgado em até 24h (Res. CVM 44). Tentar esconder configura **omissão informacional** com responsabilização pessoal de administradores. Não é opção viável.",
          },
          {
            id: "rb_c",
            label:
              "**Renegociar com cláusula de confidencialidade** — debenturistas não podem divulgar.",
            correct: false,
            score: 0,
            feedback:
              "Confidencialidade entre as partes existe, mas **divulgação ao mercado é obrigação da emissora** (não dos debenturistas). Fato relevante público; \"confidencialidade\" não muda obrigação de divulgar.",
          },
          {
            id: "rb_d",
            label:
              "**Aceitar o custo sinalizatório** — em retração, mercado já espera sinais negativos.",
            correct: false,
            score: 10,
            feedback:
              "Verdade parcial (mercado já desconta cenário ruim), mas resignação não é estratégia. **Comunicação proativa com narrativa** materialmente reduz impacto — empresas que comunicam bem perdem 5-7% no anúncio; empresas que comunicam mal perdem 15-25%. Diferença é gerenciamento ativo.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — Captar follow-on / equity de R$ 15 M",
      shortLabel: "Equity R$ 15 M",
      description:
        "**Captar R$ 15 M em equity** (follow-on de ações, com diluição 6-10% dos acionistas existentes). Aplicar R$ 15 M para amortizar dívida → DL = R$ 75 M, DL/EBITDA = **3,13x** (cushion 0,37x). Solução estrutural definitiva. Custo total ano 1: **R$ 2,3 M** (assessoria + diluição implícita).",
      resultPanel: {
        headline: "Cushion 0,37x e R$ 2,3 M de custo: solução definitiva, mas a mais cara e diluitiva",
        deltas: [
          { label: "DL pós-captação", value: "R$ 75 M (de 90)", tone: "positive" },
          { label: "DL/EBITDA resultante", value: "3,13x", tone: "positive" },
          { label: "Cushion sobre o cap", value: "0,37x (muito confortável)", tone: "positive" },
          { label: "Custo direto (assessoria, registro)", value: "R$ 800 k one-off", tone: "negative" },
          { label: "Custo implícito (diluição)", value: "~R$ 1,5 M/ano em WACC equity", tone: "negative" },
          { label: "Reversibilidade", value: "Baixa — ações emitidas não voltam", tone: "negative" },
          { label: "Robustez se retração se prolongar", value: "Alta — cushion suporta novos choques", tone: "positive" },
        ],
        commentary:
          "**Política dominante quando (1) retração projetada é estrutural e profunda (3+ anos), (2) janela de mercado é favorável (múltiplo P/E alto permite captar com menor diluição), ou (3) empresa quer **captação estratégica** para combinar resolução de covenant com financiamento de projeto maior (M&A, expansão).** Captura cushion confortável (0,37x) que **elimina risco** dos próximos 24-36 meses. Desvantagens: (1) custo direto alto (assessoria, due diligence, registro CVM); (2) **diluição irreversível** dos acionistas existentes; (3) **dependência de janela de mercado** (em retração, valuation pode estar deprimido). Para retração temporária e gap pequeno (R$ 6 M), C é overkill — A é dominante em custo-benefício.",
      },
      reflection: {
        prompt:
          "Em que contexto **C (equity) é claramente dominante** sobre A e B?",
        choices: [
          {
            id: "rc_a",
            label:
              "Quando a empresa quer **combinar resolução do covenant com captação estratégica** — usar R$ 15 M para reduzir DL **e** R$ 30-50 M adicionais para financiar M&A, expansão ou pivot estratégico de longo prazo. Aí o custo de captação é diluído por benefício múltiplo e a janela de mercado é justificada.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **Equity vale a pena quando é usado para projetos transformacionais**, não apenas para tapar buraco. Em captação de R$ 50-100 M em que R$ 15 M vai para dívida e o resto para investimento estratégico, o custo proporcional de assessoria cai e a diluição é justificada pelo retorno do investimento. Boa prática: **conjugar liability management com strategic financing** — uma única operação resolve dois problemas e tem narrativa positiva.",
          },
          {
            id: "rc_b",
            label:
              "Quando a empresa tem **rating crítico** e bancos não aceitam waiver — equity é a única saída.",
            correct: false,
            score: 10,
            feedback:
              "Cenário existente mas **raro** — bancos quase sempre aceitam waiver com fee suficiente. Equity como \"única saída\" é sinal de problema mais grave (perda de confiança do credor), o que afeta também a janela de captação. Mais comum: equity é **escolha**, não imposição.",
          },
          {
            id: "rc_c",
            label:
              "Quando o **valuation de mercado está deprimido** — comprar de volta seria caro, então emitir é barato.",
            correct: false,
            score: 0,
            feedback:
              "**Inversão**: valuation deprimido **encarece** captação porque empresa precisa emitir mais ações para captar o mesmo valor — diluição maior. Emitir equity em valuation alto é barato (menos ações = menos diluição); emitir em baixa é caro. Resposta confunde a direção.",
          },
          {
            id: "rc_d",
            label:
              "Sempre — equity elimina dívida permanente, é decisão estruturalmente superior.",
            correct: false,
            score: 5,
            feedback:
              "**Falácia estrutural**: equity tem **WACC equity de 18-20%** (custo mais alto que dívida); substituir dívida por equity aumenta WACC total e reduz valor da empresa. Estrutura de capital ótima é mix (não só equity, não só dívida). Equity é instrumento, não sempre dominante.",
          },
        ],
      },
    },
  ],
};
