import type { Scenario } from "@/types/scenario";

// =============================================================================
// S5.2 — Negociação com fornecedor estratégico — prazo vs desconto
// =============================================================================
// Premissas:
//
// Empresa: Distribuidora Ípsilon (atacado alimentar).
// Fornecedor principal: 35% das compras anuais = R$ 18 milhões.
// Compra mensal média do fornecedor: R$ 1,5 M.
// CDI: 12% a.a. WACC da empresa: 17% a.a.
//
// Proposta do fornecedor (escolher uma):
//   A) Manter prazo 30 dias com desconto à vista de 2%
//   B) Estender prazo para 60 dias sem desconto
//
// Cálculo do custo do desconto não tomado (Opção B vs A):
// Tomar desconto = pagar D+0 em vez de D+30 → 30 dias antecipados
// Custo do desconto não tomado = (2/98)^(360/30) − 1
//   (Fórmula clássica do custo de oportunidade do desconto)
//   = (1,02041)^12 − 1 = 27,4% a.a.
//
// Comparação com WACC (17%): Tomar desconto (Opção A pagando à vista)
//   é vantajoso porque 27,4% > 17%
//   Empresa economiza 27,4 − 17 = 10,4 pp/ano sobre o valor antecipado
//
// Cálculo absoluto:
//   Desconto integral (Opção A): 2% × R$ 18 M = R$ 360 mil/ano
//   Custo de financiar à vista (em vez de 30 dias):
//     Capital adicional empatado: R$ 18 M × 30/360 = R$ 1,5 M
//     Custo a WACC 17%: R$ 1,5 M × 17% = R$ 255 mil/ano
//   Ganho líquido Opção A: R$ 360 − R$ 255 = R$ 105 mil/ano
//
// Opção B (prazo 60 d, sem desconto):
//   Funding implícito adicional: 30 dias adicionais × R$ 18 M / 360 = R$ 1,5 M
//   Ganho financeiro (vs ter que captar R$ 1,5 M a WACC 17%):
//     R$ 1,5 M × 17% = R$ 255 mil/ano (custo evitado)
//   Desconto perdido: R$ 360 mil/ano
//   Líquido Opção B: R$ 255 − R$ 360 = −R$ 105 mil/ano
//
// Diferença A − B = R$ 210 mil/ano a favor de A.
//
// Opção C — Meio termo (45 dias com 1% desconto):
//   Desconto: 1% × R$ 18 M = R$ 180 mil/ano
//   Custo de antecipar 15 dias: R$ 18 M × 15/360 × 17% = R$ 127,5 mil/ano
//   Ganho líquido: R$ 180 − R$ 127,5 = R$ 52,5 mil/ano
//   Worse than A but better than B.
//
// Risco relacional (qualitativo): pressionar fornecedor estratégico
// (35% das compras) por mais prazo é arriscado — concentração.
// =============================================================================

