import type { Scenario } from "@/types/scenario";

// =============================================================================
// S5.3 — Quitação antecipada de dívida vs investimento em capital de giro
// =============================================================================
// Premissas:
//
// Empresa: Comércio Tau (varejo regional).
// Caixa total: R$ 12 milhões.
// Saldo mínimo operacional: R$ 2 milhões.
// Caixa excedente disponível: R$ 10 milhões.
//
// Dívida atual:
//   Saldo: R$ 6 milhões
//   Taxa: CDI + 5% = 17% a.a. (CDI 12%)
//   Prazo remanescente: 18 meses
//   Multa de pré-pagamento: 2% sobre o saldo quitado
//
// Linha pré-aprovada (disponível para emergência):
//   R$ 6 milhões a CDI + 6% = 18% (se acionada)
//
// Projeto de redução de estoque (alternativa de investimento):
//   Investimento prévio: R$ 1 milhão (consultoria + sistemas + treinamento)
//   Resultado em 6 meses: libera R$ 4 milhões de capital empatado em estoque
//   Recorrente: redução de 22% a.a. em custo de carregamento sobre o liberado
//     = R$ 4 M × 22% = R$ 880 mil/ano (ganho recorrente)
//   Risco operacional: médio (ruptura possível durante transição)
//
// Aplicação alternativa do caixa: CDI = 12% a.a. (líquido de IR ~10,2%)
//
// Cenário A — Quitação integral imediata + manter R$ 4 M aplicados
//   Quitar R$ 6 M de dívida:
//     - Juros economizados (18m): 6 M × 17% × 18/12 simplificado = R$ 1,53 M
//       (mais preciso, com amortização linear ao longo de 18 m, duration ~9m:
//        6 M × 17% × 9/12 = R$ 765 mil de juros futuros poupados)
//     - Multa: 2% × 6 M = R$ 120 mil
//   Aplicar R$ 4 M ao CDI 12% (líquido ~10,2%) por 18 meses:
//     = R$ 4 M × 10,2% × 18/12 = R$ 612 mil
//   Ganho líquido total (18m): 765 − 120 + 612 = R$ 1.257 mil
//   Ganho anualizado: ~R$ 838 mil/ano
//
// Cenário B — Quitação parcial (R$ 4 M) + projeto de estoque (R$ 1 M)
//   Quitar R$ 4 M de dívida (resta R$ 2 M de saldo):
//     - Juros economizados (duration 9m): 4 M × 17% × 9/12 = R$ 510 mil
//     - Multa: 2% × 4 M = R$ 80 mil
//   Investir R$ 1 M em projeto de estoque:
//     - Libera R$ 4 M em 6m
//     - Ganho recorrente carregamento: R$ 880 mil/ano
//   Caixa remanescente (10 − 4 − 1 = 5 M, dos quais 4 M liberados pelo projeto
//     em 6m = 9 M total disponível eventually) aplicado ao CDI
//   Em 18 meses: 510 − 80 + 880×1,5 + 5×10,2%×1,5 = 510 − 80 + 1320 + 765
//     = R$ 2.515 mil
//   Ganho anualizado: ~R$ 1.677 mil/ano (potencialmente maior, com ressalva
//     de risco de execução do projeto)
//
// Cenário C — Manter dívida + investir tudo (R$ 1 M projeto + R$ 9 M aplicados)
//   Mantém custo da dívida: 6 M × 17% × 18/12 = R$ 1,53 M (pago)
//   Aplica 9 M ao CDI 10,2% líquido por 18 meses: 9 × 10,2% × 1,5 = R$ 1,38 M
//   Projeto: R$ 880 × 1,5 = R$ 1,32 M
//   Saldo: 1,38 + 1,32 − 1,53 = R$ 1,17 M em 18 meses = R$ 780 mil/ano
//   Vantagem: preserva linha disponível (sem usar pré-aprovação)
//   Desvantagem: paga dívida cara enquanto aplica em retorno menor
// =============================================================================

