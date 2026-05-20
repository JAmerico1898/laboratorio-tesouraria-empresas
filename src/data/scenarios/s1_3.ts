// S1.3 — Startup Gama: crescimento e capital de giro
// Anchors numéricos (todos derivados das demonstrações abaixo):
//   Receita: Y0=12,0 → Y1=16,8 → Y2=23,52 → Y3=32,93 (crescimento 40% a.a.)
//   Margem operacional: 8% → LL: Y1=1,344; Y2=1,882; Y3=2,634; soma = 5,86 M
//   NCG/Receita = 25% → NCG: Y0=3,00; Y1=4,20; Y2=5,88; Y3=8,23
//   ΔNCG (Y0→Y3) = 8,23 − 3,00 = 5,23 M
//   Autofinanciamento BRUTO acumulado = 5,86 M (payout = 0%)
//   Capex acumulado de produto/infra (R&D + GTM + servidores) = ~5,9 M
//     ⇒ caixa livre disponível para financiar NCG ≈ 0
//   Gap de funding = ΔNCG − caixa livre ≈ 5,23 M → captação alvo R$ 6 M (com colchão)
//
// Premissa explícita (comunicada ao aluno): em startups B2B em hipercrescimento,
// praticamente todo o LL é reinvestido em capex de produto e go-to-market, então
// o autofinanciamento DISPONÍVEL para NCG é tipicamente próximo de zero. Por isso
// rodadas de captação são desenhadas para cobrir todo o ΔNCG do horizonte.

import type { Scenario } from "@/types/scenario";

