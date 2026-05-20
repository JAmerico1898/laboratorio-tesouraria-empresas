import type { Scenario } from "@/types/scenario";

// =============================================================================
// S4.3 — Estratégia de cobrança escalonada — B2B com PMRV efetivo 75 dias
// =============================================================================
// Premissas:
//
// Empresa: Serviços Omega (B2B de manutenção predial).
// Receita anual: R$ 30 M. Prazo contratual: 45 dias.
// PMRV efetivo: 75 dias (30 dias acima do contratado).
// Inadimplência atual: 4,5% (vs 2,5% setorial).
// Carteira aberta: R$ 6,25 M (≈ 75 dias).
// Aging:
//   D−5 a D ............ R$ 1,2 M (19%) — em dia ou pré-vencimento
//   D+1 a D+30 ........ R$ 2,3 M (37%) — atraso leve
//   D+31 a D+60 ....... R$ 1,4 M (22%) — atraso médio
//   D+61 a D+90 ....... R$ 0,8 M (13%) — atraso grave
//   > D+90 ............ R$ 0,55 M (9%) — pré-perda
//
// Estrutura de cobrança atual:
//   3 pessoas, R$ 360 mil/ano, foco apenas em e-mail + telefone.
//   Recuperação: 75% em D+1-D+30; 40% em D+31-D+60;
//                15% em D+61-D+90; 5% em >D+90.
//
// Custo financeiro do atraso adicional:
//   30 dias extras × (30M/360) × 14% WACC = R$ 350 mil/ano
//
// Cenário A — Cobrança 100% interna até D+60, terceirizada >D+60
//   Custo: equipe atual R$ 360 mil + terceirizada 25% × recuperado >D+60
//     Recuperado >D+60 a 18%: 0,8×0,18 + 0,55×0,18 = R$ 244 mil
//     Custo terceirização: 244 × 25% = R$ 61 mil
//   Recuperação esperada: melhora marginal em D+60-90 (15%→18%)
//   PMRV efetivo: cai para ~65 dias
//   Caixa adicional: 10 dias × 30M/360 = R$ 833 mil (one-off)
//   Ganho financeiro: 833 × 14% = R$ 117 mil/ano
//   Inadimplência cai: 4,5% → 4,0% = R$ 150 mil/ano
//   Ganho líquido anual: 117 + 150 − 61 = R$ 206 mil/ano
//
// Cenário B — Automatização + escalada agressiva (WhatsApp, SMS, IVR + cobrança ativa D+1)
//   Investimento: R$ 80 mil (sistema, integração) + R$ 40 mil/ano licenças
//   Recuperação melhora em D+1-30 (75%→85%) e D+31-60 (40%→55%)
//   PMRV efetivo: cai para ~58 dias
//   Caixa adicional: 17 dias × 30M/360 = R$ 1.417 mil (one-off)
//   Ganho financeiro: 1.417 × 14% = R$ 198 mil/ano
//   Inadimplência cai: 4,5% → 3,2% = R$ 390 mil/ano
//   Custo de implantação anualizado (3y): R$ 27 mil/ano
//   Licenças: R$ 40 mil/ano
//   Risco reputacional: alto se mal calibrada (LGPD, CDC)
//   Ganho líquido anual: 198 + 390 − 27 − 40 = R$ 521 mil/ano
//
// Cenário C — Cessão de carteira >D+90 para empresa especializada (deságio 50%)
//   Volume cedido: R$ 0,55 M
//   Recuperação imediata: 50% × 0,55 = R$ 275 mil (caixa one-off)
//   Caixa que recuperaria internamente em 6m: ~5% = R$ 27 mil
//   Ganho líquido cessão: 275 − 27 − (custo interno gestão 6m × volume) = R$ 240 mil
//     (one-off, repetível trimestralmente para nova safra >D+90)
//   Recorrente: ~R$ 200 mil/ano ao ceder safras trimestrais
//   Custo: time interno liberado para foco em D+1-60 (não quantificado direto)
//   Ganho líquido anual recorrente: R$ 200 mil/ano + caixa imediato
// =============================================================================

