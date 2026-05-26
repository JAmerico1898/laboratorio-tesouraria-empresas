import type { Scenario } from "@/types/scenario";

// =============================================================================
// S5.1 — Escolha de fonte de financiamento para giro
// =============================================================================
// Premissas:
//
// Empresa: Indústria Kappa. Necessidade: R$ 4 milhões para 9 meses
// (sazonalidade prolongada + ciclo de venda específico).
// CDI de referência: 12% a.a.
//
// Propostas recebidas:
//
//   A) Capital de giro 12 meses, R$ 4 M
//      Taxa: CDI + 4,5% = 16,5% a.a. nominal
//      IOF total: 1,88% sobre o principal (one-shot, na liberação)
//      Tarifa de cadastro/abertura: 0,5% × 4 M = R$ 20 mil one-shot
//      Amortização: 12 parcelas mensais (PMT francês)
//      Garantia: aval + cessão fiduciária de recebíveis (custo ~R$ 5 mil)
//      Duration: ~6,5 meses
//      Custo total estimado: principal × CET × duration
//      CET ≈ 19% a.a. (juros + IOF anualizado + tarifa anualizada)
//      Custo absoluto (9 meses uso): 4 M × 19% × 9/12 = R$ 570 mil
//      (ajustado pela amortização: ~R$ 360-400 mil)
//
//   B) Conta garantida (CG-CC), limite R$ 4 M
//      Taxa: CDI + 9% = 21% a.a. nominal
//      IOF: 0,0041% a.d. sobre saldo + 0,38% único na utilização
//      Sem tarifa de cadastro (já está pré-aprovada)
//      Uso: pago apenas sobre saldo utilizado, sem amortização programada
//      CET ≈ 21,5-22% a.a. para uso médio
//      Custo absoluto (9 meses, saldo médio R$ 4 M):
//        4 M × 21,5% × 9/12 = R$ 645 mil
//      Vantagem: flexibilidade total — pode quitar antes sem multa
//
//   C) Antecipação de recebíveis (carteira disponível R$ 7 M)
//      Deságio: 1,9% a.m. composto + IOF 0,38% por operação
//      CET = (1,019)^12 − 1 = 25,3% + IOF anualizado ≈ 26% a.a.
//      Antecipa 4 M de duplicatas com prazo médio 45 dias
//      Custo absoluto (9 meses de funding, rotação 2× = 8 antecipações de 45 d):
//        4 M × 26% × 9/12 = R$ 780 mil
//      Vantagem: não consome limite de crédito tradicional
//      Desvantagem: queima carteira que poderia ser usada em emergência
// =============================================================================