export const S1_3: Scenario = {
  id: "s1_3",
  code: "S1.3",
  title: "Startup Gama — crescimento de 40% a.a. e o gap de funding",
  company: "Startup Gama Tech",
  difficulty: "Intermediário",
  estimatedMinutes: 22,
  context: {
    narrative:
      "A **Gama Tech** é uma startup B2B de software (assinaturas anuais e implantação) com **receita atual de R$ 12 milhões** e **margem operacional de 8%**. O fundador apresentou ao board um plano para **crescer 40% ao ano** nos próximos 3 anos, alcançando ~R$ 33 M de receita. A política é de **payout zero** (todo o lucro fica na empresa), mas a Gama também reinveste agressivamente em produto e vendas: o **capex acumulado projetado** é praticamente igual ao **lucro líquido acumulado**. A relação **NCG / Receita = 25%**, estável historicamente. Você é o CFO e precisa estimar quanto capital adicional será necessário e em qual formato captá-lo.",
    keyFacts: [
      ["Receita atual", "R$ 12,0 M"],
      ["Margem operacional", "8%"],
      ["Crescimento alvo", "40% a.a. por 3 anos"],
      ["NCG / Receita", "25%"],
      ["NCG atual", "R$ 3,0 M"],
      ["Payout", "0%"],
      ["Capex acumulado projetado", "≈ LL acumulado"],
      ["Caixa atual", "R$ 1,5 M"],
    ],
  },
  statements: [
    {
      id: "bp_atual",
      title: "Balanço Patrimonial e estrutura operacional — situação atual (Ano 0)",
      unit: "R$ milhões",
      periods: ["Ano 0"],
      sections: [
        {
          label: "Ativo Circulante Operacional (ACO)",
          rows: [
            { label: "Contas a receber (PMRV ~75 d)", values: [2.5] },
            { label: "Estoques / serviços em andamento", values: [0.5] },
            { label: "Adiantamentos e outros", values: [1.0] },
            { label: "Total ACO", values: [4.0], emphasis: "subtotal" },
          ],
        },
        {
          label: "Passivo Circulante Operacional (PCO)",
          rows: [
            { label: "Fornecedores", values: [0.6] },
            { label: "Salários e encargos a pagar", values: [0.3] },
            { label: "Impostos e outros", values: [0.1] },
            { label: "Total PCO", values: [1.0], emphasis: "subtotal" },
          ],
        },
        {
          label: "Indicadores Fleuriet (Ano 0)",
          rows: [
            { label: "NCG = ACO − PCO", values: [3.0], emphasis: "total" },
            { label: "NCG / Receita", values: [0.25] },
            { label: "Caixa disponível", values: [1.5] },
          ],
        },
      ],
    },
    {
      id: "proj_3a",
      title: "Projeção econômica e de NCG — 3 anos a 40% a.a.",
      unit: "R$ milhões",
      periods: ["Ano 0", "Ano 1", "Ano 2", "Ano 3"],
      sections: [
        {
          label: "DRE projetada",
          rows: [
            { label: "Receita líquida", values: [12.0, 16.8, 23.52, 32.93], emphasis: "bold" },
            { label: "Crescimento (%)", values: [null, 0.4, 0.4, 0.4] },
            { label: "Margem operacional (8%) — EBIT", values: [0.96, 1.34, 1.88, 2.63] },
            { label: "Lucro líquido (≈ EBIT, sem IR relevante)", values: [0.96, 1.34, 1.88, 2.63], emphasis: "subtotal" },
            { label: "Payout", values: [0, 0, 0, 0] },
            { label: "Lucro retido = autofinanciamento bruto", values: [0.96, 1.34, 1.88, 2.63] },
          ],
        },
        {
          label: "NCG projetada (25% da receita)",
          rows: [
            { label: "NCG", values: [3.0, 4.2, 5.88, 8.23], emphasis: "bold" },
            { label: "ΔNCG no período (consumo de caixa)", values: [null, 1.2, 1.68, 2.35] },
          ],
        },
        {
          label: "Capex projetado (produto + GTM + infra)",
          rows: [
            { label: "Capex anual", values: [null, 1.3, 1.9, 2.7] },
            { label: "Capex acumulado", values: [null, 1.3, 3.2, 5.9] },
          ],
        },
        {
          label: "Caixa disponível para NCG",
          rows: [
            { label: "Autofinanciamento bruto acumulado", values: [null, 1.34, 3.22, 5.86] },
            { label: "(−) Capex acumulado", values: [null, -1.3, -3.2, -5.9] },
            { label: "Caixa livre para NCG", values: [null, 0.04, 0.02, -0.04], emphasis: "subtotal" },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Projetar a NCG no Ano 3.** Qual será a NCG ao final do Ano 3?",
      choices: [
        {
          id: "etapa_1_a",
          label: "**R$ 6,6 M** — aplicando 40% × 3 anos sobre a NCG atual (3 × 1,4 × 3 = 12,6 ÷ ~2)",
          correct: false,
          score: 0,
          feedback:
            "**Erro clássico de crescimento linear.** Em horizontes de 3+ anos, 40% a.a. é **composto**, não linear. A fórmula correta é NCG_Y3 = NCG_Y0 × (1+g)³ = 3,0 × 1,4³ = 3,0 × 2,744 = **R$ 8,23 M** (ou, equivalentemente, 25% × Receita_Y3 = 25% × 32,93 = 8,23 M). Confundir crescimento linear com composto é a fonte mais comum de **subestimação do gap de funding** em startups.",
        },
        {
          id: "etapa_1_b",
          label: "**R$ 8,23 M** — Receita_Y3 = 12 × 1,4³ = 32,93; NCG_Y3 = 25% × 32,93",
          correct: true,
          score: 20,
          feedback:
            "**Correto.** Como a NCG é uma função proporcional da receita (25%), ela cresce no mesmo ritmo composto da receita: NCG_Y3 = 3,0 × 1,4³ = **R$ 8,23 M**. Equivalentemente, Receita_Y3 = 12 × 2,744 = 32,93 M e 25% disso = 8,23 M. Esse é o **conceito-chave**: em um regime de crescimento, a NCG é um passivo de caixa que se expande no mesmo ritmo da receita, e cada R$ 1 de receita adicional carrega R$ 0,25 de NCG adicional a ser financiada.",
        },
        {
          id: "etapa_1_c",
          label: "**R$ 11,76 M** — projeção de NCG via prazos médios alongados pelo crescimento",
          correct: false,
          score: 0,
          feedback:
            "Você está misturando duas variáveis. Os **prazos médios** (PMRV, PMRE, PMPF) são premissas independentes do crescimento — se o enunciado diz NCG/Receita = 25% **estável**, isso já incorpora os prazos atuais. NCG_Y3 = 25% × Receita_Y3 = 25% × 32,93 = **R$ 8,23 M**. Alongamento de prazos seria um cenário **adicional** de estresse, não a projeção-base.",
        },
        {
          id: "etapa_1_d",
          label: "**R$ 3,0 M** — a NCG não muda porque a relação NCG/Receita é constante",
          correct: false,
          score: 0,
          feedback:
            "Confusão entre **proporção** e **valor absoluto**. A relação NCG/Receita constante (25%) significa que a NCG cresce **no mesmo ritmo** da receita, não que ela fica parada. Se a receita triplica (12 → 32,93), a NCG também triplica (3,0 → 8,23). Esse é exatamente o **paradoxo do crescimento**: empresas lucrativas que crescem rápido **consomem caixa**, porque a NCG cresce com a receita e precisa ser financiada antes do lucro chegar.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Calcular o autofinanciamento disponível para NCG.** Quanto da geração interna fica **efetivamente disponível** para financiar a expansão da NCG?",
      choices: [
        {
          id: "etapa_2_a",
          label: "**R$ 5,86 M** — todo o LL retido vira caixa para NCG",
          correct: false,
          score: 0,
          feedback:
            "**Erro de ignorar o capex.** Autofinanciamento bruto ≠ caixa livre. A equação correta é: **Caixa livre para NCG = LL retido − Capex**. Se LL acumulado = 5,86 M e capex acumulado = 5,9 M, a sobra é **≈ 0**. Confundir esses dois passos é o que faz fundadores acharem que 'temos lucro, então temos caixa' — mas o lucro está sendo reinvestido em servidores, R&D e equipe de vendas, não está disponível para financiar duplicatas a receber.",
        },
        {
          id: "etapa_2_b",
          label: "**≈ R$ 0** — o LL retido é integralmente absorvido pelo capex de produto/GTM",
          correct: true,
          score: 20,
          feedback:
            "**Correto.** A conta é: **Caixa livre = LL retido − Capex = 5,86 − 5,9 ≈ 0**. Em startups B2B em hipercrescimento, esse é o padrão: praticamente 100% do LL é reinvestido em **produto, infraestrutura e go-to-market** (CAC alto, time de engenharia caro). O 'autofinanciamento disponível para NCG' é tipicamente próximo de zero — toda a NCG adicional precisa vir de **capital externo**. Esse é o motivo de séries A/B existirem mesmo em empresas lucrativas.",
        },
        {
          id: "etapa_2_c",
          label: "**R$ 2,63 M** — apenas o LL do último ano, porque é o mais relevante",
          correct: false,
          score: 0,
          feedback:
            "Para financiar a **expansão** da NCG ao longo do horizonte (e não apenas o último ponto), você precisa somar a geração de **todos os anos** — não só do ano final. O LL acumulado é 1,34 + 1,88 + 2,63 = **5,86 M**. E desse total, ainda precisa subtrair o capex acumulado (~5,9 M) para chegar ao caixa livre real (~0).",
        },
        {
          id: "etapa_2_d",
          label: "**R$ −5,9 M** — porque o capex consome mais que o LL retido",
          correct: false,
          score: 5,
          feedback:
            "Quase. Você acertou a **direção** (capex absorve o LL), mas confundiu sinal: o caixa livre é LL **menos** capex, não capex menos LL. LL acumulado (+5,86) − Capex acumulado (5,9) ≈ **0**, não −5,9. Mesmo assim, sua intuição central está certa: **o LL está totalmente comprometido com capex de produto**, então o autofinanciamento líquido disponível para NCG é praticamente zero.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Quantificar o gap de funding.** Com NCG_Y0 = R$ 3,0 M, NCG_Y3 = R$ 8,23 M e caixa livre disponível para NCG ≈ 0, qual é o **gap de funding mínimo** a ser captado externamente nos 3 anos?",
      choices: [
        {
          id: "etapa_3_a",
          label: "**R$ 8,23 M** — equivalente à NCG total do Ano 3",
          correct: false,
          score: 5,
          feedback:
            "Você está captando para cobrir a NCG **total**, mas R$ 3,0 M já estão financiados desde o Ano 0 (a empresa já opera). O gap é apenas o **incremento**: ΔNCG = NCG_Y3 − NCG_Y0 = 8,23 − 3,0 = **R$ 5,23 M**, líquido do autofinanciamento (≈ 0). Captar 8,23 M seria superdimensionar a rodada e diluir desnecessariamente os fundadores.",
        },
        {
          id: "etapa_3_b",
          label: "**R$ 5,23 M** (ΔNCG) — e na prática captar ~R$ 6 M como colchão",
          correct: true,
          score: 20,
          feedback:
            "**Correto.** Gap = ΔNCG − Caixa livre para NCG = (8,23 − 3,0) − 0 = **R$ 5,23 M**. Na prática, **arredonda-se para R$ 6 M** como colchão para: (i) volatilidade de cobrança (PMRV pode piorar), (ii) custos de transação da rodada, (iii) reserva para 6 meses de runway operacional. Esse é o **tamanho da Série A** alinhado com a estratégia de crescimento. Sub-captar trava o crescimento; super-captar dilui desnecessariamente.",
        },
        {
          id: "etapa_3_c",
          label: "**R$ 0** — o LL acumulado de R$ 5,86 M cobre o ΔNCG de R$ 5,23 M",
          correct: false,
          score: 0,
          feedback:
            "**Erro grave: ignorar o capex.** Você comparou ΔNCG com **LL bruto**, mas o LL está sendo consumido por capex de produto/GTM. O caixa **disponível** para NCG é o LL líquido de capex (≈ 0), não os 5,86 M brutos. Esse é o erro que leva startups a fechar com lucro contábil positivo mas caixa zerado — **lucro não é caixa**.",
        },
        {
          id: "etapa_3_d",
          label: "**R$ 1,5 M** — apenas o que falta após o caixa atual (R$ 1,5 M)",
          correct: false,
          score: 0,
          feedback:
            "O caixa atual de R$ 1,5 M já faz parte do CCL e é uma reserva mínima operacional — não pode ser consumido para zerar antes de captar (sob risco de inadimplência em folha/fornecedores no caminho). O gap calculado pressupõe **manter o nível mínimo de caixa**. Resposta correta: ΔNCG líquido de autofinanciamento = **R$ 5,23 M**, captação alvo ~R$ 6 M.",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Série A — equity round de R$ 6 milhões",
      shortLabel: "Equity (Série A)",
      description:
        "Captar **R$ 6 milhões** em rodada de equity (Série A) a um valuation pré-money de R$ 24 M (diluição de 20%). Recursos vão integralmente para caixa, sem serviço de dívida. Investidor entra com 1 assento no board e direitos preferenciais usuais (1x liquidation preference, anti-diluição broad-based).",
      resultPanel: {
        headline: "Funding resolve o gap estruturalmente, mas dilui 20% dos fundadores.",
        deltas: [
          { label: "Caixa (entrada imediata)", value: "+R$ 6,0 M", tone: "positive" },
          { label: "CCL (Ano 3)", value: "+R$ 6,0 M vs cenário sem captação", tone: "positive" },
          { label: "ST (Ano 3)", value: "≈ +R$ 0,8 M (caixa para colchão pós ΔNCG)", tone: "positive" },
          { label: "Diluição dos fundadores", value: "−20% (de 100% para 80%)", tone: "negative" },
          { label: "Dívida líquida / EBITDA", value: "0,0× (inalterado, sem dívida)", tone: "neutral" },
          { label: "Custo de capital", value: "Implícito ~25–30% a.a. (custo de equity de VC)", tone: "negative" },
        ],
        commentary:
          "Equity é a solução **estrutural** para gap de NCG em startup pré-rentável: não há serviço de dívida pressionando o caixa enquanto a empresa ainda escala. Em troca, os fundadores cedem 20% do equity e ganham um investidor exigente no board. **Quando faz sentido**: receita ainda não permite alavancagem bancária (Dívida/EBITDA ficaria > 5×), há tese de hipercrescimento que justifica diluição, e o investidor agrega valor além do capital (network, governança, próximas rodadas).",
      },
      reflection: {
        prompt:
          "Por que uma startup com 8% de margem prefere equity caro (custo implícito ~25-30%) à dívida bancária mais barata (CDI + 4-5% ≈ 16% a.a.)?",
        choices: [
          {
            id: "branch_a_r_a",
            label:
              "Porque a dívida exigiria EBITDA suficiente para pagar juros e amortização, e a startup ainda está em fase de queima — o serviço de dívida sufocaria o caixa exatamente quando ele precisa estar livre para crescer.",
            correct: true,
            score: 25,
            feedback:
              "**Correto.** A taxa nominal **não é** o custo real de uma estrutura de financiamento — o que importa é o **encaixe entre o perfil do passivo e o perfil do caixa gerado**. Equity não tem amortização nem juros obrigatórios; dívida sim. Com EBITDA de R$ 2-3 M e amortização anual de dívida de R$ 1-2 M, o cash flow ficaria negativo durante a fase de crescimento — derrotando o propósito da captação. **Equity 'cara' é mais barata que dívida quando o caixa operacional ainda não suporta serviço de dívida.**",
          },
          {
            id: "branch_a_r_b",
            label: "Porque equity sempre é melhor que dívida em qualquer estágio da empresa.",
            correct: false,
            score: 0,
            feedback:
              "Falso e perigoso. Em estágio maduro (EBITDA estável, margem alta), **dívida é dramaticamente mais barata** que equity — esse é o motivo de LBOs existirem e de empresas grandes alavancarem. A escolha entre dívida e equity depende do **estágio do ciclo de vida**: equity para fase de queima/hipergrowth, dívida para fase de geração estável de caixa.",
          },
          {
            id: "branch_a_r_c",
            label: "Porque o investidor de equity traz network e os bancos não.",
            correct: false,
            score: 5,
            feedback:
              "É um benefício real (smart money), mas **secundário** ao argumento financeiro. O motivo principal e técnico é o encaixe **caixa × serviço de dívida**: a startup ainda não gera EBITDA suficiente para suportar amortizações sem comprometer o crescimento. Network é o adicional, não o driver da decisão.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Dívida de longo prazo — debênture conversível R$ 6 M",
      shortLabel: "Dívida LP (debênture)",
      description:
        "Captar **R$ 6 milhões** em **debênture conversível** com 60 meses de prazo, **carência de 18 meses** (só juros) e amortização linear nos 42 meses restantes. Taxa: **CDI + 5% a.a.** (≈ 17% a.a. com CDI a 12%). Conversão em equity opcional ao investidor no fim do prazo a desconto de 20% sobre valuation futuro.",
      resultPanel: {
        headline:
          "Cobre o gap sem diluição imediata, mas adiciona serviço de dívida exatamente quando o EBITDA ainda é frágil.",
        deltas: [
          { label: "Caixa (entrada imediata)", value: "+R$ 6,0 M", tone: "positive" },
          { label: "Dívida LP", value: "+R$ 6,0 M", tone: "negative" },
          { label: "CCL", value: "Inalterado (dívida LP financia a NCG ano a ano)", tone: "neutral" },
          { label: "Juros a pagar (Ano 1-2)", value: "≈ R$ 1,0 M/ano (carência só de principal)", tone: "negative" },
          { label: "Dívida líquida / EBITDA (Ano 3)", value: "≈ 1,5× (frágil em recessão)", tone: "negative" },
          { label: "Diluição", value: "0% imediata (potencial ~15% se conversão for exercida)", tone: "positive" },
        ],
        commentary:
          "Debênture conversível é um **híbrido** que tenta resolver o dilema: não dilui hoje, mas dá ao investidor opção de virar equity se a empresa decolar. **Riscos**: (i) juros de R$ 1 M/ano consomem ~40% do LL projetado, apertando o caixa; (ii) covenants típicos (Dívida/EBITDA < 3×, ICSD > 1,3×) podem ser quebrados em qualquer ano fraco; (iii) se a tese não se materializar, a empresa fica com dívida em uma fase em que não consegue refinanciá-la. **Quando faz sentido**: empresa já tem alguma previsibilidade de receita recorrente (ARR de SaaS, contratos de longo prazo) e margem suficiente para cobrir o juro.",
      },
      reflection: {
        prompt:
          "Qual é o principal risco oculto da debênture conversível R$ 6 M para a Gama nesse momento?",
        choices: [
          {
            id: "branch_b_r_a",
            label: "A diluição potencial de ~15% se a conversão for exercida.",
            correct: false,
            score: 5,
            feedback:
              "É um risco real, mas relativamente baixo — 15% de diluição com conversão é menos que os 20% do equity (Branch A). O **risco principal** é o serviço de dívida durante a fase de queima.",
          },
          {
            id: "branch_b_r_b",
            label:
              "Os **juros de ~R$ 1 M/ano consomem ~40% do LL** justamente quando a empresa precisa de cada real para crescer; em qualquer ano fraco a empresa pode quebrar covenants e ter dívida vencida antecipadamente.",
            correct: true,
            score: 25,
            feedback:
              "**Correto.** Esse é o **risco de duração do passivo vs. fragilidade do caixa**. Com LL projetado de R$ 1,3 → 2,6 M nos 3 anos, R$ 1 M de juros anuais consome 40-75% do lucro. Pior: covenants padrão (Dívida/EBITDA, ICSD) podem ser quebrados em **um único trimestre fraco**, transformando dívida LP em dívida imediatamente exigível (vencimento antecipado). Esse é o motivo de **dívida ser inadequada para empresas pré-rentáveis** — o serviço cria fragilidade exatamente na fase de maior incerteza.",
          },
          {
            id: "branch_b_r_c",
            label: "O custo de CDI + 5% é alto demais comparado ao custo de equity de VC.",
            correct: false,
            score: 0,
            feedback:
              "Falso. CDI + 5% (~17%) é **muito mais barato** que o custo implícito de equity de VC (~25-30%). O problema não é a taxa, é o **encaixe de fluxo de caixa**: dívida tem amortização obrigatória, equity não.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Reduzir crescimento para 25% a.a. — sem captação externa",
      shortLabel: "Crescer 25% (autofinanciado)",
      description:
        "Manter a operação **dentro do autofinanciamento**, reduzindo o crescimento alvo de **40% para 25% a.a.**. Resultado: Receita_Y3 = 12 × 1,25³ = **R$ 23,4 M**, NCG_Y3 = 25% × 23,4 = **R$ 5,86 M**. ΔNCG = 2,86 M, perfeitamente coberto pela geração interna se o capex for moderado (~70% do LL em vez de 100%).",
      resultPanel: {
        headline: "Resolve o problema financeiro, mas sacrifica market share — pode ser irrecuperável.",
        deltas: [
          { label: "Captação externa", value: "R$ 0 (autofinanciado)", tone: "positive" },
          { label: "Receita Ano 3", value: "R$ 23,4 M (vs R$ 32,9 M no plano 40%)", tone: "negative" },
          { label: "NCG Ano 3", value: "R$ 5,86 M (vs R$ 8,23 M)", tone: "positive" },
          { label: "ΔNCG", value: "R$ 2,86 M, coberto por geração interna líquida de capex", tone: "positive" },
          { label: "Diluição", value: "0% (fundadores mantêm 100%)", tone: "positive" },
          { label: "Market share / vantagem competitiva", value: "Concorrentes capitalizados podem capturar o mercado", tone: "negative" },
        ],
        commentary:
          "Crescer dentro do caixa é a opção mais **conservadora financeiramente** e a mais **arriscada estrategicamente**. Em mercados com efeito de rede (SaaS B2B, marketplaces, plataformas), o **primeiro a chegar à escala captura o mercado** — uma empresa que cresce 25% enquanto concorrentes (capitalizados em séries A/B) crescem 60-80% vira **irrelevante em 3-5 anos**. Faz sentido apenas em: (i) mercados fragmentados sem winner-take-all, (ii) empresa familiar que prioriza controle sobre escala, (iii) ambientes de capital caro/escasso (downturn macro).",
      },
      reflection: {
        prompt:
          "Em qual cenário Crescer 25% autofinanciado é objetivamente a melhor escolha entre os três?",
        choices: [
          {
            id: "branch_c_r_a",
            label:
              "Quando o mercado tem **forte efeito de rede** e o segundo colocado fica irrelevante.",
            correct: false,
            score: 0,
            feedback:
              "**Exatamente o oposto.** Em mercados com efeito de rede, autofinanciar e crescer devagar é **suicídio estratégico** — o concorrente capitalizado captura a rede e o ganhador leva tudo (winner-takes-most). Nesses mercados, a decisão racional é captar (Branch A) e crescer agressivamente.",
          },
          {
            id: "branch_c_r_b",
            label: "Quando a empresa quer maximizar o **valuation absoluto** em 3 anos.",
            correct: false,
            score: 0,
            feedback:
              "Receita menor (R$ 23,4 M vs R$ 32,9 M) gera **valuation absoluto menor**, mesmo sem diluição. Para maximizar valor absoluto da participação dos fundadores, é necessário um cálculo de trade-off: (% mantida) × (valuation futuro). Em mercados de hipergrowth, captar geralmente vence mesmo com diluição.",
          },
          {
            id: "branch_c_r_c",
            label:
              "Quando o mercado é **fragmentado sem winner-take-all**, o capital externo está caro/indisponível, **e** os fundadores priorizam controle e independência sobre escala máxima.",
            correct: true,
            score: 25,
            feedback:
              "**Correto.** Os três fatores precisam coexistir: (i) **estrutura de mercado** permite múltiplos players médios coexistindo, (ii) **conjuntura macro** torna captação punitiva (downturn, juros altos, valuation comprimido), (iii) **preferência dos fundadores** por controle. Quando essas três condições se alinham, autofinanciar é **decisão racional**, não conservadora. Fora dessa combinação, captar e crescer geralmente domina.",
          },
        ],
      },
    },
  ],
};
