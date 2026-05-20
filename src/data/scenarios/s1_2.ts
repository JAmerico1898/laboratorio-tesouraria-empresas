import type { Scenario } from "@/types/scenario";

// =============================================================================
// S1.2 — Varejo Beta — Reclassificação Fleuriet
// =============================================================================
// Síntese numérica (R$ milhões, 1 casa decimal, BP 2025):
//
// Receita 2025         600,0       CMV (70%)  420,0
// Setor (drogarias)    NCG/Rec = 14%   |    Beta NCG/Rec = 21,7% (≈22%)
//
// BP — Ativo                              Natureza
// Caixa                          8,0      ACF (errático/financeiro)
// Aplicações em CDB             22,0      ACF
// Clientes (cartão)             50,0      ACO  [PMRV = (50/600)×360 = 30d]
// Estoques                     105,0      ACO  [PMRE = (105/420)×360 = 90d]
// Adiant. a fornecedores         5,0      ACO
// Impostos a recuperar          20,0      ACO  (PIS/COFINS, ICMS-ST)
// ACO                          180,0
// ACF                           30,0
// AC                           210,0
// ANC                          160,0      Imobilizado (45 lojas + CDs)
// Ativo Total                  370,0
//
// BP — Passivo                            Natureza
// Empréstimos rotativos         35,0      PCF (errático/financeiro)
// Debêntures — parcela CP       12,0      PCF
// PCF                           47,0
// Fornecedores                  25,7      PCO  [PMPF = (25,7/420)×360 = 22d]
// Salários e encargos            8,0      PCO
// Tributos a recolher           13,0      PCO
// Outras obrig. operacionais     3,0      PCO
// PCO                           49,7
// PC                            96,7
// Debêntures LP                 88,0      PELP
// Outras obrig. LP              12,0      PELP
// PELP                         100,0
// PL                           173,3
// Passivo + PL                 370,0
//
// Indicadores Fleuriet 2025
// CCL = AC − PC = 210,0 − 96,7 = 113,3
// NCG = ACO − PCO = 180,0 − 49,7 = 130,3
// ST  = CCL − NCG = 113,3 − 130,3 = −17,0   <- ST levemente negativo
//
// Validação: CCL = PL + PELP − ANC = 173,3 + 100 − 160 = 113,3 ✓
//
// Benchmark setorial:
// NCG_setor = 14% × 600 = 84,0
// Beta = 130,3 → excesso de 46,3 vs setor (mix de SKUs amplo, PMRE 90 vs setor 60)
//
// Branches:
// A) Expansão 20 lojas (+44% lojas, +R$ 220M receita projetada):
//    ΔACO ≈ 0,30 × 220 = +66,0    ΔPCO ≈ 0,08 × 220 = +17,7
//    ΔNCG ≈ +48,4 → 178,7
//    Sem captação: ΔCCL = 0 → ST = 113,3 − 178,7 = −65,4 (queda de R$ 48M)
//
// B) Recompra de R$ 30M (queima caixa+aplic):
//    ΔACF = −30, ΔPL = −30 → AC cai 30, PC inalterado → CCL = 83,3 (−30)
//    NCG inalterada → ST = 83,3 − 130,3 = −47,0 (queda de R$ 30M)
//
// C) Dividendo R$ 30M + captação concomitante R$ 30M em 5 anos:
//    ΔPL = −30, ΔPELP = +30 → AC inalterado, PC inalterado → CCL = 113,3 (inalterado)
//    NCG inalterada → ST inalterado em −17,0
//    Mas: ROE sobe (menor PL), Dívida/EBITDA sobe, custo de capital sobe
// =============================================================================