export const S4_3: Scenario = {
  id: "s4_3",
  code: "S4.3",
  title: "Estratégia de cobrança escalonada — Serviços Omega",
  company: "Serviços Omega Ltda.",
  difficulty: "Intermediário",
  estimatedMinutes: 22,
  context: {
    narrative:
      "Você é responsável pela **gestão de crédito e cobrança** dos **Serviços Omega**, prestador B2B de manutenção predial com **receita anual de R$ 30 milhões**. O prazo contratual é de **45 dias**, mas o **PMRV efetivo está em 75 dias** — 30 dias de descolamento — e a **inadimplência subiu para 4,5%** (vs 2,5% do benchmark setorial). A **carteira em aberto** soma **R$ 6,25 milhões** distribuída em 5 faixas de aging, com **22% em atraso médio** (D+31 a D+60) e **22% em atraso grave** (D+61+). O comitê de gestão pede um **redesenho da estratégia de cobrança**, considerando três caminhos: manter cobrança **100% interna até D+60** e terceirizar o que passar, **automatizar** com WhatsApp/SMS/IVR e cobrança ativa desde D+1, ou **ceder a carteira > D+90** para empresa especializada com deságio aceitável.",
    keyFacts: [
      ["Receita anual", "R$ 30,0 M"],
      ["Prazo contratual", "45 dias"],
      ["PMRV efetivo", "75 dias"],
      ["Inadimplência atual", "4,5% (vs 2,5% setorial)"],
      ["Carteira em aberto", "R$ 6,25 M"],
      ["Custo financeiro do atraso (+30 d)", "R$ 350 mil/ano"],
      ["Equipe atual", "3 pessoas, R$ 360 mil/ano"],
      ["WACC", "14% a.a."],
    ],
  },
  statements: [
    {
      id: "aging_e_estrategias",
      title: "Aging da carteira e impacto esperado por estratégia (R$ mil)",
      unit: "R$ mil / dias / %",
      periods: ["A: Interna+Terceiriz.", "B: Automatização", "C: Cessão >D+90"],
      sections: [
        {
          label: "Aging atual da carteira (R$ mil)",
          rows: [
            { label: "D−5 a D (em dia)", values: [1200, 1200, 1200], indent: 1 },
            { label: "D+1 a D+30 (atraso leve)", values: [2300, 2300, 2300], indent: 1 },
            { label: "D+31 a D+60 (atraso médio)", values: [1400, 1400, 1400], indent: 1 },
            { label: "D+61 a D+90 (atraso grave)", values: [800, 800, 800], indent: 1 },
            { label: "> D+90 (pré-perda)", values: [550, 550, 550], indent: 1 },
            { label: "Total carteira", values: [6250, 6250, 6250], emphasis: "subtotal" },
          ],
        },
        {
          label: "Impacto esperado pós-implantação",
          rows: [
            { label: "PMRV efetivo (dias)", values: [65, 58, 70], emphasis: "bold" },
            { label: "Δ Caixa one-off (R$ mil)", values: [833, 1417, 275], indent: 1 },
            { label: "Δ Inadimplência (pp)", values: [-0.5, -1.3, -0.3], indent: 1 },
            { label: "Recuperação adicional (R$ mil/ano)", values: [150, 390, 200], indent: 1 },
          ],
        },
        {
          label: "Custos e ganho líquido (R$ mil/ano)",
          rows: [
            { label: "Custo de implantação (one-off)", values: [0, 80, 0], indent: 1 },
            { label: "Custos recorrentes adicionais", values: [61, 67, 0], indent: 1 },
            { label: "Ganho financeiro (PMRV menor × WACC)", values: [117, 198, 38], indent: 1 },
            { label: "Ganho líquido anual (R$ mil)", values: [206, 521, 200], emphasis: "total" },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Diagnosticar a carteira.** Qual leitura é **mais útil** para definir prioridade de ação?",
      choices: [
        {
          id: "e1_a",
          label:
            "**Concentrar esforço em D+1 a D+30** (37% da carteira, R$ 2,3 M) — taxa de recuperação aqui é a maior (75%), e **prevenir migração para faixas piores** entrega mais valor que recuperar das faixas avançadas. Cada R$ 1 que não migra de D+30 para D+60 vale 2-3× mais que R$ 1 recuperado em D+90.",
          correct: true,
          score: 20,
          feedback:
            "Correto e contraintuitivo. **A faixa D+1-30 é a de maior alavancagem** — recuperação alta (75%) e impacto preventivo (cada R$ recuperado aqui **não migra** para faixas onde a recuperação cai para 15-40%). Foco em \"problemas grandes\" (D+90) é viés psicológico — matematicamente, **prevenir é mais barato que recuperar**. Boa prática: dedicar 60% do tempo da equipe à faixa D+1-30, 30% à D+31-60 e apenas 10% a D+60+ (onde terceirização ou cessão são mais eficientes).",
        },
        {
          id: "e1_b",
          label:
            "**Atacar primeiro a faixa > D+90** (R$ 550 mil) — é onde o dinheiro está mais em risco de virar perda.",
          correct: false,
          score: 5,
          feedback:
            "Intuição **emocional** que parece urgente mas **rende menos**. Taxa de recuperação em >D+90 é **5%** — cada R$ 1 de esforço retorna 5 centavos. Em D+1-30, o mesmo R$ 1 retorna 75 centavos **e previne migração**. Foco no \"mais antigo\" é a forma mais cara de operar cobrança.",
        },
        {
          id: "e1_c",
          label:
            "**Distribuir esforço proporcionalmente** ao volume de cada faixa — equilibrar carteira inteira.",
          correct: false,
          score: 5,
          feedback:
            "**Proporcionalidade ignora taxa de retorno**. Faixas têm **retorno marginal muito diferente** por unidade de esforço — concentrar onde o retorno é maior é princípio econômico básico. Distribuição igual é antipadrão de gestão de cobrança.",
        },
        {
          id: "e1_d",
          label:
            "**Esperar D+45 (vencimento contratual)** para começar qualquer ação — antes disso é prematuro.",
          correct: false,
          score: 0,
          feedback:
            "Antipadrão **clássico**: cobrança que começa após vencimento perde a janela mais valiosa. **Lembrete pré-vencimento (D−3)** é prática universal e tem retorno altíssimo — custa quase nada (e-mail/WhatsApp automatizado) e aumenta pagamento em dia em 8-15%. Esperar vencimento é deixar dinheiro escorrer.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Avaliar automatização (WhatsApp/SMS/IVR).** Qual **risco operacional** precisa ser endereçado **antes** de implementar?",
      choices: [
        {
          id: "e2_a",
          label:
            "**Compliance LGPD + CDC**: cobrança via WhatsApp/SMS sem **consentimento explícito** ou em **horário/frequência inadequada** gera risco legal (CDC art. 42-A) e reputacional. Mapear bases de consentimento, definir SLA de horário (8h-18h, dias úteis) e frequência máxima (2-3 contatos/semana) antes de ligar a régua de comunicação.",
          correct: true,
          score: 20,
          feedback:
            "Correto e crítico. **Automatização agressiva sem compliance** é a forma mais rápida de virar manchete negativa — Procon, ações coletivas, multas LGPD (até 2% do faturamento). Boa prática: (1) **opt-in explícito** no contrato de venda; (2) **canal preferencial** declarado pelo cliente; (3) **régua de comunicação** documentada e auditável; (4) **revisão trimestral** de queixas. Cobrança eficaz é **firme mas legal** — atravessar a fronteira regulatória anula o ganho financeiro.",
        },
        {
          id: "e2_b",
          label:
            "**Custo de implantação** (R$ 80 mil) pode ultrapassar orçamento — solicitar comitê adicional.",
          correct: false,
          score: 5,
          feedback:
            "R$ 80 mil em projeto com payback < 3 meses (R$ 521k/ano de ganho) é **trivialmente aprovável**. Risco operacional aqui é regulatório/reputacional, não financeiro. Confundir os dois leva a aprovação rápida com problema legal posterior.",
        },
        {
          id: "e2_c",
          label:
            "**Resistência do time interno** que perderia atribuição — risco político de implantação.",
          correct: false,
          score: 5,
          feedback:
            "Risco real, mas **secundário**. Automatização **libera** time para casos complexos (D+60+), não substitui. Bem comunicada, é vista como evolução. Risco regulatório é primário porque tem **consequência legal externa**, enquanto resistência interna é gerenciável com comunicação.",
        },
        {
          id: "e2_d",
          label:
            "**Indisponibilidade técnica** do WhatsApp Business API — depende do Meta, que pode mudar regras.",
          correct: false,
          score: 0,
          feedback:
            "Risco técnico **menor** — WhatsApp Business é maduro e tem SLAs. Mudanças de regra do Meta afetam funcionalidades específicas, não a operação geral. Risco regulatório local (CDC/LGPD) é muito mais material e gerenciável.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Combinar estratégias.** Qual **combinação** entrega o maior ganho líquido com risco gerenciável?",
      choices: [
        {
          id: "e3_a",
          label:
            "**B + C**: implementar automatização (cenário B) **e** ceder safras > D+90 trimestralmente (cenário C). B captura ganho preventivo (D+1 a D+60); C libera caixa imediato e foco interno do que é irrecuperável. Ganho combinado estimado: **R$ 700-750 mil/ano**.",
          correct: true,
          score: 20,
          feedback:
            "Correto e estratégico. **B e C atuam em janelas diferentes do aging** (B em D+1-60, C em D+90+) — somam sem canibalizar. Combinação captura: (1) ganho preventivo via automação; (2) caixa one-off + recorrente via cessão das safras maduras; (3) **liberação total da equipe interna** para foco em D+1-60 onde a alavanca é maior. Cenário A (terceirização D+60+) **é redundante com C** — a cessão é versão mais agressiva da mesma ideia, com caixa imediato em vez de comissão sobre o eventual recuperado.",
        },
        {
          id: "e3_b",
          label:
            "**A + B**: cobrança interna até D+60 (com automatização) + terceirização >D+60. Mantém controle do D+60+ pelo terceirizado.",
          correct: false,
          score: 10,
          feedback:
            "Combinação **válida mas inferior** a B+C. Terceirização paga comissão sobre o recuperado (25%) — em volumes >D+60 baixos (porque B já reduziu), o ganho marginal é pequeno. Cessão de >D+90 entrega **caixa imediato** (50% do face) que tem valor presente maior que comissão sobre recuperação futura incerta. Para o D+60-90, time interno pode continuar trabalhando antes de ceder em D+90.",
        },
        {
          id: "e3_c",
          label:
            "**Apenas B** — captura a maior parte do ganho (R$ 521k/ano) com simplicidade operacional.",
          correct: false,
          score: 10,
          feedback:
            "Solução **boa**, mas **deixa em cima da mesa** os R$ 200k/ano da cessão. Volume > D+90 (R$ 550k em foto, com nova safra trimestral) é **dinheiro genuinamente perdido** se permanecer internalizado — cessão monetiza imediatamente. Custo marginal de adicionar C é baixo (negociar contrato de cessão), ganho é direto.",
        },
        {
          id: "e3_d",
          label:
            "**Apenas C** — cessão é a opção mais simples e libera caixa imediato sem investimento.",
          correct: false,
          score: 5,
          feedback:
            "Captura **R$ 200 mil/ano + caixa one-off**, mas **ignora a alavanca preventiva** da automação. Sem cenário B, o aging continua \"escorrendo\" para D+90 no mesmo ritmo — cessão fica reativa, tratando sintoma sem reduzir causa. C sem B é gestão de carteira ruim com soluções tópicas; combinação B+C ataca causa **e** consequência.",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Cobrança interna até D+60, terceirizada >D+60",
      shortLabel: "Interna + terceirizada",
      description:
        "Manter equipe interna **focada em D+1 a D+60** (com lembretes e cobrança ativa) e **terceirizar a partir de D+61** com empresa especializada cobrando **25% sobre o recuperado**. PMRV cai para 65 dias. Ganho líquido **R$ 206 mil/ano**. Estrutura típica e equilibrada.",
      resultPanel: {
        headline: "Ganho R$ 206 mil/ano, PMRV cai 10 dias — estrutura clássica e equilibrada",
        deltas: [
          { label: "Δ PMRV efetivo", value: "75 → 65 dias", tone: "positive" },
          { label: "Δ Caixa one-off", value: "+R$ 833 mil", tone: "positive" },
          { label: "Δ Inadimplência", value: "4,5% → 4,0% (−0,5 pp)", tone: "positive" },
          { label: "Ganho financeiro anual (PMRV menor)", value: "R$ 117 mil/ano", tone: "positive" },
          { label: "Custo terceirização", value: "R$ 61 mil/ano", tone: "negative" },
          { label: "Custo de implantação", value: "R$ 0 (apenas contrato)", tone: "positive" },
          { label: "Risco reputacional", value: "Baixo (empresa especializada idônea)", tone: "positive" },
        ],
        commentary:
          "**Estrutura padrão e equilibrada** — pega o melhor do interno (controle, relacionamento) e do terceirizado (especialização em casos antigos). Vantagem: **zero investimento** de implantação, só contratação de empresa idônea. Desvantagem vs cenário B+C: **deixa em cima da mesa** o ganho preventivo da automação (R$ 300+ mil/ano) e o ganho de cessão (R$ 200 mil/ano). Adequado quando: empresa **não quer investir em automação** (cultura conservadora, restrição de TI), ou volume >D+60 é grande e mais valioso recuperar parcialmente do que ceder integralmente. Em volumes baixos de D+60+, terceirização ineficiente — cessão é dominante.",
      },
      reflection: {
        prompt:
          "Qual é a **principal fraqueza** desse cenário, não capturada pelos números?",
        choices: [
          {
            id: "ra_a",
            label:
              "**Não ataca a causa** do PMRV efetivo de 75 dias — apenas trata o sintoma melhorando a recuperação tardia. Sem ação preventiva (lembrete pré-vencimento, automação em D+1), o aging continua \"escorrendo\" no mesmo ritmo e a estrutura terceirizada **vira permanente**.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **Cobrança eficaz é prevenção primeiro, recuperação depois** — cenário A inverte essa ordem. Sem automação preventiva, todos os meses chegam novos R$ 800k em D+60+ que precisam ser terceirizados; estrutura vira **custo permanente** sem reduzir a entrada de inadimplência. Boa prática: combinar A (terceirização do tardio) **com** automação em D+1-30 (cenário B) — ataca causa e consequência simultaneamente.",
          },
          {
            id: "ra_b",
            label:
              "**Custo de 25% sobre recuperado** — empresa terceirizada lucra demais.",
            correct: false,
            score: 5,
            feedback:
              "25% é **padrão de mercado** para cobrança terceirizada de carteira difícil — refletindo a baixa taxa de recuperação esperada (15-25%). \"Lucra demais\" é avaliação subjetiva; em base ajustada a risco, é margem razoável. Crítica não é o preço, é a falta de complementaridade com prevenção.",
          },
          {
            id: "ra_c",
            label:
              "**Falta de relação direta** com o cliente após D+60 — terceirizada não pode manter relacionamento comercial.",
            correct: false,
            score: 10,
            feedback:
              "Argumento **válido mas secundário**. Empresas terceirizadas modernas operam **em nome do credor** (\"Estamos contatando em nome de Serviços Omega\") preservando marca. Atrito com relacionamento ocorre, mas é mitigável com escolha de prestador idôneo e SLA de comunicação. Não é a fraqueza principal.",
          },
          {
            id: "ra_d",
            label:
              "**Captura apenas 33% do ganho** possível (R$ 206k vs R$ 700k da combinação B+C).",
            correct: false,
            score: 15,
            feedback:
              "Verdade quantitativa, mas é **consequência** da fraqueza principal (não atacar a causa). O ganho menor é **sintoma** de uma estratégia que não combina prevenção + recuperação. Resposta correta é mais profunda.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — Automatização e escalada agressiva (D+1)",
      shortLabel: "Automatização",
      description:
        "Implantar **automação de cobrança** (WhatsApp Business + SMS + IVR) com régua iniciada em **D−3 (lembrete)** e **D+1 (cobrança ativa)**. Investimento R$ 80 mil + R$ 40 mil/ano em licenças. PMRV cai para 58 dias. Ganho líquido **R$ 521 mil/ano**. Maior alavancagem, exige compliance rigoroso.",
      resultPanel: {
        headline: "Ganho R$ 521 mil/ano, PMRV cai 17 dias, inadimplência cai 1,3 pp — alavanca máxima preventiva",
        deltas: [
          { label: "Δ PMRV efetivo", value: "75 → 58 dias", tone: "positive" },
          { label: "Δ Caixa one-off", value: "+R$ 1,42 M", tone: "positive" },
          { label: "Δ Inadimplência", value: "4,5% → 3,2% (−1,3 pp)", tone: "positive" },
          { label: "Recuperação adicional", value: "R$ 390 mil/ano", tone: "positive" },
          { label: "Custo implantação", value: "R$ 80 mil (one-off)", tone: "negative" },
          { label: "Custo recorrente", value: "R$ 40 mil/ano (licenças)", tone: "negative" },
          { label: "Risco regulatório (LGPD/CDC)", value: "Alto se mal calibrado", tone: "negative" },
        ],
        commentary:
          "**Alavanca máxima preventiva** — ataca a causa do PMRV elevado em vez do sintoma. Captura **ganho 2,5× maior** que cenário A com investimento modesto (payback < 2 meses). Vantagens: (1) escala sem aumento de headcount; (2) **dados granulares** sobre comportamento de cliente (quem responde a qual canal, em qual horário); (3) **liberação do time interno** para casos que exigem julgamento (renegociação, cliente estratégico em dificuldade). Risco crítico: **compliance LGPD + CDC** — opt-in explícito, horário regulado, frequência limitada. Mal implementado, vira **passivo jurídico** que anula o ganho financeiro em uma única ação coletiva.",
      },
      reflection: {
        prompt:
          "A automação **funciona** porque ataca quais 2-3 causas fundamentais do PMRV elevado?",
        choices: [
          {
            id: "rb_a",
            label:
              "**Esquecimento** (lembrete D−3 reduz pagamentos em dia perdidos por falta de organização do cliente), **fricção operacional** (boleto fácil reenviado por WhatsApp aumenta conversão imediata) e **ausência de seguimento** (cliente sabe que ninguém cobra D+1, então deixa para depois). Os três combinados explicam 60-70% do PMRV efetivo > contratual.",
            correct: true,
            score: 25,
            feedback:
              "Correto e teoricamente fundamentado. **Comportamento de pagamento B2B não é principalmente sobre liquidez** — é sobre **fricção operacional** e **prioridade percebida**. Cliente que paga em dia o que cobra primeiro; cobrança automatizada coloca a Omega **na frente da fila**. Pesquisa Serasa mostra: 40-50% dos atrasos em B2B são **comportamentais** (esquecimento, prioridade), não financeiros — exatamente o alvo da automação.",
          },
          {
            id: "rb_b",
            label:
              "**Falta de dinheiro** do cliente — automação obriga o cliente a priorizar.",
            correct: false,
            score: 5,
            feedback:
              "**Mito comum**: a maioria dos atrasos B2B **não é por falta de dinheiro**, é por priorização e esquecimento. Cliente com problema genuíno de caixa **não paga independentemente** da intensidade da cobrança — aí a alavanca não é automação, é renegociação ou cessão.",
          },
          {
            id: "rb_c",
            label:
              "**Insatisfação com o serviço** — cliente retém pagamento como protesto.",
            correct: false,
            score: 5,
            feedback:
              "**Caso específico**, não causa principal. Insatisfação gera disputas pontuais que afetam <10% dos atrasos. Em maioria, atraso é operacional/comportamental — alvo certo da automação.",
          },
          {
            id: "rb_d",
            label:
              "**Falha técnica** do banco emissor do boleto — sistemas bancários têm muitos erros.",
            correct: false,
            score: 0,
            feedback:
              "Falhas técnicas existem mas são **raras** (< 2% dos boletos). Não explica PMRV crônico 30 dias acima do contratual. Não é causa material.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — Cessão de carteira > D+90 (deságio 50%)",
      shortLabel: "Cessão > D+90",
      description:
        "Vender trimestralmente a **carteira acima de D+90** para empresa especializada com **deságio de 50%** (recebe imediatamente 50% do valor de face). Libera caixa imediato, elimina custo administrativo prolongado e foca o time interno no recuperável. Ganho líquido recorrente **R$ 200 mil/ano**.",
      resultPanel: {
        headline: "Caixa imediato R$ 275 mil + recorrente R$ 200 mil/ano: libera time e monetiza o irrecuperável",
        deltas: [
          { label: "Caixa one-off (1ª cessão)", value: "+R$ 275 mil", tone: "positive" },
          { label: "Caixa recorrente (4 safras/ano)", value: "R$ 1,1 M/ano", tone: "positive" },
          { label: "Ganho líquido recorrente (vs recuperação interna)", value: "R$ 200 mil/ano", tone: "positive" },
          { label: "Δ PMRV efetivo (efeito limitado)", value: "75 → 70 dias", tone: "neutral" },
          { label: "Δ Inadimplência reconhecida", value: "Marginal (já estava provisionada)", tone: "neutral" },
          { label: "Custo de implantação", value: "R$ 0 (apenas contrato cessão)", tone: "positive" },
          { label: "Liberação de time interno", value: "Foco em D+1-60 (alavanca maior)", tone: "positive" },
        ],
        commentary:
          "**Monetização do irrecuperável + foco operacional.** A taxa de recuperação interna em >D+90 é **5%** — receber 50% via cessão é **10× mais** caixa imediato, com a vantagem adicional de **liberar 100% do tempo do time interno** para faixas onde a alavanca é maior (D+1-60). Recorrência trimestral (ceder a nova safra >D+90 a cada trimestre) gera fluxo constante de caixa **e** mantém a carteira interna limpa. Limitação: **não ataca a causa** (PMRV cai apenas 5 dias) — precisa ser combinado com cenário B (automação) para resultado pleno. Risco operacional: contratante de cessão exigente pode rejeitar parte da carteira (mais antigas, valor baixo) — negociar parâmetros antes.",
      },
      reflection: {
        prompt:
          "A cessão entrega 50% do face em caixa. Quando seria **errado ceder** (manter na carteira interna seria melhor)?",
        choices: [
          {
            id: "rc_a",
            label:
              "Quando o **cliente é estratégico** e há expectativa real de **renegociação amigável** que recupere 70%+ do valor sem queimar o relacionamento — cessão a 50% \"queima\" o cliente (terceiriza vira agressivo) e perde recuperação futura.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **Cessão é decisão definitiva e visível** — empresa especializada usa abordagem mais firme, e cliente pode interpretar como ruptura de relacionamento. Para **cliente estratégico** (compra recorrente alta, parceiro de longo prazo em dificuldade temporária), **renegociação interna** com parcelamento e desconto pode recuperar 70-90% **e** preservar o cliente para nova venda. Boa prática: **lista de exceção da cessão** — clientes estratégicos vão para tratamento dedicado interno, mesmo em >D+90.",
          },
          {
            id: "rc_b",
            label:
              "Quando o **deságio é > 60%** — abaixo desse patamar, faz sempre sentido manter internalizado.",
            correct: false,
            score: 10,
            feedback:
              "Argumento sobre **preço da cessão**, válido em análise de pricing — mas se o deságio fica em 60-70%, comparar com taxa de recuperação interna (5% em >D+90) ainda favorece cessão. Boundary não é só percentual de deságio; é **percentual × volume de trabalho liberado × ganho do foco operacional**.",
          },
          {
            id: "rc_c",
            label:
              "Quando a empresa **precisa do caixa imediato** — cessão é dominante quando precisa de liquidez.",
            correct: false,
            score: 5,
            feedback:
              "Inverte a pergunta — \"quando ceder\", não \"quando não ceder\". Necessidade de caixa **favorece** cessão, não justifica manter na carteira interna.",
          },
          {
            id: "rc_d",
            label:
              "Nunca — cessão sempre destrói valor versus recuperação paciente.",
            correct: false,
            score: 0,
            feedback:
              "Visão **otimista demais sobre recuperação tardia**. Em >D+90, recuperação interna é 5% — vs 50% via cessão. \"Paciência\" raramente entrega mais que cessão; tipicamente entrega menos com custo administrativo prolongado.",
          },
        ],
      },
    },
  ],
};