export const S5_1: Scenario = {
  id: "s5_1",
  code: "S5.1",
  title: "Escolha de fonte de financiamento para giro — Indústria Kappa",
  company: "Indústria Kappa S.A.",
  difficulty: "Intermediário",
  estimatedMinutes: 22,
  context: {
    narrative:
      "Você é tesoureiro(a) da **Indústria Kappa**, fabricante de bens de capital que precisa **captar R$ 4 milhões** para sustentar capital de giro nos **próximos 9 meses** — janela sazonal entre o ciclo de compras (que se concentra agora) e o ciclo de recebimento (que só vem no fim do exercício). O CFO recebeu **três propostas** e pediu uma análise por **CET (Custo Efetivo Total)**: (A) **Capital de giro 12 meses** a CDI + 4,5% com IOF + tarifa; (B) **Conta garantida** pré-aprovada a CDI + 9%, sem amortização programada; (C) **Antecipação de recebíveis** a 1,9% a.m. (carteira disponível de R$ 7 M). O **CDI** está em 12% a.a. Você precisa comparar pelas mesmas premissas e considerar trade-offs não-financeiros (consumo de linha, flexibilidade, custo de oportunidade da carteira).",
    keyFacts: [
      ["Necessidade", "R$ 4 M por 9 meses"],
      ["CDI de referência", "12% a.a."],
      ["A: CG 12m", "CDI + 4,5% + IOF 1,88% + tarifa 0,5%"],
      ["B: Conta garantida", "CDI + 9% + IOF diário 0,0041%"],
      ["C: Antecipação", "1,9% a.m. composto"],
      ["Carteira para antecipar", "R$ 7 M disponível"],
      ["WACC", "14% a.a. (referência interna)"],
      ["Compromisso já contratado de funding", "R$ 0"],
      ["Amortização CG (saldo médio)", "linear — saldo médio ~50% (duration ~6,5 meses)"],
    ],
  },
  statements: [
    {
      id: "comparacao_cet",
      title: "Comparação das três fontes de financiamento (R$ mil / % a.a.)",
      unit: "R$ mil / % / meses",
      periods: ["A: CG 12m", "B: Conta garantida", "C: Antecipação"],
      sections: [
        {
          label: "Estrutura do custo",
          rows: [
            { label: "Taxa nominal (% a.a.)", values: [16.5, 21.0, 25.3], indent: 1 },
            { label: "IOF anualizado (%)", values: [1.9, 0.8, 0.5], indent: 1 },
            { label: "Tarifas e encargos (%)", values: [0.5, 0.0, 0.2], indent: 1 },
            { label: "CET efetivo (% a.a.)", values: [19.0, 21.8, 26.0], emphasis: "bold" },
          ],
        },
        {
          label: "Custo absoluto no horizonte de 9 meses (R$ mil)",
          rows: [
            { label: "Custo financeiro estimado", values: [400, 645, 780], emphasis: "total" },
            { label: "Δ vs CG 12m (opção mais barata)", values: [0, 245, 380], indent: 1 },
          ],
        },
        {
          label: "Trade-offs não-financeiros",
          rows: [
            { label: "Consumo de limite/linha (1-5)", values: [3, 4, 2], indent: 1 },
            { label: "Flexibilidade (quitar antes sem custo) (1-5)", values: [2, 5, 3], indent: 1 },
            { label: "Custo de implantação", values: [25, 0, 5], indent: 1 },
            { label: "Tempo até dinheiro em conta (dias)", values: [10, 1, 3], indent: 1 },
            { label: "Compromisso de prazo (meses)", values: [12, 0, 0], indent: 1 },
            { label: "Risco de não-renovação", values: [1, 3, 2], indent: 1 },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Calcular o CET corretamente.** A taxa nominal do CG é **CDI + 4,5% = 16,5% a.a.** Por que o CET fica em **~19% a.a.** e não em 16,5%?",
      choices: [
        {
          id: "e1_a",
          label:
            "Porque o CET incorpora **IOF (1,88% one-shot ≈ 1,9% anualizado em prazo de 12 m)** + **tarifa de cadastro (0,5% one-shot ≈ 0,5% anualizado)**. CET = TIR sobre os fluxos reais do tomador, anualizada — não é apenas a taxa nominal de juros.",
          correct: true,
          score: 20,
          feedback:
            "Correto e regulado (BCB Res. 3.517). **CET** é a métrica que captura **todo o custo efetivo** do funding: juros + IOF + tarifas + tributos sobre tarifas + custos de garantia. Em prazo de 12 meses, IOF de 1,88% one-shot tem peso anualizado de ~1,9 pp; tarifa de 0,5% one-shot tem peso de ~0,5 pp. Somando: 16,5% + 1,9% + 0,5% ≈ 18,9-19%. Boa prática: **sempre solicitar a planilha CET** do banco com todos os componentes, e refazer o cálculo internamente — bancos frequentemente divulgam só a taxa nominal.",
        },
        {
          id: "e1_b",
          label:
            "Porque o **CDI subiu** entre o momento da proposta e a contratação.",
          correct: false,
          score: 0,
          feedback:
            "**CDI é variável** mas o cálculo do CET é feito **no momento da proposta** com a curva CDI atual — não captura movimentos futuros. A diferença entre 16,5% e 19% é **estrutural** (componentes não-juros do custo), não conjuntural.",
        },
        {
          id: "e1_c",
          label:
            "Porque o **spread bancário sobe** automaticamente após 6 meses.",
          correct: false,
          score: 0,
          feedback:
            "Spread bancário em CG **é contratado fixo** (CDI + X), não tem ajuste automático. Diferença entre nominal e CET é função de IOF e tarifas, sempre presentes desde o início.",
        },
        {
          id: "e1_d",
          label:
            "Porque **juros compostos** elevam taxa nominal de 16,5% a.a. simples para ~19% a.a. composta.",
          correct: false,
          score: 5,
          feedback:
            "Confusão técnica: **CDI + 4,5% a.a. já é taxa composta** (capitalização diária ao CDI + spread anualizado). A diferença para CET vem de **encargos não-juros** (IOF, tarifas), não de simples → composta. Boa intuição (capitalização importa), mas resposta errada nesta etapa.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Comparar as três opções.** Qual é a **leitura correta** do trade-off?",
      choices: [
        {
          id: "e2_a",
          label:
            "**CG é a mais barata** em custo absoluto e em CET. **Conta garantida custa R$ 245k a mais** por 9 meses — é o **prêmio pela flexibilidade total** (pode quitar a qualquer momento sem multa). **Antecipação custa R$ 380k a mais** e ainda **queima carteira** — pior em custo e em risco residual. CG é dominante em horizonte previsível de 9-12 meses.",
          correct: true,
          score: 20,
          feedback:
            "Correto. **Hierarquia de custos**: CG 12m < Conta garantida < Antecipação — replicada em quase todos os bancos brasileiros. Lógica: CG estruturado tem **maior compromisso** do tomador (prazo, garantia, amortização programada) → banco precifica **menor risco**, oferece **menor spread**. Conta garantida e antecipação são **rotativos e flexíveis** → banco precifica **maior risco operacional** (volume variável, vencimento incerto) → spread maior. Boa prática: **CG para necessidade previsível e estruturada**; conta garantida para **picos imprevistos**; antecipação como **reserva tática** (não funding recorrente).",
        },
        {
          id: "e2_b",
          label:
            "**Antecipação é a mais barata** porque a empresa \"vende\" recebíveis em vez de \"tomar dívida\" — não compromete balanço.",
          correct: false,
          score: 0,
          feedback:
            "**Antecipação É dívida** — gera custo financeiro (deságio) e aparece como antecipado de clientes ou passivo. \"Não comprometer balanço\" é mito; bancos e analistas tratam carteira antecipada como passivo equivalente. E a taxa (CET 26%) é a **mais cara** das três, não a mais barata. Confusão clássica que leva a escolhas ruins.",
        },
        {
          id: "e2_c",
          label:
            "**Conta garantida é a mais barata** porque você só paga sobre o saldo utilizado — flexibilidade vence custo nominal.",
          correct: false,
          score: 5,
          feedback:
            "**Flexibilidade tem valor**, mas neste caso a necessidade é **R$ 4 M por 9 meses estabilizada** (saldo médio = limite). Conta garantida \"só paga o utilizado\" só vence se você **realmente usa menos do limite**; aqui você usa todo limite todo o tempo, então paga 21,8% sobre R$ 4 M completos. CG (19%) é mais barato em uso pleno.",
        },
        {
          id: "e2_d",
          label:
            "**As três são equivalentes** porque a diferença de R$ 380k em 9 meses é marginal em empresa de porte médio.",
          correct: false,
          score: 0,
          feedback:
            "R$ 380k é **diferença material** em qualquer empresa — equivale a 1-2 vendedores júnior por ano. Em decisões de funding, **deixar R$ 380k em cima da mesa** por \"marginalidade\" é antipadrão de tesouraria. CET sempre importa.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Decidir.** Qual é a **decisão dominante**?",
      choices: [
        {
          id: "e3_a",
          label:
            "**Mix CG (parcial) + conta garantida (buffer)**: contratar **R$ 2,5-3 M em CG 12m** (cobrir base previsível, custo menor) e **deixar R$ 1-1,5 M em conta garantida** como **buffer para imprevistos** ou para quitar a parte do CG mais cedo se a necessidade desaparecer. Captura melhor preço **e** flexibilidade.",
          correct: true,
          score: 20,
          feedback:
            "Correto e sofisticado. **Mix estruturado** captura vantagens das duas modalidades: (1) **base** previsível financiada por instrumento mais barato (CG); (2) **incerteza** absorvida por instrumento flexível (conta garantida); (3) **antecipação preservada** para emergência real. Boa prática operacional: tesouraria deve sempre **estruturar o funding por camadas** (\"base + cobertura + buffer\"), não escolher modalidade única. Custo estimado do mix: ~R$ 450k (vs R$ 400k CG puro ou R$ 645k CG-CC puro).",
        },
        {
          id: "e3_b",
          label:
            "**100% CG 12 meses** — menor CET, então sempre dominante.",
          correct: false,
          score: 10,
          feedback:
            "**Captura o menor CET** mas **perde flexibilidade** — se a necessidade desaparecer no mês 4 (cliente principal antecipou pagamento, por exemplo), você paga juros e multa de pré-pagamento sobre R$ 4 M até o fim do contrato. Mix CG + CG-CC mitiga esse risco com custo apenas marginalmente maior.",
        },
        {
          id: "e3_c",
          label:
            "**100% conta garantida** — flexibilidade total vale a diferença de custo.",
          correct: false,
          score: 5,
          feedback:
            "Pagar **R$ 245k a mais** por flexibilidade que **não usará** (necessidade é estabilizada em 9 meses) é trade-off ruim. Conta garantida em uso pleno e prolongado é antipadrão — instrumento foi desenhado para **descasamento pontual**, não funding de 9 meses estabilizado.",
        },
        {
          id: "e3_d",
          label:
            "**100% antecipação** — não compromete linha de crédito tradicional.",
          correct: false,
          score: 0,
          feedback:
            "**Mais caro (R$ 780k vs R$ 400k)** e **queima carteira de R$ 4 M** dos R$ 7 M disponíveis — sobra apenas R$ 3 M para uma emergência real. Funding mais caro **e** menos buffer remanescente = pior decisão das três. Antecipação é instrumento **tático** (emergência), não estratégico (9 meses de funding planejado).",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Capital de giro 12 meses (R$ 4 M)",
      shortLabel: "CG 12m",
      description:
        "Contratar **R$ 4 M em CG 12 meses** a CDI + 4,5% (CET ~19%) com IOF, tarifa e cessão fiduciária. **Menor custo absoluto** (R$ 400k em 9 meses) mas compromete linha pelo prazo contratado e tem multa de pré-pagamento.",
      resultPanel: {
        headline: "Custo R$ 400 mil (menor em CET) — captura preço a custo de flexibilidade",
        deltas: [
          { label: "CET efetivo", value: "~19% a.a.", tone: "positive" },
          { label: "Custo absoluto (9 meses)", value: "R$ 400 mil", tone: "positive" },
          { label: "Compromisso de prazo", value: "12 meses", tone: "negative" },
          { label: "Flexibilidade (quitar antes)", value: "Baixa — multa de pré-pagamento", tone: "negative" },
          { label: "Consumo de linha", value: "R$ 4 M de capacidade", tone: "negative" },
          { label: "Tempo até dinheiro", value: "~10 dias (análise + contratação)", tone: "neutral" },
          { label: "Risco residual", value: "Baixo — taxa contratada não muda", tone: "positive" },
        ],
        commentary:
          "**Política dominante quando a necessidade é previsível e duradoura** (3-12 meses estabilizada). Captura o menor CET disponível e dá previsibilidade orçamentária (parcelas fixas). Trade-offs aceitos: (1) compromisso de prazo (se necessidade desaparecer antes, paga multa); (2) consumo de capacidade de crédito (R$ 4 M ocupam linha do banco); (3) garantia formal (cessão fiduciária imobiliza recebíveis específicos). Boa prática: contratar **80-90% da necessidade em CG** e deixar margem em conta garantida para variabilidade, em vez de 100% CG.",
      },
      reflection: {
        prompt:
          "Se no mês 5 a empresa receber um pagamento atípico que **elimina a necessidade** de R$ 2 M do CG, qual é a decisão correta?",
        choices: [
          {
            id: "ra_a",
            label:
              "**Calcular custo de pré-pagamento** (multa contratual + juros remanescentes da parcela) **vs ganho de aplicar R$ 2 M ao CDI** pelos meses restantes. Se ganho > custo, quitar parcialmente; se não, manter e aplicar o caixa. Frequentemente vale quitar quando a multa é baixa (1-2%) e o spread sobre CDI é alto.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **Pré-pagamento parcial** é decisão econômica calculável: você quita R$ 2 M de dívida que custa CET 19% e libera os juros futuros; em troca, paga multa (tipicamente 1-2% do saldo). Se a economia de juros nos meses restantes > multa, quitar é dominante. Em CG com CET 19% e CDI 12%, spread sobre aplicação é 7 pp/ano; em 7 meses restantes, sobre R$ 2 M = R$ 82k economia − R$ 20-40k multa = ganho R$ 40-60k. Boa prática: **revisar a cada trimestre** se a dívida ainda faz sentido manter — não \"esquecer\" porque foi contratada.",
          },
          {
            id: "ra_b",
            label:
              "**Manter o CG** e aplicar os R$ 2 M no CDI — \"deixar o dinheiro trabalhar\".",
            correct: false,
            score: 5,
            feedback:
              "**\"Deixar trabalhar\" é geralmente errado** quando há dívida a custo maior que a aplicação. Manter R$ 2 M aplicados a 12% enquanto paga 19% sobre R$ 2 M de dívida é **destruir 7 pp/ano** sobre R$ 2 M = R$ 140k/ano. Pré-pagamento (mesmo com multa) é tipicamente dominante. Regra geral: **caixa não rende mais que dívida** — paga dívida primeiro, aplica o resto.",
          },
          {
            id: "ra_c",
            label:
              "**Quitar 100% do CG imediatamente** — eliminar dívida é sempre bom.",
            correct: false,
            score: 10,
            feedback:
              "**Dominante apenas se houver caixa suficiente**. Quitar R$ 4 M precisa de R$ 4 M disponível — o cenário fala em R$ 2 M de pagamento atípico. Quitar 100% exigiria sacrificar caixa operacional (saldo mínimo). Decisão correta é **pré-pagamento parcial proporcional** ao caixa extra disponível.",
          },
          {
            id: "ra_d",
            label:
              "**Não fazer nada** — multa de pré-pagamento sempre supera ganho.",
            correct: false,
            score: 5,
            feedback:
              "**Premissa empírica falsa**. Multa de CG no Brasil é tipicamente 1-2% do saldo pago; spread de dívida sobre aplicação é tipicamente 5-10 pp. Em prazo remanescente > 3-4 meses, economia de juros geralmente vence multa. Calcular caso a caso.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — Conta garantida (R$ 4 M de limite)",
      shortLabel: "Conta garantida",
      description:
        "Usar **conta garantida pré-aprovada** de R$ 4 M a CDI + 9% (CET ~21,8%). **Flexibilidade total** (paga só sobre saldo, quita a qualquer momento). Custo absoluto R$ 645k em 9 meses (+R$ 245k vs CG) — prêmio pela flexibilidade.",
      resultPanel: {
        headline: "Custo R$ 645 mil (+R$ 245k vs CG): flexibilidade que não se usa custa caro",
        deltas: [
          { label: "CET efetivo", value: "~21,8% a.a.", tone: "negative" },
          { label: "Custo absoluto (9 meses)", value: "R$ 645 mil", tone: "negative" },
          { label: "Δ vs CG", value: "+R$ 245 mil (mais caro)", tone: "negative" },
          { label: "Flexibilidade", value: "Total — sem multa, sem amortização", tone: "positive" },
          { label: "Tempo até dinheiro", value: "Imediato (linha pré-aprovada)", tone: "positive" },
          { label: "Compromisso de prazo", value: "Nenhum", tone: "positive" },
          { label: "Risco operacional", value: "Banco pode reduzir limite em ciclo adverso", tone: "negative" },
        ],
        commentary:
          "**Política dominante quando a necessidade é incerta ou de curtíssimo prazo** (1-3 meses). Para necessidade estabilizada de 9 meses como o caso da Kappa, **paga prêmio sem usar o benefício** — flexibilidade só agrega valor se for **efetivamente exercida**. Conta garantida brilha em descasamento pontual (folha de pagamento, atraso de cliente grande, sazonalidade curta); em funding de 9 meses, vira **funding caro permanente**. Risco operacional adicional: **bancos podem reduzir limite** em ciclos adversos, deixando a empresa sem buffer justamente quando precisa mais.",
      },
      reflection: {
        prompt:
          "Em que situação **conta garantida vence CG estruturado** mesmo pagando mais caro?",
        choices: [
          {
            id: "rb_a",
            label:
              "Quando a **necessidade é incerta tanto em valor quanto em duração** — empresa não sabe se precisará de R$ 2 M ou R$ 4 M, nem se será por 2 ou 6 meses. CG forçaria a contratar o pior caso (R$ 4 M, 12 meses) e pagar por ele todo o tempo; conta garantida cobra **só pelo que e quando** se usa.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **CG é eficiente para necessidade definida; conta garantida para necessidade variável.** Em cenário incerto, contratar CG de R$ 4 M e usar média de R$ 2 M significa pagar juros sobre R$ 2 M ociosos — anula a vantagem de menor spread. Conta garantida, mesmo com CET 21,8%, vence CG (19%) quando uso médio é 50% do limite. Boa prática: calcular **\"breakeven de uso\"** — abaixo dele, conta garantida é dominante; acima, CG. Para Kappa (uso 100%), CG é dominante.",
          },
          {
            id: "rb_b",
            label:
              "Quando a empresa quer **evitar comprometer balanço** — conta garantida não aparece como dívida estruturada.",
            correct: false,
            score: 0,
            feedback:
              "**Mito contábil**: conta garantida **aparece** como passivo financeiro de curto prazo (Circulante) sempre que utilizada. Diferença com CG é só natureza (rotativa vs estruturada), não \"aparição\". Decisão de funding deve ser **econômica**, não cosmética.",
          },
          {
            id: "rb_c",
            label:
              "Sempre — flexibilidade é virtude da tesouraria moderna.",
            correct: false,
            score: 0,
            feedback:
              "Flexibilidade **vale o seu preço quando exercida** — não é virtude absoluta. \"Flexibilidade sempre\" leva a pagar prêmio recorrente sem necessidade real, destruindo valor.",
          },
          {
            id: "rb_d",
            label:
              "Quando o relacionamento com o banco é fraco — CG exige análise mais profunda.",
            correct: false,
            score: 5,
            feedback:
              "Argumento **logístico válido** (CG exige análise mais profunda; conta garantida usa linha pré-aprovada), mas frágil — relacionamento fraco resolve-se construindo relacionamento, não escolhendo instrumento mais caro. CG demora 1-2 semanas a mais, custa muito menos.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — Antecipação de recebíveis (R$ 4 M da carteira)",
      shortLabel: "Antecipação",
      description:
        "Antecipar **R$ 4 M de duplicatas** (de R$ 7 M disponível em carteira) com deságio de **1,9% a.m.** (CET ~26%). Custo absoluto **R$ 780k em 9 meses** — o mais caro dos três. Queima carteira que poderia ser usada em emergência.",
      resultPanel: {
        headline: "Custo R$ 780 mil (+R$ 380k vs CG) e queima carteira — antipadrão como funding de 9 meses",
        deltas: [
          { label: "CET efetivo", value: "~26% a.a.", tone: "negative" },
          { label: "Custo absoluto (9 meses)", value: "R$ 780 mil", tone: "negative" },
          { label: "Δ vs CG", value: "+R$ 380 mil (mais caro)", tone: "negative" },
          { label: "Carteira disponível pós-uso", value: "R$ 3 M (de R$ 7 M)", tone: "negative" },
          { label: "Consumo de linha bancária", value: "Zero (usa carteira própria)", tone: "positive" },
          { label: "Tempo até dinheiro", value: "2-3 dias", tone: "positive" },
          { label: "Reversibilidade", value: "Carteira antecipada não volta", tone: "negative" },
        ],
        commentary:
          "**Antipadrão como funding planejado de 9 meses.** Antecipação é instrumento **tático** (emergência, descasamento pontual de 30-60 dias) — usado como funding estruturado, paga **prêmio caríssimo** (CET 26% vs CG 19%) e **consome o buffer mais valioso** da empresa (carteira de recebíveis, que é \"capital de giro líquido\"). Dominante apenas em três situações: (1) **emergência real** onde não há tempo para contratar CG (12+ dias); (2) **empresa sem acesso a CG** (rating baixo, sem garantias formais); (3) **necessidade pontual** muito curta (30-60 dias) onde os custos fixos de CG diluem mal. Para Kappa, nenhuma das três aplica.",
      },
      reflection: {
        prompt:
          "Antecipação é antipadrão para funding planejado. Quando ela **é a escolha certa**?",
        choices: [
          {
            id: "rc_a",
            label:
              "Em **emergência genuína** com janela de 1-3 dias (CG não tem tempo de ser contratada) **e** com necessidade curta (30-60 dias). Aí o **custo do prêmio (~5-7 pp/ano)** é diluído pela curta duração, e a velocidade do dinheiro em conta é o que importa.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **Antecipação é instrumento de velocidade**, não de custo. Em emergência curta (cliente atrasou pagamento grande, surgiu obrigação inesperada), velocidade vence preço — pagar 5 pp/ano a mais por 30 dias é R$ 17 mil em R$ 4 M, custo trivial pelo benefício. Em **funding estruturado de meses**, o mesmo prêmio acumula em centenas de milhares — antipadrão. Boa prática: tratar antecipação como **\"reserva tática\"** com limite de uso anual definido (ex.: máximo 60 dias/ano).",
          },
          {
            id: "rc_b",
            label:
              "Quando a empresa quer **evitar tomar dívida bancária** — antecipação não é dívida.",
            correct: false,
            score: 0,
            feedback:
              "**Antecipação É funding com custo financeiro** — aparece em balanço (passivo financeiro / antecipado de clientes) e custa mais que dívida estruturada. \"Não é dívida\" é mito; é a forma mais cara de funding na maioria dos contextos.",
          },
          {
            id: "rc_c",
            label:
              "Quando a carteira de recebíveis é **muito grande e ociosa** — usar reduz capital empatado.",
            correct: false,
            score: 5,
            feedback:
              "Carteira de recebíveis **não é \"ociosa\"** — é capital de giro operacional vinculado a vendas a prazo. Antecipar não \"libera\" capital ocioso; **monetiza um ativo** com deságio que custa CET 26%. Reduzir capital empatado por antecipação é trocar capital próprio (que custa WACC ~14%) por dívida cara (26%) — destruição de valor.",
          },
          {
            id: "rc_d",
            label:
              "Quando o **relacionamento com bancos é ruim** — antecipação é operação automatizada.",
            correct: false,
            score: 5,
            feedback:
              "Verdade operacional (antecipação tem menos burocracia), mas **fraca como justificativa econômica**. Resolver \"relacionamento ruim\" é mais barato a longo prazo do que pagar 5-10 pp/ano de prêmio em todo funding necessário. Antecipação como contorno permanente é antipadrão.",
          },
        ],
      },
    },
  ],
};