export const S1_2: Scenario = {
  id: "s1_2",
  code: "S1.2",
  title: "Varejo Beta — reclassificação Fleuriet e diagnóstico setorial",
  company: "Drogarias Beta S.A.",
  difficulty: "Intermediário",
  estimatedMinutes: 18,
  context: {
    narrative:
      "A **Drogarias Beta S.A.** é uma rede com **45 lojas** e **receita anual de R$ 600 milhões**. O CFO desconfia que o capital de giro está **acima do padrão setorial** e quer saber por quê antes de aprovar a expansão de **+20 lojas**. Sua tarefa: receber o BP detalhado, **reclassificar conta a conta entre ACO/ACF/PCO/PCF**, calcular **CCL, NCG e ST**, e comparar com o benchmark setorial (**NCG/Receita médio do setor = 14%**).",
    keyFacts: [
      ["Setor", "Varejo farmacêutico"],
      ["Lojas", "45 (planejadas 65)"],
      ["Receita 2025", "R$ 600,0M"],
      ["CMV (70%)", "R$ 420,0M"],
      ["Caixa + CDB", "R$ 30,0M"],
      ["Estoques", "R$ 105,0M"],
      ["Empr. rotativos", "R$ 35,0M"],
      ["Bench NCG/Rec setor", "14%"],
      ["PMRE setor (bench)", "~60 dias"],
      ["PMRV setor (bench)", "~25 dias"],
      ["PMPF setor (bench)", "~28-30 dias"],
      ["Sensibilidade NCG", "+10d PMRE ≈ +R$ 11,7M"],
    ],
  },
  statements: [
    {
      id: "bp_beta",
      title: "Balanço Patrimonial — Drogarias Beta (2025)",
      unit: "R$ milhões",
      periods: ["2025"],
      sections: [
        {
          label: "ATIVO CIRCULANTE",
          rows: [
            { label: "Caixa e equivalentes", values: [8.0], indent: 1 },
            { label: "Aplicações em CDB", values: [22.0], indent: 1 },
            { label: "Clientes (cartão de crédito)", values: [50.0], indent: 1 },
            { label: "Estoques (mercadorias para revenda)", values: [105.0], indent: 1 },
            { label: "Adiantamentos a fornecedores", values: [5.0], indent: 1 },
            { label: "Impostos a recuperar (PIS/COFINS, ICMS-ST)", values: [20.0], indent: 1 },
            { label: "Ativo Circulante (AC)", values: [210.0], emphasis: "bold", indent: 0 },
          ],
        },
        {
          label: "ATIVO NÃO CIRCULANTE",
          rows: [
            { label: "Imobilizado (lojas + CDs) e intangíveis", values: [160.0], indent: 1 },
            { label: "Ativo Total", values: [370.0], emphasis: "total", indent: 0 },
          ],
        },
        {
          label: "PASSIVO CIRCULANTE",
          rows: [
            { label: "Empréstimos rotativos (capital de giro)", values: [35.0], indent: 1 },
            { label: "Debêntures — parcela de curto prazo", values: [12.0], indent: 1 },
            { label: "Fornecedores", values: [25.7], indent: 1 },
            { label: "Salários e encargos a pagar", values: [8.0], indent: 1 },
            { label: "Tributos a recolher (ICMS, ISS, IR)", values: [13.0], indent: 1 },
            { label: "Outras obrigações operacionais", values: [3.0], indent: 1 },
            { label: "Passivo Circulante (PC)", values: [96.7], emphasis: "bold", indent: 0 },
          ],
        },
        {
          label: "PASSIVO NÃO CIRCULANTE E PL",
          rows: [
            { label: "Debêntures — longo prazo", values: [88.0], indent: 1 },
            { label: "Outras obrigações de longo prazo", values: [12.0], indent: 1 },
            { label: "Passivo Exigível a Longo Prazo (PELP)", values: [100.0], emphasis: "subtotal", indent: 0 },
            { label: "Patrimônio Líquido (PL)", values: [173.3], indent: 1 },
            { label: "Passivo + PL Total", values: [370.0], emphasis: "total", indent: 0 },
          ],
        },
      ],
    },
    {
      id: "rec_beta",
      title: "Reclassificação Fleuriet — Beta (2025)",
      unit: "R$ milhões",
      periods: ["2025"],
      sections: [
        {
          label: "ATIVO CIRCULANTE FINANCEIRO (ACF — errático)",
          rows: [
            { label: "Caixa", values: [8.0], indent: 1 },
            { label: "Aplicações em CDB", values: [22.0], indent: 1 },
            { label: "ACF", values: [30.0], emphasis: "subtotal", indent: 0 },
          ],
        },
        {
          label: "ATIVO CIRCULANTE OPERACIONAL (ACO — cíclico)",
          rows: [
            { label: "Clientes (cartão)", values: [50.0], indent: 1 },
            { label: "Estoques", values: [105.0], indent: 1 },
            { label: "Adiantamentos a fornecedores", values: [5.0], indent: 1 },
            { label: "Impostos a recuperar", values: [20.0], indent: 1 },
            { label: "ACO", values: [180.0], emphasis: "subtotal", indent: 0 },
          ],
        },
        {
          label: "PASSIVO CIRCULANTE FINANCEIRO (PCF — errático)",
          rows: [
            { label: "Empréstimos rotativos", values: [35.0], indent: 1 },
            { label: "Debêntures — parcela CP", values: [12.0], indent: 1 },
            { label: "PCF", values: [47.0], emphasis: "subtotal", indent: 0 },
          ],
        },
        {
          label: "PASSIVO CIRCULANTE OPERACIONAL (PCO — cíclico)",
          rows: [
            { label: "Fornecedores", values: [25.7], indent: 1 },
            { label: "Salários e encargos", values: [8.0], indent: 1 },
            { label: "Tributos a recolher", values: [13.0], indent: 1 },
            { label: "Outras obrigações operacionais", values: [3.0], indent: 1 },
            { label: "PCO", values: [49.7], emphasis: "subtotal", indent: 0 },
          ],
        },
        {
          label: "INDICADORES",
          rows: [
            { label: "CCL = AC − PC", values: [113.3], emphasis: "bold" },
            { label: "NCG = ACO − PCO", values: [130.3], emphasis: "bold" },
            { label: "ST = CCL − NCG", values: [-17.0], emphasis: "total" },
            { label: "NCG / Receita (Beta) — %", values: [21.7], emphasis: "subtotal" },
            { label: "NCG / Receita (setor) — %", values: [14.0], emphasis: "subtotal" },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Reclassificação** (não consulte a aba *Reclassificação Fleuriet — Beta (2025)*). Qual é a classificação Fleuriet correta para o conjunto de contas abaixo?",
      choices: [
        {
          id: "et1_a",
          label:
            "Aplicações em CDB = ACF, Impostos a recuperar = ACO, Empréstimos rotativos = PCF, Fornecedores = PCO.",
          correct: true,
          score: 20,
          feedback:
            "Correto. O critério é **vínculo automático com a operação**: (1) **Aplicações em CDB** não nascem da operação — são decisão financeira discricionária → **ACF**. (2) **Impostos a recuperar** (PIS/COFINS, ICMS-ST) nascem das compras → **ACO**. (3) **Empréstimos rotativos** são captação financeira, não vinculados a vendas/compras → **PCF**. (4) **Fornecedores** nascem das compras → **PCO**. Regra prática: *cresceu junto com o volume de vendas/compras? É operacional. É decisão financeira ou de tesouraria? É errático.*",
        },
        {
          id: "et1_b",
          label: "Todas as contas do AC são operacionais (porque são de curto prazo); todas do PC idem.",
          correct: false,
          score: 0,
          feedback:
            "Erro fundamental: **horizonte temporal não determina natureza Fleuriet**. Caixa e aplicações são CP mas **erráticos**. Empréstimos rotativos são CP mas **financeiros**. O critério é **operacional × financeiro/discricionário**, não curto × longo. Se confundir, todo o modelo Fleuriet colapsa: NCG = ACO − PCO = AC − PC = CCL, eliminando a distinção entre CCL e NCG (o ponto-chave do modelo).",
        },
        {
          id: "et1_c",
          label:
            "Aplicações em CDB = ACO (porque rendem juros operacionais); Impostos a recuperar = ACF (porque são valores a 'recuperar').",
          correct: false,
          score: 5,
          feedback:
            "Inversão dupla. **Aplicações em CDB são ACF** (decisão de tesouraria, podem ser liquidadas amanhã sem afetar vendas). **Impostos a recuperar são ACO** (PIS/COFINS, ICMS-ST surgem automaticamente das compras de mercadoria — crescem proporcionalmente ao volume). Confundir aplicação financeira com 'operacional' é um dos erros mais comuns na primeira aplicação do modelo.",
        },
        {
          id: "et1_d",
          label:
            "Fornecedores = PCF (porque são uma forma de financiamento); Empréstimos rotativos = PCO (porque são curto prazo).",
          correct: false,
          score: 0,
          feedback:
            "Inversão grave. **Fornecedores são PCO** (nascem automaticamente das compras — financiamento espontâneo). **Empréstimos rotativos são PCF** (captação financeira discricionária junto a bancos). Pensar que 'qualquer coisa que financia é PCF' apaga a distinção que dá poder ao modelo Fleuriet: separar o que **vem de graça da operação** do que **custa juros e tem risco de rollover**.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Cálculo de CCL, NCG e ST.** Com a reclassificação correta (ACO=180,0; ACF=30,0; PCO=49,7; PCF=47,0), qual conjunto está certo?",
      choices: [
        {
          id: "et2_a",
          label: "CCL = R$ 113,3M; NCG = R$ 130,3M; ST = −R$ 17,0M",
          correct: true,
          score: 20,
          feedback:
            "Exato. **CCL = AC − PC = 210,0 − 96,7 = 113,3**. **NCG = ACO − PCO = 180,0 − 49,7 = 130,3**. **ST = CCL − NCG = 113,3 − 130,3 = −17,0**. Validação cruzada: CCL = PL + PELP − ANC = 173,3 + 100,0 − 160,0 = 113,3 ✓. ST levemente negativo significa que **PCF (R$ 47M) financia parte da NCG** — situação não crítica, mas que exige atenção, especialmente se a empresa pretende expandir. Note também a identidade espelhada: ST = ACF − PCF = 30 − 47 = −17 ✓.",
        },
        {
          id: "et2_b",
          label: "CCL = R$ 113,3M; NCG = R$ 160,3M; ST = −R$ 47,0M",
          correct: false,
          score: 5,
          feedback:
            "Erro provável: você usou **AC inteiro** em vez de **ACO** na fórmula da NCG. **NCG é só a parte operacional**: NCG = ACO − PCO = 180,0 − 49,7 = **R$ 130,3M**, não 160,3. Note que R$ 160,3 = 210 − 49,7 (usou AC inteiro). E R$ 47,0 é exatamente o PCF — que é o que **financia** a NCG não coberta pelo CCL, não o ST. ST correto = −17,0.",
        },
        {
          id: "et2_c",
          label: "CCL = R$ 130,3M; NCG = R$ 113,3M; ST = +R$ 17,0M",
          correct: false,
          score: 0,
          feedback:
            "Você **inverteu CCL e NCG**. **CCL = AC − PC** (todo o circulante) = 113,3. **NCG = ACO − PCO** (apenas operacional) = 130,3. Como CCL **< NCG**, o ST é **negativo** (−17,0), não positivo. Sinal trocado leva a conclusão diametralmente oposta: parecerá que a empresa tem folga quando, na verdade, está usando dívida de CP para fechar a conta.",
        },
        {
          id: "et2_d",
          label: "CCL = R$ 113,3M; NCG = R$ 130,3M; ST = +R$ 30,0M (igual ao ACF)",
          correct: false,
          score: 5,
          feedback:
            "Confusão entre **ST e ACF**. ACF (R$ 30M de caixa+aplicações) é uma **conta do balanço**; ST é um **resultado calculado** (CCL − NCG). Cálculo correto: **ST = CCL − NCG = 113,3 − 130,3 = −17,0M (negativo)**. Pela identidade espelhada: ST = ACF − PCF = 30 − 47 = −17 (também negativo). O sinal positivo está errado.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Comparação setorial.** Qual é a explicação mais robusta para a divergência de ~8 pontos percentuais (excesso de NCG ≈ R$ 46M)?",
      choices: [
        {
          id: "et3_a",
          label:
            "**PMRE acima do setor**: Beta opera com PMRE de 90 dias [(105 / 420) × 360] contra ~60 dias do setor. O **mix amplo de SKUs** (medicamentos de cauda longa, perfumaria) infla o estoque. Cada 10 dias acima do setor ≈ R$ 11,7M de NCG adicional.",
          correct: true,
          score: 20,
          feedback:
            "Diagnóstico preciso. **PMRE = (Estoque / CMV) × 360 = (105 / 420) × 360 = 90 dias**. Setor benchmark ≈ 60 dias → excesso de 30 dias × (CMV/360) = 30 × 1,17 = **R$ 35M de estoque adicional**. Some o PMRV ligeiramente acima do setor (30d vs 25d) e o restante do excesso de NCG de R$ 46M se explica. Recomendação: **antes de expandir, otimizar o mix de SKUs**. Caso contrário, expandir replica o problema em escala maior.",
        },
        {
          id: "et3_b",
          label:
            "**Fornecedores mais rígidos**: o PMPF de Beta é maior que o do setor — Beta paga **mais devagar**, o que pioraria a NCG.",
          correct: false,
          score: 0,
          feedback:
            "Inversão dupla. **PMPF = (Fornecedores / CMV) × 360 = (25,7 / 420) × 360 = 22 dias** — abaixo do setor (~28-30 dias). E **PMPF maior reduz a NCG, não piora**! Lembre: NCG = ACO − PCO; se PMPF sobe, PCO (Fornecedores) sobe, NCG cai. Errar isso é trocar o sinal do impacto operacional dos fornecedores.",
        },
        {
          id: "et3_c",
          label:
            "**Beta vende muito a prazo**: PMRV deve estar próximo de 60 dias (vs 15 do setor) — clientes corporativos parcelando longo.",
          correct: false,
          score: 5,
          feedback:
            "Cálculo: **PMRV = (Clientes / Receita) × 360 = (50 / 600) × 360 = 30 dias**, não 60. Em drogarias é típico (vendas no cartão, recebíveis em ~30 dias). O setor opera próximo de 25 dias — Beta está apenas marginalmente acima. O **driver dominante do excesso de NCG é o estoque (PMRE)**, não os recebíveis.",
        },
        {
          id: "et3_d",
          label:
            "**ANC alto**: Beta investiu pesado em lojas (R$ 160M de imobilizado), o que travou capital e elevou a NCG.",
          correct: false,
          score: 0,
          feedback:
            "Confusão conceitual: **ANC não entra no cálculo da NCG**. NCG = ACO − PCO, ambas contas do **circulante operacional**. Imobilizado afeta o CCL (via CCL = PL + PELP − ANC), não a NCG. Excesso de ANC é problema diferente (eficiência de capital, ROIC) — não explica NCG/Receita.",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Expansão acelerada (+20 lojas)",
      shortLabel: "Expandir 20 lojas",
      description:
        "Abrir **20 lojas em 12 meses** (45 → 65 lojas, +44%). Investimento em ANC de R$ 60M e ramp-up de receita estimado em **+R$ 220M no horizonte de 18 meses**. Sem ação sobre capital de giro, a NCG cresce proporcionalmente.",
      resultPanel: {
        headline: "NCG salta R$ 48M com a expansão — ST despenca para −R$ 65M sem captação prévia",
        deltas: [
          { label: "Δ Receita projetada", value: "+R$ 220M (+37%)", tone: "positive" },
          { label: "Δ ACO", value: "+R$ 66M (≈30% da Δ receita)", tone: "negative" },
          { label: "Δ PCO", value: "+R$ 17,7M (≈8% da Δ receita)", tone: "positive" },
          { label: "Δ NCG", value: "+R$ 48,4M (130,3 → 178,7)", tone: "negative" },
          { label: "Δ CCL (sem captação)", value: "R$ 0 (113,3 inalterado)", tone: "neutral" },
          { label: "Δ ST", value: "−R$ 48M (−17,0 → −65,4)", tone: "negative" },
          { label: "Risco residual", value: "Crítico — rollover de PCF", tone: "negative" },
        ],
        commentary:
          "**Expansão sem funding estrutural é receita para crise.** Cálculo: ΔACO ≈ 30% × ΔReceita (mantendo PMRE+PMRV) = R$ 66M; ΔPCO ≈ 8% × ΔReceita = R$ 17,7M; ΔNCG = +48,4. Sem captação, CCL fica inalterado em R$ 113,3 → ST cai para −R$ 65M. PCF teria que dobrar para financiar — exposição inviável. **Recomendação obrigatória**: antes de abrir lojas, captar **R$ 100-110M em equity ou debêntures de 5+ anos** para custear (i) CAPEX de R$ 60M e (ii) ΔNCG de R$ 48M.",
      },
      reflection: {
        prompt:
          "Por que o ST cai **mais** que a NCG sobe quando se expande sem captação? Qual é o mecanismo?",
        choices: [
          {
            id: "rfa_a",
            label:
              "Porque a expansão também consome **R$ 60M em CAPEX** (ANC), o que reduz o CCL na mesma magnitude — efeito duplo: NCG sobe (+48) e CCL cai (−60), o ST despenca pela soma dos dois efeitos.",
            correct: true,
            score: 25,
            feedback:
              "Exato — e este é o ponto-chave da expansão financiada errado. **Equação dinâmica do CCL = PL + PELP − ANC**: se ANC cresce R$ 60M sem aumento equivalente em PL ou PELP, o CCL cai R$ 60M. Combinado com NCG +R$ 48M, o ST despenca R$ 108M no total. **Regra de ouro da expansão**: ΔPL + ΔPELP **≥** ΔANC + ΔNCG. No caso, captação mínima necessária = 60 + 48 = **R$ 108M** para manter o ST atual.",
          },
          {
            id: "rfa_b",
            label: "Porque o aumento da receita pressiona a margem operacional para baixo.",
            correct: false,
            score: 5,
            feedback:
              "Margem operacional afeta o **autofinanciamento** (lucro retido → PL), mas o efeito direto e imediato sobre o ST vem da combinação ΔNCG + ΔANC. Margem é variável de 2ª ordem; CAPEX e NCG são de 1ª ordem.",
          },
          {
            id: "rfa_c",
            label: "Porque os fornecedores cortam crédito quando a empresa cresce.",
            correct: false,
            score: 0,
            feedback:
              "Não há tal mecanismo automático. Pelo contrário, fornecedores tendem a **expandir crédito** com volume maior. O risco real é estrutural (CCL/ANC/NCG), não relacional.",
          },
          {
            id: "rfa_d",
            label: "Porque o CCL não se altera quando a empresa cresce.",
            correct: false,
            score: 0,
            feedback:
              "O **CCL se altera sim** — cai R$ 60M pelo CAPEX. A frase 'CCL não se altera' só vale para variações **dentro do circulante** (estoque ↔ caixa, por exemplo); quando há investimento em ANC, o CCL muda diretamente via CCL = PL + PELP − ANC.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — Recompra de ações (R$ 30M)",
      shortLabel: "Recompra de ações",
      description:
        "Conselho aprova **recompra de R$ 30M em ações** financiada com caixa próprio (queima de ACF de R$ 30M → 0M). Tese: ações estão descontadas e o caixa está ocioso rendendo CDI.",
      resultPanel: {
        headline: "Recompra queima caixa e reduz PL — CCL cai R$ 30M e ST despenca para −R$ 47M",
        deltas: [
          { label: "Δ ACF", value: "−R$ 30M (30,0 → 0,0)", tone: "negative" },
          { label: "Δ PL", value: "−R$ 30M (173,3 → 143,3)", tone: "negative" },
          { label: "Δ CCL", value: "−R$ 30M (113,3 → 83,3)", tone: "negative" },
          { label: "Δ NCG", value: "R$ 0 (130,3 inalterado)", tone: "neutral" },
          { label: "Δ ST", value: "−R$ 30M (−17,0 → −47,0)", tone: "negative" },
          { label: "Risco residual", value: "Alto — caixa zerado", tone: "negative" },
        ],
        commentary:
          "**Recompra é equity-out: drena CCL na mesma magnitude do PL.** Cálculo: ΔACF = −30 (caixa pago aos acionistas vendedores); ΔPL = −30; AC cai 30, PC inalterado → CCL = 83,3. NCG inalterada. ST = 83,3 − 130,3 = **−R$ 47M**. A empresa fica com **caixa zero** e PCF financiando R$ 47M de NCG. **Decisão só faz sentido se o ST original já fosse confortavelmente positivo** — não é o caso de Beta. Sinal de governança ruim: aprovar recompra com ST já negativo é destruir valor em busca de EPS cosmético.",
      },
      reflection: {
        prompt:
          "Qual é a **condição mínima** para que uma recompra de R$ 30M seja financeiramente defensável neste balanço?",
        choices: [
          {
            id: "rfb_a",
            label:
              "ST original deveria ser **≥ R$ 30M positivo**, deixando ainda uma margem de segurança após a recompra — algo como ST mínimo pós-recompra ≥ 10% da NCG.",
            correct: true,
            score: 25,
            feedback:
              "Correto. Recompra é uma decisão de **devolução de capital** que só faz sentido quando o capital está realmente ocioso — operacionalmente, isso significa **ST positivo e robusto**. Critério prudencial: **ST pós-evento ≥ 10-15% da NCG** (cushion para sazonalidade e choques). Beta tem ST original de −R$ 17M; precisaria de **+R$ 60M de ST** para sustentar a recompra. Caminho realista: primeiro reduzir NCG (PMRE), depois pensar em recompra.",
          },
          {
            id: "rfb_b",
            label: "Basta que o caixa em ACF seja suficiente para cobrir o valor da recompra.",
            correct: false,
            score: 5,
            feedback:
              "Caixa em ACF cobrindo o valor é condição **necessária mas não suficiente**. O ACF pode existir, mas pode estar **financiando NCG implicitamente** (como em Beta: ST = ACF − PCF = 30 − 47 = −17). Zerar o ACF deixa o PCF inteiramente sem cobertura e expõe a empresa a um choque de rollover.",
          },
          {
            id: "rfb_c",
            label: "Basta que o lucro líquido seja maior que o valor da recompra.",
            correct: false,
            score: 0,
            feedback:
              "Lucro líquido é fluxo de **competência**, não fluxo de **caixa**. Pode haver lucro alto com caixa zero (vendas a prazo, estoque crescente). A condição correta envolve **CCL, NCG e ST** — análise patrimonial, não apenas DRE.",
          },
          {
            id: "rfb_d",
            label: "Nenhuma condição é necessária — recompra sempre cria valor reduzindo o número de ações.",
            correct: false,
            score: 0,
            feedback:
              "Falácia financeira clássica. Recompra **cria valor apenas se a ação está subavaliada E o capital está ocioso**. Caso contrário, é **destruição de valor** disfarçada de EPS. Em Beta, com ST negativo, a recompra **transfere risco para os acionistas remanescentes** e bancos credores.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — Dividendo extraordinário + captação concomitante",
      shortLabel: "Dividendo + dívida",
      description:
        "Distribuir **R$ 30M em dividendo extraordinário** e, **na mesma data**, **captar R$ 30M em debêntures de 5 anos** (taxa CDI + 2,5% a.a.). Operação 'leveraged recap': substitui equity por dívida. Promete elevar ROE.",
      resultPanel: {
        headline: "CCL e ST inalterados — mas alavancagem sobe e custo de capital piora",
        deltas: [
          { label: "Δ PL", value: "−R$ 30M (173,3 → 143,3)", tone: "negative" },
          { label: "Δ PELP", value: "+R$ 30M (100 → 130)", tone: "neutral" },
          { label: "Δ CCL", value: "R$ 0 (113,3 inalterado)", tone: "neutral" },
          { label: "Δ NCG", value: "R$ 0 (130,3 inalterado)", tone: "neutral" },
          { label: "Δ ST", value: "R$ 0 (−17,0 inalterado)", tone: "neutral" },
          { label: "Dívida líquida/EBITDA", value: "Sobe ~30%", tone: "negative" },
          { label: "ROE projetado", value: "+200 a 300bps", tone: "positive" },
        ],
        commentary:
          "**Leveraged recap puro: troca equity por dívida.** Cálculo: ΔPL = −30 (dividendo); ΔPELP = +30 (debênture); ACF não muda (entra R$ 30M de debênture, sai R$ 30M de dividendo no mesmo dia). CCL = PL + PELP − ANC = (173,3−30) + (100+30) − 160 = **113,3 inalterado**. NCG e ST também inalterados. **O que muda é a estrutura de capital**: menor PL → maior alavancagem → ROE sobe (alavancagem financeira positiva enquanto ROIC > custo da dívida pós-imposto). Riscos: (1) **covenants** das debêntures podem ser apertados; (2) custo de capital sobe — futura captação ficará mais cara; (3) margem de segurança contra choques diminui.",
      },
      reflection: {
        prompt:
          "Se o CCL, a NCG e o ST não mudam, **qual é o ganho real** desta operação para o acionista?",
        choices: [
          {
            id: "rfc_a",
            label:
              "Alavancagem financeira positiva: **enquanto ROIC > Kd × (1−T)**, substituir equity por dívida **eleva o ROE** sem alterar o ROIC — porém também **aumenta o risco financeiro** e o custo do equity remanescente (efeito Modigliani-Miller com impostos).",
            correct: true,
            score: 25,
            feedback:
              "Excelente. O leveraged recap explora dois mecanismos: **(1) escudo fiscal da dívida** (juros são dedutíveis, dividendo não), reduzindo o WACC; **(2) alavancagem financeira positiva** quando ROIC > custo da dívida pós-imposto. Em Beta, se ROIC = 15% e Kd × (1−T) = (CDI+2,5%) × 0,66 ≈ 10%, há ganho de 5pp × R$ 30M = **R$ 1,5M/ano** de valor adicional. **Porém**: o custo do equity remanescente sobe (maior beta alavancado), e a margem de segurança contra choques cai. É a operação mais sofisticada das três — só faz sentido em empresas estáveis com ST robusto. Em Beta, **com ST já negativo, a operação é arriscada** mesmo que o ST não piore na conta — porque a empresa fica menos resiliente a choques futuros.",
          },
          {
            id: "rfc_b",
            label:
              "Aumenta o caixa em R$ 30M, dando flexibilidade para investimentos futuros.",
            correct: false,
            score: 0,
            feedback:
              "Falso — o caixa **não aumenta**: entra R$ 30M da debênture e sai R$ 30M de dividendo no mesmo dia. ACF inalterado. Confundir 'leveraged recap' com 'captação para investir' é o erro mais comum: aqui não há investimento, é apenas **troca de fonte de capital**.",
          },
          {
            id: "rfc_c",
            label: "Reduz o custo financeiro porque dívida tem juros e equity não — então o lucro líquido sobe.",
            correct: false,
            score: 5,
            feedback:
              "Inversão grave: **dívida tem juros** que ENTRAM como despesa financeira (lucro líquido CAI no curto prazo). O ganho é via **alavancagem financeira** (menor base de equity divide um LL menor para gerar ROE maior) e **escudo fiscal**. Não é via redução de despesa financeira.",
          },
          {
            id: "rfc_d",
            label:
              "Nenhum ganho real — como ST não muda, é puramente cosmético e destrói valor pela maior alavancagem.",
            correct: false,
            score: 5,
            feedback:
              "Parcialmente verdadeiro (alavancagem aumenta risco), mas há ganho real via **escudo fiscal e alavancagem financeira positiva** enquanto ROIC > Kd × (1−T). Em Beta, o problema é que o ST original já era negativo — a operação **não destrói valor diretamente**, mas reduz a margem de segurança contra choques. A decisão depende do apetite a risco da empresa e da resiliência do EBITDA.",
          },
        ],
      },
    },
  ],
};