export const S5_2: Scenario = {
  id: "s5_2",
  code: "S5.2",
  title: "Negociação com fornecedor estratégico — Distribuidora Ípsilon",
  company: "Distribuidora Ípsilon Ltda.",
  difficulty: "Intermediário",
  estimatedMinutes: 22,
  context: {
    narrative:
      "Você é tesoureiro(a) da **Distribuidora Ípsilon**, atacadista alimentar. O **fornecedor principal** — responsável por **35% das compras anuais (R$ 18 milhões)** — colocou duas alternativas comerciais sobre a mesa: **(A) manter o prazo de 30 dias com desconto à vista de 2%** ou **(B) estender o prazo para 60 dias sem desconto**. A área comercial vê apelo no prazo maior (libera caixa para outros usos); a tesouraria precisa calcular **qual opção entrega mais valor**, considerando que o **WACC da empresa é 17% a.a.** e o **CDI** está em **12%**. Há também a possibilidade de propor um **meio termo (45 dias com 1% de desconto)** — se o fornecedor aceitar. A escolha precisa balancear ganho financeiro com **risco relacional** (concentração de 35% no fornecedor) e **disponibilidade de caixa** para pagar à vista.",
    keyFacts: [
      ["Volume anual com fornecedor", "R$ 18,0 M"],
      ["Compra mensal média", "R$ 1,5 M"],
      ["Concentração do fornecedor", "35% das compras"],
      ["A: prazo + desconto à vista", "30 d / 2%"],
      ["B: prazo estendido", "60 d / sem desconto"],
      ["C: meio termo (a negociar)", "45 d / 1%"],
      ["WACC", "17% a.a."],
      ["CDI", "12% a.a."],
    ],
  },
  statements: [
    {
      id: "comparacao_opcoes",
      title: "Análise financeira das três opções (R$ mil/ano)",
      unit: "R$ mil / % / dias",
      periods: ["A: 30d + 2% desc.", "B: 60d sem desc.", "C: 45d + 1% desc."],
      sections: [
        {
          label: "Parâmetros da operação",
          rows: [
            { label: "Prazo de pagamento (dias)", values: [30, 60, 45], indent: 1 },
            { label: "Desconto à vista (%)", values: [2.0, 0.0, 1.0], indent: 1 },
            { label: "Valor antecipado vs base 30 d (R$ mil)", values: [1500, -1500, 750], indent: 1 },
          ],
        },
        {
          label: "Ganho financeiro anual (R$ mil)",
          rows: [
            { label: "Desconto capturado (sobre R$ 18 M)", values: [360, 0, 180], indent: 1 },
            { label: "Custo de antecipar pagamento (WACC 17%)", values: [-255, 0, -128], indent: 1 },
            { label: "Ganho financeiro de prazo estendido (WACC 17%)", values: [0, 255, 0], indent: 1 },
            { label: "Ganho líquido (R$ mil/ano)", values: [105, -105, 52], emphasis: "total" },
          ],
        },
        {
          label: "Métricas comparativas",
          rows: [
            { label: "Custo do desconto não tomado (% a.a.)", values: [27.4, 27.4, 27.4], indent: 1 },
            { label: "WACC da empresa (% a.a.)", values: [17.0, 17.0, 17.0], indent: 1 },
            { label: "Diferencial (favorece tomar o desconto?)", values: [10.4, 10.4, 10.4], emphasis: "bold" },
          ],
        },
        {
          label: "Aspectos relacionais e operacionais",
          rows: [
            { label: "Aceitação esperada do fornecedor (1-5)", values: [5, 3, 4], indent: 1 },
            { label: "Risco relacional (concentração 35%)", values: [1, 3, 2], indent: 1 },
            { label: "Requer caixa imediato? (1=sim)", values: [1, 0, 1], indent: 1 },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Calcular o custo do desconto não tomado.** Qual é o **custo anualizado** de NÃO tomar o desconto (\"financiar-se\" no fornecedor por 30 dias)?",
      choices: [
        {
          id: "e1_a",
          label:
            "**(2/98)^(360/30) − 1 = (1,0204)^12 − 1 ≈ 27,4% a.a.** O custo do desconto não tomado é taxa anualizada composta sobre a fração desconto/(1−desconto), capitalizada pelo número de períodos no ano.",
          correct: true,
          score: 20,
          feedback:
            "Correto e é a **fórmula clássica** do custo de crédito comercial. Lógica: se você paga 100 em D+30 ou 98 em D+0, você está **\"tomando emprestado\" R$ 98 por 30 dias e pagando R$ 100** = 2,04% em 30 dias (= 2/98). Anualizando composto: (1,0204)^12 − 1 = 27,4%. Significado: **o fornecedor está \"cobrando\" 27,4% a.a.** pelo crédito comercial implícito. Compare com WACC (17%): se você pode financiar mais barato no mercado, **pague à vista** (toma o desconto) e capture os 10,4 pp/ano de diferença.",
        },
        {
          id: "e1_b",
          label:
            "**2% × 12 = 24% a.a.** — linear, mais simples.",
          correct: false,
          score: 5,
          feedback:
            "**Linearização ignora composição** e **base errada** (deveria ser 2/98, não 2/100). Resultado correto é 27,4% (composto sobre 2/98), não 24% (linear sobre 2/100). Diferença de 3,4 pp **importa** em comparação com WACC — pode inverter a decisão em casos limite.",
        },
        {
          id: "e1_c",
          label:
            "**Custo é zero** — desconto é oferta voluntária do fornecedor, não custo.",
          correct: false,
          score: 0,
          feedback:
            "**Conceitualmente errado**. \"Não tomar desconto\" tem **custo de oportunidade** real — você está pagando R$ 100 em D+30 em vez de R$ 98 em D+0, ou seja, **pagando R$ 2 a mais por 30 dias de funding**. Custo de oportunidade é custo financeiro, mesmo sem juros explícitos no contrato.",
        },
        {
          id: "e1_d",
          label:
            "**2% × (365/30) = 24,3% a.a.** — anualização simples.",
          correct: false,
          score: 10,
          feedback:
            "**Anualização linear** sobre 2% (base correta seria 2/98) e **sem composição**. Aproxima o resultado certo (27,4%), mas omite efeito composto. Em prazos curtos (30 dias) e taxas pequenas, linear vs composto difere ~3 pp; vale fazer composto.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Comparar com o WACC.** Custo do desconto não tomado é **27,4% a.a.**; WACC da Ípsilon é **17% a.a.** Qual é a **decisão financeira correta**?",
      choices: [
        {
          id: "e2_a",
          label:
            "**Tomar o desconto (Opção A) sempre que WACC < 27,4%.** A empresa captura **diferencial de 10,4 pp/ano** — equivale a financiar-se a 17% no mercado e \"investir\" a 27,4% no desconto. Em valor absoluto: ganho líquido de R$ 105 mil/ano após o custo de financiar a antecipação.",
          correct: true,
          score: 20,
          feedback:
            "Correto e é a **regra básica do crédito comercial**: tome desconto sempre que o **custo de oportunidade do desconto não tomado** for **maior que o custo marginal de funding**. Aqui: 27,4% > 17%, então tomar é dominante. Boa prática: tesouraria deve **mapear** todos os descontos comerciais oferecidos por fornecedores, calcular custo equivalente, e priorizar os mais altos para tomada. Em alguns casos, **vale tomar dívida bancária a 17%** especificamente para tomar desconto que custa 27,4% — arbitragem trivial.",
        },
        {
          id: "e2_b",
          label:
            "**Pegar o prazo de 60 dias (Opção B)** — funding mais barato (zero custo aparente) é sempre dominante.",
          correct: false,
          score: 0,
          feedback:
            "**\"Zero custo aparente\" é mito** — o custo do prazo está embutido na recusa do desconto. Tomar 60 dias \"sem desconto\" significa **renunciar a R$ 360k/ano** em desconto explícito. Equivalente a tomar empréstimo de R$ 1,5 M (o capital extra empatado) a 27,4% a.a. — muito mais caro que WACC 17%. Confusão clássica entre \"juros explícitos\" e \"custo real\".",
        },
        {
          id: "e2_c",
          label:
            "**Comparar com CDI (12%)** — se o desconto > CDI, tomar; aqui 27,4% > 12%, então tomar.",
          correct: false,
          score: 10,
          feedback:
            "**Resposta correta no resultado, mas premissa errada.** Comparação correta é com **WACC** (custo marginal de funding da empresa), não CDI (que é taxa de mercado, geralmente menor que o custo da empresa). Usar CDI subestima o custo de captação; em empresa onde WACC = 30% (alto risco), \"tomar desconto se > CDI\" levaria a tomar descontos que custam 28% a.a. — destruição de valor.",
        },
        {
          id: "e2_d",
          label:
            "**Decisão depende do tamanho do desconto absoluto** (R$ 360 mil) — se importante, tomar; se marginal, deixar.",
          correct: false,
          score: 0,
          feedback:
            "**Métrica errada**: tamanho absoluto não muda a economia da decisão. Em qualquer volume, comparar **taxa do desconto vs WACC** dá a resposta correta. Se taxa do desconto > WACC, **sempre** vale; se <, **nunca** vale — independente de R$ 360k ou R$ 36k.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Considerar o aspecto relacional.** O fator relacional **muda a decisão**?",
      choices: [
        {
          id: "e3_a",
          label:
            "**Aceitar Opção A (30 d + 2% desconto)** — é o que o fornecedor já ofereceu, ganho de R$ 105 k/ano, **preserva relacionamento** (nada negociado, decisão dentro da oferta). Pleitear Opção C **arrisca relacionamento** (fornecedor pode interpretar como falta de caixa ou pressão) para ganho menor (R$ 52k/ano).",
          correct: true,
          score: 20,
          feedback:
            "Correto e maduro. **Concentração de 35% é fator de risco** — pressionar fornecedor estratégico pode (1) deteriorar relação (fornecedor pode reduzir prioridade, atrasar entregas em alta demanda), (2) sinalizar fragilidade financeira (fornecedor compartilha info na cadeia, afeta outros fornecedores). Opção A captura o melhor ganho **dentro da oferta espontânea** — ganho de R$ 105k/ano sem fricção relacional. C captura **metade do ganho com fricção**. Boa prática: **negociações estruturantes** com fornecedores estratégicos vêm em janela própria (revisão anual), não em resposta a oferta pontual.",
        },
        {
          id: "e3_b",
          label:
            "**Pleitear Opção C (45 d + 1% desc.)** — meio termo é compromisso comercial saudável, mostra negociação ativa.",
          correct: false,
          score: 10,
          feedback:
            "Captura **menos ganho** (R$ 52 mil vs R$ 105 mil) **e** sinaliza ao fornecedor que a Ípsilon está **mais sensível a prazo** (pode ser interpretado como necessidade de caixa). Em fornecedor de 35% de concentração, **toda sinalização tem custo** — perde-se poder de barganha futura. Negociação \"intermediária\" sem necessidade é antipadrão.",
        },
        {
          id: "e3_c",
          label:
            "**Pleitear Opção B (60 d, sem desc.)** — preserva caixa para crescimento da empresa.",
          correct: false,
          score: 0,
          feedback:
            "**Destruidora de valor** (perde R$ 105 mil/ano vs A) e **pior em relação** ao fornecedor (pede mais sem oferecer contrapartida). Combinação de pior financeiramente + pior relacionalmente — escolha pior das três.",
        },
        {
          id: "e3_d",
          label:
            "**Recusar todas e buscar outro fornecedor** — concentração de 35% é risco, diversificar é prioridade.",
          correct: false,
          score: 5,
          feedback:
            "**Confunde decisão tática com estratégica**. Diversificação de fornecedor é projeto estruturante de 12-24 meses (qualificação, contratos, validação de qualidade) — não se resolve recusando oferta pontual e \"buscando outro\". Aceitar Opção A hoje **e** estruturar diversificação em paralelo é a resposta completa.",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Opção A — pagar à vista com 2% de desconto",
      shortLabel: "À vista + desc.",
      description:
        "Aceitar **manter prazo de 30 dias e tomar desconto de 2%** sempre que houver caixa para pagar à vista (em D+0). Captura **R$ 360 mil/ano em desconto**, paga R$ 255 mil em custo de antecipação a WACC 17%, **ganho líquido R$ 105 mil/ano**. Preserva relacionamento (decisão dentro da oferta) e simplifica operação.",
      resultPanel: {
        headline: "Ganho R$ 105 mil/ano, captura 10,4 pp de diferencial entre desconto (27,4%) e WACC (17%)",
        deltas: [
          { label: "Desconto capturado (R$/ano)", value: "R$ 360 mil", tone: "positive" },
          { label: "Custo de antecipar pagamento (WACC 17%)", value: "−R$ 255 mil", tone: "negative" },
          { label: "Ganho líquido anual", value: "R$ 105 mil/ano", tone: "positive" },
          { label: "Custo do desconto não tomado (% a.a.)", value: "27,4%", tone: "neutral" },
          { label: "Diferencial vs WACC", value: "+10,4 pp/ano", tone: "positive" },
          { label: "Risco relacional", value: "Nulo — decisão dentro da oferta", tone: "positive" },
          { label: "Requer caixa imediato", value: "Sim — R$ 1,5 M de saldo médio adicional", tone: "negative" },
        ],
        commentary:
          "**Política dominante** quando WACC < custo do desconto (regra que vale para a maioria das empresas saudáveis com WACC 12-20%). Captura ganho financeiro relevante sem fricção comercial. Requisito operacional: **caixa adicional médio de R$ 1,5 M** (porque você paga 30 dias antes do prazo originalmente possível) — verificar se o saldo de caixa suporta ou se é necessário **captar funding marginal** para tomar o desconto (ainda assim viável se funding < 27,4%). Boa prática: **fluxo automatizado** — todo pagamento elegível para desconto é avaliado por regra (\"se desconto anualizado > WACC + 3 pp, paga à vista\") e processado automaticamente.",
      },
      reflection: {
        prompt:
          "Se a Ípsilon **não tem caixa suficiente** para pagar à vista, a decisão muda?",
        choices: [
          {
            id: "ra_a",
            label:
              "**Não — captar funding marginal** (CG, CG-CC) **para tomar o desconto** ainda é dominante, desde que o custo do funding < 27,4%. CG a CDI + 5% = 17% custa muito menos que 27,4%; arbitragem clara de 10,4 pp/ano.",
            correct: true,
            score: 25,
            feedback:
              "Correto e regra geral. **Arbitragem de desconto** é uma das operações mais lucrativas em tesouraria: tomar dívida a 17% para \"investir\" no desconto que rende 27,4% **garante** 10,4 pp/ano. Único limite: capacidade de captação (linhas pré-aprovadas). Boa prática: incluir **linhas dedicadas a arbitragem de desconto** no plano de funding — algumas empresas tratam isso como linha de capital de giro normal, sem perceber que está sustentando ganho substancial.",
          },
          {
            id: "ra_b",
            label:
              "**Sim — se não há caixa, pegar Opção B** (60 dias sem desconto) automaticamente.",
            correct: false,
            score: 0,
            feedback:
              "**Antipadrão** — pular para a opção pior só porque não tem caixa próprio. Tomar funding marginal a 17% para capturar arbitragem é decisão financeira clara, mesmo sem caixa próprio. \"Não tem caixa\" não anula a economia; apenas obriga a captar.",
          },
          {
            id: "ra_c",
            label:
              "**Sim — sem caixa, pegar Opção C** (45 dias, 1% desc.) como meio termo.",
            correct: false,
            score: 5,
            feedback:
              "Idem: \"não ter caixa próprio\" não é razão para abrir mão de ganho — é razão para **captar** funding marginal. Cair em C é ganho menor que A com financiamento; A com captação é dominante.",
          },
          {
            id: "ra_d",
            label:
              "**Sim — sem caixa, manter status quo** (30 dias sem desconto) e revisitar quando houver folga.",
            correct: false,
            score: 0,
            feedback:
              "Pior das opções — pega 30 dias **sem** o desconto, deixando R$ 360k/ano em cima da mesa por inércia. Mesma lógica: captar funding para tomar é dominante; \"esperar folga\" geralmente é \"adiar para sempre\".",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — Opção B — prazo de 60 dias sem desconto",
      shortLabel: "60 d sem desc.",
      description:
        "Aceitar **prazo estendido de 60 dias sem desconto**. Libera R$ 1,5 M de funding implícito adicional (vs base 30 d), economizando **R$ 255 mil/ano** em captação. Mas perde os **R$ 360 mil/ano de desconto** — saldo líquido **−R$ 105 mil/ano**. Destrói valor em quase qualquer empresa com WACC < 27%.",
      resultPanel: {
        headline: "Ganho líquido −R$ 105 mil/ano: prazo aparenta ser grátis, mas custa o desconto perdido",
        deltas: [
          { label: "Funding implícito adicional liberado", value: "R$ 1,5 M (30 d)", tone: "positive" },
          { label: "Custo evitado (WACC 17% × 1,5 M)", value: "R$ 255 mil/ano", tone: "positive" },
          { label: "Desconto não tomado", value: "−R$ 360 mil/ano", tone: "negative" },
          { label: "Ganho líquido anual", value: "−R$ 105 mil/ano", tone: "negative" },
          { label: "Risco relacional", value: "Médio — pedir prazo sinaliza necessidade", tone: "negative" },
          { label: "Caixa preservado (D+0)", value: "+R$ 1,5 M", tone: "positive" },
          { label: "Adequação", value: "Apenas em stress de liquidez ou WACC > 27%", tone: "negative" },
        ],
        commentary:
          "**Política destruidora de valor em condições normais** — perda recorrente de R$ 105k/ano se sustenta indefinidamente. Captura **alívio de caixa pontual** (R$ 1,5 M a mais em saldo médio) ao custo de margem financeira. Dominante apenas em três cenários: (1) **stress de liquidez** real (empresa não consegue captar funding a < 27%); (2) **WACC > 27%** (empresa em risco elevado, com custo de funding alto); (3) **incerteza extrema** sobre disponibilidade de caixa nos próximos meses (prefere preservar caixa a capturar margem). Para Ípsilon em operação normal, é antipadrão claro.",
      },
      reflection: {
        prompt:
          "Em que cenário **muito específico** Opção B vence Opção A?",
        choices: [
          {
            id: "rb_a",
            label:
              "Quando a empresa enfrenta **stress de liquidez agudo** e **não tem linhas de crédito disponíveis** — aí captar funding marginal não é possível, e preservar R$ 1,5 M de caixa via prazo estendido é mais valioso que capturar desconto que exige caixa que não há.",
            correct: true,
            score: 25,
            feedback:
              "Correto e específico. **Stress + ausência de funding alternativo** é o único cenário onde B é dominante — porque a regra geral (\"captar para tomar desconto\") **não se aplica** quando não há linha disponível. Boa prática: tesoureiro deve **monitorar continuamente** disponibilidade de linhas para garantir capacidade de arbitragem; perda dessa capacidade (por degradação de rating, covenants violados) é sinal grave que afeta toda a gestão de capital de giro.",
          },
          {
            id: "rb_b",
            label:
              "Quando o CDI **subir** acima de 20% — aí o desconto perde competitividade.",
            correct: false,
            score: 5,
            feedback:
              "Mesmo com CDI 20%, **WACC seria ~25%** (CDI + 5 pp típico de spread sobre CDI) — ainda **menor que 27,4%**, mantendo Opção A dominante. Para B vencer A, WACC precisa ser > 27,4% — situação extrema, apenas em empresas com rating muito ruim.",
          },
          {
            id: "rb_c",
            label:
              "Quando a empresa quer **\"crescer\" sem captar dívida** — usar prazo do fornecedor é financiamento sem balanço.",
            correct: false,
            score: 0,
            feedback:
              "\"Sem balanço\" é mito; fornecedores aparecem em PCO (passivo cíclico operacional) e analistas tratam como funding. Mais grave: custo do crédito comercial (27,4%) é **mais caro** que dívida bancária (17%) — usar prazo de fornecedor para \"evitar dívida\" é trocar funding barato por funding caro.",
          },
          {
            id: "rb_d",
            label:
              "Quando o **relacionamento com o fornecedor é fraco** — pedir mais prazo testa o relacionamento.",
            correct: false,
            score: 0,
            feedback:
              "**Inverso**: relacionamento fraco torna pedir prazo **arriscado** (fornecedor pode recusar ou reprecificar). Relacionamento sólido permite pedir; mas mesmo com sólido, a matemática de B continua negativa se WACC < 27%.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — Meio termo — 45 dias com 1% de desconto",
      shortLabel: "45 d + 1%",
      description:
        "Pleitear ao fornecedor **45 dias de prazo com 1% de desconto à vista**. Captura R$ 180 mil em desconto, paga R$ 128 mil em custo de antecipação (15 dias × WACC), **ganho líquido R$ 52 mil/ano** — metade do ganho da Opção A com risco relacional adicional. Razoável apenas se A não for aceita pelo fornecedor.",
      resultPanel: {
        headline: "Ganho R$ 52 mil/ano (metade do A): meio termo que custa relacionamento sem ganhar muito",
        deltas: [
          { label: "Desconto capturado", value: "R$ 180 mil/ano", tone: "positive" },
          { label: "Custo de antecipar pagamento (15 d × WACC)", value: "−R$ 128 mil/ano", tone: "negative" },
          { label: "Ganho líquido anual", value: "R$ 52 mil/ano", tone: "positive" },
          { label: "Δ vs cenário A", value: "−R$ 53 mil/ano", tone: "negative" },
          { label: "Risco relacional", value: "Médio — pleito sinaliza negociação ativa", tone: "negative" },
          { label: "Aceitação esperada do fornecedor", value: "Razoável — comercial comum", tone: "neutral" },
          { label: "Esforço de negociação", value: "Alto — exige reunião dedicada", tone: "negative" },
        ],
        commentary:
          "**Solução de compromisso adequada apenas se Opção A não estiver disponível.** Captura metade do ganho com risco relacional adicional — comparação direta com A: pior em ganho **e** pior em relacionamento. Faz sentido em três contextos: (1) fornecedor **não oferece** Opção A (apenas B), e C é negociação para melhorar B; (2) Ípsilon **não pode pagar à vista** (caixa muito apertado, sem linhas), e C reduz necessidade de capital para 15 dias em vez de 30; (3) Ípsilon quer **abrir negociação estrutural** com fornecedor e C é etapa intermediária. Em cenário onde A está sobre a mesa, **A domina C** sempre.",
      },
      reflection: {
        prompt:
          "Quando **propor Opção C ao fornecedor** seria estratégico, mesmo com ganho menor?",
        choices: [
          {
            id: "rc_a",
            label:
              "Quando a Ípsilon quer **abrir conversa de revisão estrutural** com o fornecedor — propor C é forma elegante de testar abertura para mudanças (volume, prazo, desconto) sem exigir aceitação de uma opção radical. C vira **gambit de negociação** para chegar em A+ (ex.: 30 d com 2,5% de desconto + comprometimento de volume).",
            correct: true,
            score: 25,
            feedback:
              "Correto e sofisticado. **Negociação não é decisão one-shot** — propor C abre conversa onde A é o destino final desejado, mas com possibilidade de capturar **mais** que A (volume garantido em troca de desconto maior, prazo flexível em datas estratégicas, garantia de fornecimento em pico, etc.). Boa prática em fornecedores estratégicos: **construir relação multidimensional** (preço, prazo, qualidade, prioridade), não negociar dimensão a dimensão. C como gambit é inteligente; C como destino é subótimo.",
          },
          {
            id: "rc_b",
            label:
              "Quando o fornecedor **rejeitou Opção A** — C é alternativa lógica.",
            correct: false,
            score: 10,
            feedback:
              "**Premissa do enunciado** invertida — fornecedor **ofereceu** A; não rejeitou. C como resposta a rejeição é cenário diferente do colocado. Em rejeição, comparar C com B (que o fornecedor preferiria), não com A (que ele rejeitou).",
          },
          {
            id: "rc_c",
            label:
              "Quando a Ípsilon **tem caixa muito apertado** e não consegue pagar à vista em 100% das compras — C reduz o caixa necessário.",
            correct: false,
            score: 15,
            feedback:
              "Argumento **operacional válido**, mas resposta mais profunda é a estratégica (gambit). Aliás, em caixa apertado, a regra geral (captar para tomar desconto) ainda vence; só não vence se também não há linhas disponíveis (cenário do B). Operacionalmente, C reduz capital de R$ 1,5 M para R$ 750 mil — alívio marginal.",
          },
          {
            id: "rc_d",
            label:
              "Nunca — C é sempre inferior a A e B em algum aspecto.",
            correct: false,
            score: 5,
            feedback:
              "Verdade no aspecto **transacional puro** (em qualquer ano, A ou B domina C), mas ignora **valor estratégico** da negociação como gambit. \"Nunca\" omite a dimensão relacional/estratégica.",
          },
        ],
      },
    },
  ],
};