export const S5_3: Scenario = {
  id: "s5_3",
  code: "S5.3",
  title: "Quitação antecipada vs investimento em capital de giro — Comércio Tau",
  company: "Comércio Tau S.A.",
  difficulty: "Avançado",
  estimatedMinutes: 24,
  context: {
    narrative:
      "Você é tesoureiro(a) do **Comércio Tau**, varejista regional com **R$ 12 milhões em caixa**. Tirando o **saldo mínimo operacional de R$ 2 milhões**, sobram **R$ 10 milhões de excedente** para alocar. Há uma **dívida de R$ 6 milhões** a CDI + 5% (17% a.a.) com **18 meses remanescentes** e multa de pré-pagamento de **2%**. Em paralelo, surge um **projeto de redução de estoque**: investimento prévio de R$ 1 M libera R$ 4 M em 6 meses e gera **R$ 880 mil/ano** de ganho recorrente em custo de carregamento. Há **linha pré-aprovada de R$ 6 M** disponível para emergências futuras (se acionada, custaria CDI + 6%). O comitê quer comparar três caminhos: (A) **quitação integral** + aplicação do resto; (B) **quitação parcial** + projeto; (C) **manter dívida** + investir tudo (projeto + aplicação).",
    keyFacts: [
      ["Caixa total", "R$ 12,0 M"],
      ["Saldo mínimo operacional", "R$ 2,0 M"],
      ["Excedente disponível", "R$ 10,0 M"],
      ["Dívida atual", "R$ 6,0 M a CDI + 5% (17% a.a.)"],
      ["Prazo remanescente da dívida", "18 meses"],
      ["Multa de pré-pagamento", "2% sobre o saldo"],
      ["Projeto de estoque", "R$ 1 M investido → R$ 4 M liberados + R$ 880 k/ano"],
      ["Linha pré-aprovada (backup)", "R$ 6 M a CDI + 6%"],
    ],
  },
  statements: [
    {
      id: "comparacao_caminhos",
      title: "Comparação dos três caminhos (R$ mil em 18 meses)",
      unit: "R$ mil / meses",
      periods: ["A: Quitação integral", "B: Parcial + projeto", "C: Manter dívida + investir"],
      sections: [
        {
          label: "Movimentações iniciais (R$ mil)",
          rows: [
            { label: "Quitação de dívida (saída de caixa)", values: [-6000, -4000, 0], indent: 1 },
            { label: "Multa de pré-pagamento (2%)", values: [-120, -80, 0], indent: 1 },
            { label: "Investimento no projeto de estoque", values: [0, -1000, -1000], indent: 1 },
            { label: "Saldo aplicado restante (R$ mil)", values: [4000, 5000, 9000], emphasis: "bold" },
          ],
        },
        {
          label: "Ganhos em 18 meses (R$ mil)",
          rows: [
            { label: "Juros futuros economizados (duration 9m)", values: [765, 510, 0], indent: 1 },
            { label: "Custo da dívida que permanece", values: [0, -255, -1530], indent: 1 },
            { label: "Rendimento aplicação (CDI 10,2% líq.)", values: [612, 765, 1378], indent: 1 },
            { label: "Ganho do projeto (R$ 880 k/ano × 1,5)", values: [0, 1320, 1320], indent: 1 },
            { label: "Ganho líquido em 18 meses (R$ mil)", values: [1257, 2260, 1168], emphasis: "total" },
            { label: "Ganho anualizado (R$ mil/ano)", values: [838, 1507, 779], emphasis: "bold" },
          ],
        },
        {
          label: "Risco e flexibilidade",
          rows: [
            { label: "Risco de execução (1-5)", values: [1, 3, 3], indent: 1 },
            { label: "Caixa disponível pós-implantação (R$ mil)", values: [4000, 9000, 9000], indent: 1 },
            { label: "Linha pré-aprovada preservada (R$ mil)", values: [6000, 6000, 6000], indent: 1 },
            { label: "Reversibilidade (1=alta, 5=baixa)", values: [3, 4, 1], indent: 1 },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Avaliar a quitação antecipada.** Qual é o **cálculo correto** do ganho?",
      choices: [
        {
          id: "e1_a",
          label:
            "**Juros economizados ≈ R$ 765 mil** (R$ 6 M × 17% × duration 9 meses, considerando amortização linear ao longo de 18 m) **− Multa R$ 120 mil = R$ 645 mil de ganho da quitação**. Comparar com o que esse dinheiro renderia aplicado: 6 M × CDI 10,2% líquido × 18/12 = R$ 918 mil — só vale quitar se ganho > rendimento. Aqui: dívida 17% > aplicação 10,2% → quitar é dominante.",
          correct: true,
          score: 20,
          feedback:
            "Correto e rigoroso. **Duration** importa: dívida com amortização linear ao longo de 18 m tem **duration efetiva ~9 meses** (saldo médio), não 18 — porque o saldo cai progressivamente. Comparação correta é **custo da dívida (17%) vs retorno alternativo (CDI líquido ~10,2%)**: spread 6,8 pp favorece quitação. Multa de 2% é **custo afundado** mas tem que entrar na conta. Em quase qualquer cenário com dívida > 14% e aplicação a CDI puro, quitar é dominante.",
        },
        {
          id: "e1_b",
          label:
            "**Juros economizados = R$ 6 M × 17% × 18/12 = R$ 1.530 mil** (ganho total dos juros remanescentes).",
          correct: false,
          score: 5,
          feedback:
            "**Superestima** o ganho ao ignorar amortização. Saldo da dívida cai ao longo dos 18 meses (não permanece R$ 6 M o tempo todo) — duration efetiva é ~9 meses, não 18. Cálculo correto rende ~R$ 765 mil, não R$ 1.530 mil. Erro factor 2×.",
        },
        {
          id: "e1_c",
          label:
            "**Quitar é sempre dominante** se dívida > 0 — eliminar dívida é virtude financeira.",
          correct: false,
          score: 5,
          feedback:
            "**Princípio frequentemente verdadeiro, mas não absoluto**. Se a dívida tem custo menor que a aplicação alternativa (raro mas possível em subsídios BNDES), manter dívida + aplicar pode ser dominante. Aqui (17% vs 10,2%), quitar **é** dominante — mas a regra é **comparar taxas**, não \"quitar sempre\".",
        },
        {
          id: "e1_d",
          label:
            "**Multa de 2% torna a quitação inviável** — sempre deixa o ganho negativo.",
          correct: false,
          score: 0,
          feedback:
            "Multa de 2% em R$ 6 M = R$ 120 mil — **pequena** comparada ao ganho de juros poupados (R$ 765 mil). Multa raramente inviabiliza quitação; precisa ser > 5-7% para começar a anular ganho em dívidas de spread alto. Cálculo caso a caso, não regra de bolso.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Avaliar o projeto de estoque.** Qual é a **leitura financeira honesta**?",
      choices: [
        {
          id: "e2_a",
          label:
            "**Payback de R$ 1 M em ~14 meses** (R$ 880 mil/ano de ganho). **ROIC altíssimo** (~88% a.a. sobre o investimento, sem contar liberação one-off de R$ 4 M). Mais valioso ainda é o **caixa liberado** de R$ 4 M — usado para quitar mais dívida ou cobrir necessidades, gera ganho adicional.",
          correct: true,
          score: 20,
          feedback:
            "Correto. **Projeto de estoque** combina dois benefícios: (1) **liberação one-off** de capital empatado (R$ 4 M); (2) **ganho recorrente** em custo de carregamento (R$ 880k/ano). ROIC sobre investimento direto é ~88% a.a. — patamar **excepcional** para projeto operacional. Ressalva: ganho recorrente depende de **manutenção da disciplina** (estoque pode subir de novo se governança falhar) — risco real, mas controlável.",
        },
        {
          id: "e2_b",
          label:
            "**R$ 880 mil/ano é ganho \"contábil\"**, não caixa real — custo de carregamento é cálculo, não saída efetiva.",
          correct: false,
          score: 5,
          feedback:
            "**Confusão entre contábil e econômico**. Custo de carregamento (22% a.a. sobre estoque) **representa custo real**: financeiro (capital empatado), armazenagem, obsolescência. Reduzir esse custo gera **economia caixa real** — menos capital amarrado em CG ou menos juros pagos sobre dívida que financia o CG. Não é \"contábil\" — é tangível.",
        },
        {
          id: "e2_c",
          label:
            "**Projeto deve ser rejeitado** — R$ 1 M de investimento é arriscado em momento de excedente de caixa.",
          correct: false,
          score: 0,
          feedback:
            "**Lógica invertida**: ter caixa excedente é justamente quando se investe em projetos de alto ROIC — não quando se rejeita. Rejeitar projeto com payback 14 meses e ganho recorrente R$ 880k/ano por \"R$ 1 M ser arriscado\" é destruir valor sistematicamente.",
        },
        {
          id: "e2_d",
          label:
            "**R$ 880 mil/ano é otimista** — empresas raramente entregam o projetado.",
          correct: false,
          score: 10,
          feedback:
            "**Crítica válida** (projeções operacionais costumam ser otimistas), mas **não anula** o projeto. Mesmo entregando 50% do projetado (R$ 440 mil/ano), payback ainda é 27 meses — bom em qualquer comparação. Boa prática: **rodar cenário base + cenário conservador** (60-70% do projetado) e verificar se ainda passa o teste — neste caso, passa.",
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
            "**Cenário B (parcial + projeto)** — entrega o **maior ganho anualizado** (R$ 1.507 k/ano vs R$ 838 do A). Captura **dois benefícios simultaneamente**: redução de custo financeiro (quitação parcial) **e** redução de custo operacional (projeto). Risco residual: execução do projeto.",
          correct: true,
          score: 20,
          feedback:
            "Correto e estratégico. **Cenários A, B e C não são mutuamente exclusivos** — B é a combinação que captura o melhor de cada componente. Quitação parcial (R$ 4 M) elimina a parte mais cara da dívida; R$ 1 M no projeto destrava ganho operacional substancial; R$ 5 M aplicados aguardam liberação adicional de R$ 4 M do projeto (em 6 m) para nova rodada de quitação ou aplicação. Vantagem adicional: **caixa pós-implantação ainda em R$ 9 M** (aplicado + liberado), preservando flexibilidade.",
        },
        {
          id: "e3_b",
          label:
            "**Cenário A (quitação integral)** — elimina dívida cara, é a decisão mais conservadora e segura.",
          correct: false,
          score: 10,
          feedback:
            "**Decisão correta mas subótima** — ganha R$ 838 k/ano, mas **abre mão do projeto** que poderia adicionar R$ 880 k/ano. A escolha entre \"quitar tudo ou investir tudo\" é falsa — B captura ambos. Segurança extra (caixa pós-implantação R$ 4 M vs R$ 9 M) não compensa R$ 670 k/ano de ganho perdido.",
        },
        {
          id: "e3_c",
          label:
            "**Cenário C (manter dívida + investir)** — preserva caixa total e linha de crédito.",
          correct: false,
          score: 5,
          feedback:
            "**Pior ganho dos três** (R$ 779 k/ano) porque **paga juros caros (17%) enquanto aplica em retorno menor (10,2%)** — destruição de spread. \"Preservar caixa\" tem valor, mas R$ 9 M em caixa pagando dívida a 17% é antipadrão clássico. C só faz sentido se a empresa **espera necessidade imediata** de R$ 5+ M (M&A, CAPEX inesperado), o que não é o caso aqui.",
        },
        {
          id: "e3_d",
          label:
            "**Mix A + projeto** (quitação integral + R$ 1 M no projeto, R$ 3 M aplicados) — combina segurança do A com ganho do projeto.",
          correct: false,
          score: 15,
          feedback:
            "**Solução defensável e próxima do ótimo**. Vantagens: elimina toda dívida (segurança), captura projeto (ganho operacional). Desvantagem vs B: deixa apenas R$ 3 M aplicado vs R$ 5 M do B (menos buffer de caixa). Diferença pequena de ganho anualizado entre essa proposta e B (~R$ 100 k/ano a favor de B). Aceitável; B é marginalmente melhor por preservar mais flexibilidade de caixa.",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Quitação integral + manter R$ 4 M aplicados",
      shortLabel: "Quitação integral",
      description:
        "**Quitar 100% da dívida (R$ 6 M)** com multa de R$ 120 mil. Resto (R$ 4 M) aplicado em CDI a 10,2% líquido. Ganho líquido **R$ 838 mil/ano**. Elimina custo financeiro mais caro, mas **deixa o projeto de estoque em cima da mesa** (R$ 880 k/ano não capturados).",
      resultPanel: {
        headline: "Ganho R$ 838 mil/ano — elimina dívida cara, mas perde projeto de R$ 880 k/ano",
        deltas: [
          { label: "Juros futuros poupados (18m)", value: "R$ 765 mil", tone: "positive" },
          { label: "Multa de pré-pagamento", value: "−R$ 120 mil", tone: "negative" },
          { label: "Rendimento aplicação (18m, R$ 4 M)", value: "+R$ 612 mil", tone: "positive" },
          { label: "Ganho líquido em 18 meses", value: "R$ 1.257 mil", tone: "positive" },
          { label: "Ganho anualizado", value: "R$ 838 mil/ano", tone: "positive" },
          { label: "Caixa pós-implantação", value: "R$ 4 M aplicado + R$ 2 M mínimo", tone: "positive" },
          { label: "Custo de oportunidade vs B", value: "−R$ 670 k/ano (projeto não capturado)", tone: "negative" },
        ],
        commentary:
          "**Política dominante quando há aversão a risco de execução de projeto** ou quando o projeto de estoque não tem capacidade organizacional para ser executado. Captura ganho substancial via eliminação da dívida cara (spread de ~7 pp sobre aplicação), mas **abre mão da alavanca operacional** (projeto de estoque com ROIC 88% a.a.). Em empresa com governança madura e disciplina operacional, **deixar projeto na mesa** é custo de oportunidade material. Boa prática: combinar quitação com projeto (cenário B) sempre que a organização tem capacidade de executar ambos em paralelo.",
      },
      reflection: {
        prompt:
          "Por que A é considerada \"subótima\" mesmo com ganho de R$ 838 k/ano? Qual seria o **único cenário** em que A vence B?",
        choices: [
          {
            id: "ra_a",
            label:
              "Quando a empresa **não tem capacidade organizacional** para executar o projeto de estoque — time pequeno, sem expertise em gestão de estoques, ou em meio a outra transformação prioritária. Sem capacidade de execução, o R$ 1 M investido vira sunk cost e o ganho recorrente não se materializa.",
            correct: true,
            score: 25,
            feedback:
              "Correto e prático. **Decisões financeiras dependem de capacidade de execução** — projeto com ROIC alto em planilha mas sem time para entregar **vira destruição de valor** (gasta R$ 1 M sem ganho). A vence B **somente quando o projeto não pode ser executado** com confiança. Boa prática: **avaliar capacidade organizacional** antes de assumir entrega plena de projetos — frequentemente o gargalo é capacidade, não capital.",
          },
          {
            id: "ra_b",
            label:
              "Quando o CDI **subir muito** — aplicação aumenta retorno e quitação fica menos vantajosa.",
            correct: false,
            score: 5,
            feedback:
              "**CDI mais alto** beneficia aplicação **e** dívida (que é CDI + spread) — ambas sobem; spread sobre CDI permanece. Quitação continua dominante enquanto spread positivo existir. CDI alto **não inverte** a decisão entre A e B.",
          },
          {
            id: "ra_c",
            label:
              "Quando a multa de pré-pagamento for **muito alta** (> 5%) — aí quitação fica inviável.",
            correct: false,
            score: 5,
            feedback:
              "Multa muito alta torna **toda quitação** (A e B) inviável, não inverte A vs B. Ambas as opções perdem ganho similar; comparação entre A e B continua a mesma (B vence por capturar projeto adicional).",
          },
          {
            id: "ra_d",
            label:
              "Nunca — B sempre domina porque captura mais um benefício.",
            correct: false,
            score: 10,
            feedback:
              "Quase verdade matematicamente, mas omite **risco de execução** do projeto. Se projeto fracassa (gasta R$ 1 M sem entregar), B vira pior que A — perde-se R$ 1 M + multa de quitação parcial sem ganho compensatório. A vence B quando P(fracasso do projeto) é alta.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — Quitação parcial (R$ 4 M) + projeto de estoque",
      shortLabel: "Parcial + projeto",
      description:
        "**Quitar R$ 4 M da dívida** (resta R$ 2 M de saldo a 17%) e **investir R$ 1 M no projeto de estoque**. Caixa remanescente R$ 5 M aplicado, mais R$ 4 M liberados pelo projeto em 6 meses. Ganho **R$ 1.507 mil/ano** — maior dos três. Risco de execução do projeto.",
      resultPanel: {
        headline: "Ganho R$ 1,5 M/ano (+R$ 670 k vs A): captura quitação E projeto, requer execução",
        deltas: [
          { label: "Juros poupados (R$ 4 M × 17% × 9/12)", value: "+R$ 510 mil (18m)", tone: "positive" },
          { label: "Custo da dívida remanescente (R$ 2 M × 17% × 18/12)", value: "−R$ 510 mil (18m)", tone: "negative" },
          { label: "Multa de pré-pagamento", value: "−R$ 80 mil", tone: "negative" },
          { label: "Investimento no projeto", value: "−R$ 1.000 mil", tone: "negative" },
          { label: "Ganho recorrente do projeto (18m)", value: "+R$ 1.320 mil", tone: "positive" },
          { label: "Rendimento aplicação remanescente", value: "+R$ 765 mil", tone: "positive" },
          { label: "Ganho anualizado", value: "R$ 1.507 mil/ano", tone: "positive" },
        ],
        commentary:
          "**Política dominante para empresa com capacidade de execução madura.** Combina três alavancas: (1) **quitação parcial** elimina a parte mais sensível da dívida; (2) **projeto de estoque** captura ganho operacional estrutural; (3) **caixa preservado** (R$ 5 M aplicado + R$ 4 M liberado em 6 m = R$ 9 M total) mantém flexibilidade ampla. Risco principal: **execução do projeto** — R$ 1 M sunk se falhar, mas mesmo nesse cenário B ainda gera ganho próximo de A (R$ 838 − R$ 200 de overhead). Vantagem secundária: dívida residual de R$ 2 M **mantém relacionamento bancário ativo** (cliente continua com operações), preservando capacidade de captação futura.",
      },
      reflection: {
        prompt:
          "Em 6 meses, projeto entrega o esperado (R$ 4 M liberados). Qual deveria ser a **próxima ação** de tesouraria?",
        choices: [
          {
            id: "rb_a",
            label:
              "**Quitar os R$ 2 M restantes da dívida** com parte do caixa liberado (R$ 2 M de R$ 4 M). Resto (R$ 2 M) aplicado ou reservado para próximas oportunidades. Elimina remanescente da dívida cara, aumenta caixa livre para R$ 7 M aplicado.",
            correct: true,
            score: 25,
            feedback:
              "Correto e consistente com a lógica B. **Liberação do projeto é momento natural para liquidar dívida remanescente** — captura mais economia de juros, simplifica balanço. Boa prática: **planejar ações sequenciais** desde o início (B é projeto multi-fase, não decisão one-shot). Cronograma: M0 quitar parcial + projeto; M6 liberação + quitar remanescente; M12 reavaliar com novo cenário.",
          },
          {
            id: "rb_b",
            label:
              "**Aplicar todos os R$ 4 M ao CDI** — caixa é sempre opção dominante.",
            correct: false,
            score: 5,
            feedback:
              "Aplicar a 10,2% líquido enquanto **dívida custa 17%** é destruir 6,8 pp/ano sobre R$ 2 M = R$ 136 k/ano. Quitar a dívida remanescente é dominante; aplicar o **resto** sim.",
          },
          {
            id: "rb_c",
            label:
              "**Iniciar segundo projeto operacional** (cobrança, fornecedores) com os R$ 4 M.",
            correct: false,
            score: 10,
            feedback:
              "Boa ambição (continuar otimizando), mas **prematuro**: primeiro projeto recém-estabilizado, capacidade organizacional ainda absorvendo mudança. Quitar dívida remanescente é decisão **simples e robusta**; novos projetos podem entrar no horizonte de 12-18 meses.",
          },
          {
            id: "rb_d",
            label:
              "**Distribuir como dividendo extraordinário** — caixa excedente após projetos volta para acionistas.",
            correct: false,
            score: 0,
            feedback:
              "**Decisão de dividendo não é decisão de tesouraria isolada** — exige aprovação societária e considera ciclo de investimento da empresa. Mesmo se aprovado, quitar dívida primeiro é prioridade técnica (elimina custo recorrente de 17%); dividendo pode vir do **excedente após** otimização da estrutura de capital.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — Manter dívida + investir tudo (projeto + aplicação)",
      shortLabel: "Manter + investir",
      description:
        "**Manter os R$ 6 M de dívida**, investir R$ 1 M no projeto, aplicar R$ 9 M restantes ao CDI. Ganho **R$ 779 mil/ano** — o menor dos três. Lógica de \"preservar liquidez\" custa caro porque mantém spread negativo (dívida 17% × aplicação 10,2%).",
      resultPanel: {
        headline: "Ganho R$ 779 mil/ano (o menor): paga 17% em dívida enquanto aplica a 10,2% — destruição de spread",
        deltas: [
          { label: "Custo da dívida mantida (18m)", value: "−R$ 1.530 mil", tone: "negative" },
          { label: "Rendimento aplicação (R$ 9 M × 10,2% × 18/12)", value: "+R$ 1.378 mil", tone: "positive" },
          { label: "Investimento projeto", value: "−R$ 1.000 mil", tone: "negative" },
          { label: "Ganho recorrente projeto (18m)", value: "+R$ 1.320 mil", tone: "positive" },
          { label: "Ganho líquido em 18 meses", value: "R$ 1.168 mil", tone: "neutral" },
          { label: "Ganho anualizado", value: "R$ 779 mil/ano", tone: "neutral" },
          { label: "Caixa preservado", value: "R$ 11 M (incluindo mínimo)", tone: "positive" },
        ],
        commentary:
          "**Política subótima na maioria dos cenários** — destrói **6,8 pp/ano de spread** sobre R$ 6 M = ~R$ 408 k/ano em destruição de valor pura. Defensável apenas em três contextos: (1) **expectativa de necessidade imediata** de R$ 5+ M (M&A em curso, CAPEX inesperado iminente), onde caixa em mãos vale mais que economia de juros; (2) **multa de pré-pagamento alta** (> 7-10%), que anularia o ganho da quitação; (3) **dívida com taxa especial** (subsídio BNDES, linha promocional) que poderia ser perdida se quitada. Fora desses contextos, C representa **inércia disfarçada de prudência**.",
      },
      reflection: {
        prompt:
          "Em qual contexto C **realmente é dominante** sobre A e B?",
        choices: [
          {
            id: "rc_a",
            label:
              "Quando a empresa tem **certeza de oportunidade de M&A iminente** (próximos 6-12 meses) que exige caixa disponível **imediatamente**, sem tempo para reabrir capacidade de captação. Aí preservar R$ 11 M em caixa é mais valioso que economizar R$ 408 k/ano de spread.",
            correct: true,
            score: 25,
            feedback:
              "Correto e específico. **Optionalidade futura** (M&A, CAPEX estratégico, aquisição de competidor em dificuldade) é o único motivo robusto para manter caixa com dívida ativa. Cálculo: probabilidade de oportunidade × valor da oportunidade vs custo de oportunidade do spread. Se P(oportunidade) > 30% e valor > R$ 2-3 M de NPV, manter caixa pode ser dominante. Sem oportunidade clara à vista, C é inércia.",
          },
          {
            id: "rc_b",
            label:
              "Quando a empresa não tem **confiança nos números do projeto** — manter caixa é mais seguro.",
            correct: false,
            score: 5,
            feedback:
              "Se não há confiança no projeto, **decisão correta é não fazer o projeto** (escolher A), não manter dívida. C inclui o projeto + manter dívida — pior de dois mundos: incerteza do projeto **e** custo da dívida.",
          },
          {
            id: "rc_c",
            label:
              "Quando o CFO prefere **simplicidade** — manter status quo evita decisões.",
            correct: false,
            score: 0,
            feedback:
              "**Preferência sem fundamento técnico destrói valor**. C custa R$ 730 k/ano vs B; \"simplicidade\" não justifica esse custo. Boa governança exige **decisões fundamentadas**, não inércia confortável.",
          },
          {
            id: "rc_d",
            label:
              "Quando o **rating bancário** depende de manter dívida ativa — bancos veem cliente sem dívida como menos atraente.",
            correct: false,
            score: 5,
            feedback:
              "**Verdade parcial em casos específicos** (bancos preferem clientes com operações ativas), mas exagero como motivo. \"Manter relacionamento\" justifica deixar R$ 1-2 M de dívida ativa, não R$ 6 M. Argumento mais forte é optionalidade real (M&A, CAPEX), não relacionamento bancário.",
          },
        ],
      },
    },
  ],
};
