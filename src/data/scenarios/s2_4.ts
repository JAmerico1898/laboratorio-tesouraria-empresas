// S2.4 — Política de investimento de excedentes (R$ 25M)
// Anchors numéricos (todos derivados):
//
// CDI de referência: 11,75% a.a.
// Excedente total: R$ 25.000 mil
//
// Segmentação por horizonte:
//   Caixa transacional (≤ 7 d):    20% = R$  5.000 mil
//   Reserva operacional (8–90 d):  30% = R$  7.500 mil
//   Excedente livre (> 90 d):      50% = R$ 12.500 mil
//
// Políticas (3 branches):
//
//   A) Conservadora — 100% Tesouro/FGC
//      Retorno: 98% × CDI = 11,52% a.a.
//      Bruto:   25.000 × 11,52% = R$ 2.880 mil/ano
//      Custos:  ≈ 0 (sem gestor; custódia desprezível)
//      Líquido: R$ 2.880 mil/ano
//      Duration média: 6 m; Rating min: AAA (soberano/FGC); 0% corporate
//      Concentração: limite FGC R$ 250 mil por CPF/CNPJ por instituição
//      Liquidez ponderada: ~5 d (compromissadas + LFT)
//
//   B) Equilibrada — mix
//      30% Tesouro/FGC + 50% CDB AAA curto + 20% corporate AAA
//      Retorno: 105% × CDI = 12,34% a.a.
//      Bruto:   25.000 × 12,34% = R$ 3.085 mil/ano
//      Custos:  ~0,05% custódia corp. = R$ 12,5 mil
//      Líquido: R$ 3.073 mil/ano
//      Ganho vs A: +R$ 193 mil/ano
//      Duration média: 9 m; Rating min: AAA local;
//      Concentração: máx 25% por emissor; 20% em corporate AAA
//      Liquidez ponderada: ~30 d
//
//   C) Ativa — até 50% do excedente livre via gestor terceiro
//      = 50% × R$ 12.500 mil = R$ 6.250 mil sob gestão (25% do total)
//      Retorno bruto: 110% × CDI = 12,925% a.a.
//      Bruto:   25.000 × 12,925% = R$ 3.231 mil/ano
//      Custos:  fee gestor 0,3% × 6.250 mil = R$ 18,75 mil/ano
//               + custódia/auditoria comitê de risco mensal ≈ R$ 19,25 mil
//               = R$ 38 mil/ano total
//      Líquido: R$ 3.193 mil/ano
//      Equivale a ~12,77% a.a. líquido (104,4% líquido do que poderia ser bruto)
//      Ganho vs A: +R$ 313 mil/ano
//      Ganho vs B: +R$ 120 mil/ano
//      Duration média: até 18 m; Rating min: AA local (parcela gestor)
//      Concentração: máx 15% por emissor (parcela gestor); 50% pode ser
//                    fundo terceiro (que internamente diversifica)
//      Liquidez ponderada: ~45 d (duration mais longa)
//      Governança: comitê de risco mensal + relatório de stress mensal

import type { Scenario } from "@/types/scenario";

export const S2_4: Scenario = {
  id: "s2_4",
  code: "S2.4",
  title: "Política de investimento de excedentes — comitê de tesouraria",
  company: "Tesouraria corporativa (empresa madura)",
  difficulty: "Avançado",
  estimatedMinutes: 22,
  context: {
    narrative:
      "Sua empresa, com **governança madura**, acumula **R$ 25 milhões de excedente** de caixa após desalavancagem do triênio. O **comitê de tesouraria** se reúne na próxima semana para aprovar a **nova política de investimento** — segmentação por horizonte, instrumentos elegíveis, limites de concentração e regras de downgrade. A referência de mercado é **CDI = 11,75% a.a.** Você precisa propor a segmentação, escolher entre três políticas (conservadora, equilibrada ou ativa com gestor) e justificar limites quantitativos.",
    keyFacts: [
      ["Excedente total", "R$ 25,0 milhões"],
      ["CDI referência", "11,75% a.a."],
      ["Caixa transacional (≤ 7 d)", "R$ 5,0 M (20%)"],
      ["Reserva operacional (8–90 d)", "R$ 7,5 M (30%)"],
      ["Excedente livre (> 90 d)", "R$ 12,5 M (50%)"],
      ["Governança", "Madura — comitê aprovado"],
      ["Política vigente", "100% CDB liquidez D+0 (legado)"],
      ["Horizonte de revisão", "12 meses"],
    ],
  },
  statements: [
    {
      id: "segmentacao_mix",
      title: "Segmentação por horizonte e instrumentos-alvo por política",
      unit: "R$ mil / % / dias / % a.a.",
      periods: ["A) Conservadora", "B) Equilibrada", "C) Ativa c/ gestor"],
      sections: [
        {
          label: "Caixa transacional (≤ 7 dias) — R$ 5.000 mil",
          rows: [
            { label: "Compromissadas LFT (% do segmento)", values: [100, 100, 100], indent: 1 },
            { label: "Retorno esperado (% do CDI)", values: [97, 99, 99], indent: 1 },
            { label: "Liquidez (dias)", values: [1, 1, 1], indent: 1 },
          ],
        },
        {
          label: "Reserva operacional (8–90 dias) — R$ 7.500 mil",
          rows: [
            { label: "Tesouro / LFT curto (%)", values: [100, 30, 20], indent: 1 },
            { label: "CDB liquidez diária AAA (%)", values: [0, 60, 60], indent: 1 },
            { label: "Fundos DI (%)", values: [0, 10, 20], indent: 1 },
            { label: "Retorno esperado (% do CDI)", values: [99, 103, 104], indent: 1 },
            { label: "Liquidez (dias)", values: [1, 1, 2], indent: 1 },
          ],
        },
        {
          label: "Excedente livre (> 90 dias) — R$ 12.500 mil",
          rows: [
            { label: "Tesouro IPCA+ / LFT longa (%)", values: [70, 20, 10], indent: 1 },
            { label: "FGC-coberto (CDB médio) (%)", values: [30, 30, 0], indent: 1 },
            { label: "CDB AAA prazo 12–24 m (%)", values: [0, 30, 30], indent: 1 },
            { label: "Corporate AAA (% do segmento)", values: [0, 20, 10], indent: 1 },
            { label: "Carteira via gestor terceiro (%)", values: [0, 0, 50], indent: 1 },
            { label: "Retorno esperado (% do CDI)", values: [99, 108, 117], indent: 1 },
            { label: "Liquidez (dias)", values: [30, 60, 90], indent: 1 },
          ],
        },
        {
          label: "Retorno consolidado da política",
          rows: [
            { label: "Retorno bruto (% do CDI)", values: [98.0, 105.0, 110.0], emphasis: "bold" },
            { label: "Retorno bruto (% a.a.)", values: [11.52, 12.34, 12.93], emphasis: "subtotal" },
            { label: "Retorno bruto (R$ mil/ano)", values: [2880, 3085, 3231], emphasis: "total" },
            { label: "Custos (gestor + custódia, R$ mil/ano)", values: [0, 12.5, 38.0], indent: 1 },
            { label: "Retorno líquido (R$ mil/ano)", values: [2880, 3072.5, 3193], emphasis: "total" },
            { label: "Ganho vs política A (R$ mil/ano)", values: [0, 192.5, 313], emphasis: "bold" },
          ],
        },
      ],
    },
    {
      id: "limites_diversificacao",
      title: "Limites, diversificação e governança por política",
      unit: "% / meses / rating",
      periods: ["A) Conservadora", "B) Equilibrada", "C) Ativa c/ gestor"],
      sections: [
        {
          label: "Limites de concentração",
          rows: [
            { label: "Máx por emissor (% do total)", values: [25, 25, 15], indent: 1 },
            { label: "Máx por instituição não-FGC (%)", values: [0, 20, 25], indent: 1 },
            { label: "Exposure FGC (limite R$ 250 mil/CNPJ/inst.) — % carteira coberta", values: [40, 25, 0], indent: 1 },
          ],
        },
        {
          label: "Duration e prazo",
          rows: [
            { label: "Duration média carteira (meses)", values: [6, 9, 18], indent: 1 },
            { label: "Duration máxima permitida (meses)", values: [12, 18, 24], indent: 1 },
            { label: "Liquidez ponderada total (dias)", values: [5, 30, 45], indent: 1 },
          ],
        },
        {
          label: "Crédito",
          rows: [
            { label: "Rating mínimo elegível (escala local)", values: [null, null, null], indent: 1 },
            { label: "  → política A", values: [null, null, null], indent: 2 },
            { label: "Carteira em corporate bonds (%)", values: [0, 10, 5], indent: 1 },
            { label: "Política de downgrade (dias p/ desinvestir)", values: [0, 30, 60], indent: 1 },
          ],
        },
        {
          label: "Governança",
          rows: [
            { label: "Frequência mínima do comitê de risco (mensal=1)", values: [0.25, 0.5, 1], indent: 1 },
            { label: "Stress test obrigatório? (1=sim)", values: [0, 1, 1], indent: 1 },
            { label: "Marcação a mercado obrigatória? (1=sim)", values: [0, 1, 1], indent: 1 },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Segmentar excedentes por horizonte.** Qual segmentação **mais coerente** com a teoria de gestão de caixa (Baumol/Miller-Orr) e governança madura?",
      choices: [
        {
          id: "e1_a",
          label:
            "**20% transacional** (≤ 7 d) = R$ 5 M • **30% reserva operacional** (8–90 d) = R$ 7,5 M • **50% excedente livre** (> 90 d) = R$ 12,5 M. Cada bucket recebe instrumentos com **duration casada ao horizonte**.",
          correct: true,
          score: 20,
          feedback:
            "Correto. A segmentação por **horizonte e propósito** é o pilar de qualquer política madura — e segue Miller-Orr no sentido de que cada bucket tem **gatilho próprio**. **Transacional** (R$ 5M) cobre folha, tributos e fornecedores da janela; **reserva operacional** (R$ 7,5M) absorve choques previsíveis (sazonalidade, atraso de cliente grande); **excedente livre** (R$ 12,5M) é o capital que pode buscar retorno acima de CDI sem comprometer a operação. A divisão 20/30/50 é benchmark de empresas comparáveis.",
        },
        {
          id: "e1_b",
          label:
            "**100% em CDB liquidez D+0** — segurança máxima e flexibilidade total. Segmentar é desnecessariamente complexo.",
          correct: false,
          score: 0,
          feedback:
            "Erro estratégico clássico (e o mais comum). Manter 100% em D+0 **destrói retorno** sistematicamente: o CDB D+0 paga ~95–98% do CDI, enquanto LFTs/CDBs prefixados de 12 m pagam **105–110% do CDI**. Em R$ 25M, perda anual ~R$ 250–375 mil. Liquidez excessiva é **caro** — princípio central de tesouraria moderna. A segmentação **não é complexidade**, é otimização do trade-off retorno × liquidez.",
        },
        {
          id: "e1_c",
          label:
            "Tratar tudo como **excedente livre** (100% > 90 d) — afinal, o saldo está estável há meses e a empresa tem linhas pré-aprovadas para qualquer eventualidade.",
          correct: false,
          score: 0,
          feedback:
            "Equivoca-se em **dois pontos**: (1) **estabilidade histórica ≠ estabilidade futura** — choques de liquidez (perda de cliente, mudança regulatória, M&A defensivo) surgem sem aviso; (2) **linhas pré-aprovadas custam acessar** (commitment fee + spread + tempo de aprovação). Tratar tudo como livre **alonga duration e força mark-to-market** doloroso em momentos ruins, exatamente quando se precisa de caixa. Boa prática: sempre manter ao menos 20% transacional.",
        },
        {
          id: "e1_d",
          label:
            "**50/50** entre transacional e excedente livre — descarta o bucket intermediário porque é redundante.",
          correct: false,
          score: 5,
          feedback:
            "A **reserva operacional (8–90 d)** existe justamente para capturar **choques previsíveis mas não-imediatos** (folha de 13º, antecipação de tributos, sazonalidade). Sem ela, ou o transacional fica superdimensionado (custa retorno) ou o excedente livre é resgatado em momentos ruins (custa liquidez). O bucket intermediário **reduz a variância** do caixa transacional.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Definir o mix por segmento.** Qual configuração é **mais consistente** com governança madura?",
      choices: [
        {
          id: "e2_a",
          label:
            "Mix com **70–80% em soberano/CDB AAA**, **10–20% em corporate AAA** (apenas emissores listados, com ratings duplos S&P + Moody's) e **fundos DI** apenas como **veículo tático** para parcelas pequenas — nunca como núcleo. Concentração máx por emissor: **25%**.",
          correct: true,
          score: 20,
          feedback:
            "Diagnóstico correto e alinhado a CVM/práticas de tesouraria de empresas listadas. **Corporate AAA** (Vale, Petrobras, Bradesco LF) entrega **+50–100 bps sobre CDI** com risco controlado, desde que **diversificado** (máx 25% por emissor). **Fundos DI** têm taxa de administração que corrói retorno em prazos longos — fazem sentido apenas como **balanço tático** ou para parcela pequena onde não há volume suficiente para CDBs/LF próprios. Núcleo deve ser **título direto**.",
        },
        {
          id: "e2_b",
          label:
            "**100% Tesouro Direto** — qualquer outro instrumento adiciona risco de crédito desnecessário em uma tesouraria não-bancária.",
          correct: false,
          score: 5,
          feedback:
            "Conservadorismo excessivo. **CDBs AAA cobertos pelo FGC** até R$ 250 mil por CNPJ/instituição são **soberano-equivalentes** para fins práticos. Excluir todo crédito privado **deixa retorno na mesa** (50–100 bps em corporate AAA, 20–40 bps em CDB AAA vs Tesouro). Em empresa com governança madura e R$ 25M, é razoável **diversificar** mantendo prudência.",
        },
        {
          id: "e2_c",
          label:
            "**Fundos DI como núcleo** (60–80% do excedente livre) — diversificam automaticamente e poupam trabalho da tesouraria.",
          correct: false,
          score: 0,
          feedback:
            "Erro de eficiência: fundos DI cobram **taxa de administração de 0,3–0,8% a.a.** que **corrói diretamente o retorno**. Em R$ 12,5M, isso é R$ 37–100 mil/ano de fee só para terceirizar uma escolha que a tesouraria pode fazer comprando títulos diretos. Fundos fazem sentido em **carteiras pequenas (< R$ 1 M)** ou para **acessar classes específicas** (multimercado, IPCA estruturado), não como núcleo.",
        },
        {
          id: "e2_d",
          label:
            "**50% corporate bonds** (incluindo BBB e BB+ para capturar prêmio de crédito) — a empresa tem porte para suportar default ocasional.",
          correct: false,
          score: 0,
          feedback:
            "Erro grave de princípio. **Tesouraria não é mesa proprietária**: o objetivo é **preservar e remunerar caixa operacional**, não buscar retorno alavancado em crédito. **High-yield (BB+ ou inferior)** entrega prêmio porque tem **probabilidade real de default** — incompatível com a função do excedente. Boa prática internacional: **rating mínimo AAA na escala local**, com política explícita de downgrade.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Limites e diversificação.** Considerando R$ 25 M, governança madura e a recomendação de incluir corporate AAA, qual conjunto de limites é **defensável** e auditável?",
      choices: [
        {
          id: "e3_a",
          label:
            "**Máx 25% por emissor** (não-FGC), **duration média da carteira ≤ 12 m**, **rating mínimo AAA local com double-rating preferencial**, política de downgrade exigindo **desinvestimento em até 30 dias** após queda para AA-, **stress test mensal** e **marcação a mercado obrigatória**.",
          correct: true,
          score: 20,
          feedback:
            "Conjunto correto e auditável. **25% por emissor** é o limite usualmente adotado para tesourarias não-bancárias — diversifica suficientemente sem fragmentar excessivamente a operação. **Duration ≤ 12 m** controla o risco de mark-to-market em ciclos de subida de Selic. **Política de downgrade** evita inércia diante de deterioração de crédito (erro frequente em comitês menos rigorosos). **Stress test + marcação** dão transparência ao comitê e ao auditor.",
        },
        {
          id: "e3_b",
          label:
            "**Máx 50% por emissor** (para reduzir complexidade operacional), **duration livre**, **rating mínimo BBB** — emissores com porte suficiente raramente caem abaixo disso.",
          correct: false,
          score: 0,
          feedback:
            "Concentração de 50% **viola princípios básicos** de diversificação — equivale a apostar em um único emissor com o caixa estratégico da empresa. **Duration livre** abre flanco a perdas de mark-to-market severas (cenário 2021–2022 no Tesouro IPCA+ longo: −15% MtM em 12 m). **Rating BBB** captura papéis com probabilidade real de default. Política inauditável.",
        },
        {
          id: "e3_c",
          label:
            "**Sem limites quantitativos** — confiar no gestor terceiro contratado, que tem expertise específica e responsabilidade fiduciária.",
          correct: false,
          score: 0,
          feedback:
            "Erro de governança: **contratar gestor não dispensa a política própria**. O gestor opera **dentro** da política do cliente; é a tesouraria que define limites de risco compatíveis com a operação. Delegar limites ao gestor cria **conflito de interesses** (gestor remunerado por retorno tende a alongar duration e tomar risco de crédito). Governança madura **separa** quem define limite (comitê) de quem executa (gestor).",
        },
        {
          id: "e3_d",
          label:
            "**Limite de 25% por emissor é suficiente** — duration, rating mínimo e política de downgrade são detalhes operacionais que a tesouraria define no dia-a-dia.",
          correct: false,
          score: 5,
          feedback:
            "Política **incompleta** falha em auditoria. Concentração trata **risco de emissor**, mas **duration trata risco de mercado** (taxa de juros) e **rating mínimo trata risco de crédito** — são vetores independentes que precisam de limite explícito. Sem **política de downgrade**, a tesouraria mantém o papel mesmo após deterioração — o que já causou perdas relevantes (Light, Americanas no varejo, Light em utilities). O comitê deve aprovar **todos** os limites.",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Política conservadora (100% Tesouro/FGC)",
      shortLabel: "Conservadora",
      description:
        "Excedente alocado integralmente em **Tesouro Direto (LFT, Tesouro Selic)** e **CDBs FGC-cobertos** (até R$ 250 mil por CNPJ/instituição). Zero corporate. Duration média 6 meses. Indicada quando há **covenants de liquidez** ou ciclo de incerteza.",
      resultPanel: {
        headline: "Retorno bruto 98% do CDI = R$ 2.880 mil/ano. Máxima segurança, mínima volatilidade",
        deltas: [
          { label: "Δ Retorno bruto (% do CDI)", value: "98% = 11,52% a.a.", tone: "neutral" },
          { label: "Δ Retorno líquido (R$/ano)", value: "R$ 2.880 mil", tone: "positive" },
          { label: "Δ Ganho vs política vigente (D+0)", value: "+R$ 100 mil/ano (estimado)", tone: "positive" },
          { label: "Δ Liquidez ponderada", value: "~5 dias", tone: "positive" },
          { label: "Δ Risco de crédito", value: "Mínimo (soberano + FGC)", tone: "positive" },
          { label: "Δ Governança exigida", value: "Baixa — sem comitê mensal", tone: "positive" },
          { label: "Custo de oportunidade vs B", value: "−R$ 193 mil/ano", tone: "negative" },
        ],
        commentary:
          "**Política dominante quando há covenants de liquidez** (DSCR mínimo, current ratio mínimo) ou ciclo de incerteza macro. **Retorno bruto 98% × 11,75% × R$ 25M = R$ 2.880 mil/ano**. A perda de retorno vs Política B (R$ 193 mil/ano) é o **prêmio explícito** pago por: (i) zero risco de crédito, (ii) liquidez quase imediata, (iii) governança simplificada. Em momentos de stress (2020 Covid, 2023 Americanas/Light) essa é exatamente a política que evita perdas de mark-to-market. **Não é** subótima — é correta para o contexto certo.",
      },
      reflection: {
        prompt:
          "Qual cenário de negócio **justifica explicitamente** abrir mão de R$ 193 mil/ano para manter a política conservadora?",
        choices: [
          {
            id: "ra_a",
            label:
              "Empresa com **covenants bancários ativos** (ex.: DL/EBITDA ≤ 2,5×, liquidez corrente ≥ 1,2) ou em **processo de M&A** (necessidade de caixa disponível para earn-out / closing) — onde a marcação a mercado adversa pode comprometer covenant ou closing.",
            correct: true,
            score: 25,
            feedback:
              "Correto. Covenants são **gatilhos contratuais** — o custo de quebrar (waiver, repactuação, aceleração) é muito superior aos R$ 193 mil/ano de retorno renunciado. M&A em curso exige caixa **incondicionalmente disponível** na data do closing — sem risco de marcação. Política conservadora é a **opção financeiramente ótima** nesses contextos, não uma posição timorata.",
          },
          {
            id: "ra_b",
            label:
              "Quando o CFO **prefere conservadorismo** sem motivo técnico específico — porque o conservador é sempre superior em horizonte longo.",
            correct: false,
            score: 0,
            feedback:
              "Conservadorismo sem motivo técnico **destrói valor** sistematicamente. Em horizonte de 5 anos, R$ 193 mil/ano renunciados são **quase R$ 1 milhão** de retorno perdido — em uma carteira de mesmo risco prático (AAA local). A política conservadora é correta **com motivo**, não como default.",
          },
          {
            id: "ra_c",
            label:
              "Sempre — porque excedente nunca deve buscar retorno acima de CDI.",
            correct: false,
            score: 0,
            feedback:
              "Princípio falso. Excedente **pode e deve** buscar retorno acima de CDI **dentro de limites de risco compatíveis**. A função do excedente é remunerar o capital alocado em caixa; renunciar a 50–100 bps anuais sem motivo é decisão **antieconômica**, mesmo em tesouraria conservadora.",
          },
          {
            id: "ra_d",
            label:
              "Quando o **rating soberano brasileiro está abaixo de BBB** — caso em que apenas Tesouro é elegível.",
            correct: false,
            score: 5,
            feedback:
              "O rating soberano brasileiro influencia o **teto** dos ratings privados locais, mas mesmo com Brasil em BB+ existem CDBs e corporate AAA na **escala local** que são **investment grade** para tesouraria doméstica. A política conservadora é função de **covenant/M&A/governança**, não diretamente de rating soberano.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — Política equilibrada (mix com corporate AAA)",
      shortLabel: "Equilibrada",
      description:
        "Mix com **30% Tesouro/FGC**, **50% CDB AAA curto**, **20% corporate AAA** (Petrobras, Vale, grandes bancos). Concentração máx 25% por emissor. Duration média 9 meses. Indicada como **base** para a maioria das empresas com governança madura.",
      resultPanel: {
        headline: "Retorno bruto 105% do CDI = R$ 3.073 mil líquido — base recomendada",
        deltas: [
          { label: "Δ Retorno bruto (% do CDI)", value: "105% = 12,34% a.a.", tone: "positive" },
          { label: "Δ Retorno líquido (R$/ano)", value: "R$ 3.073 mil", tone: "positive" },
          { label: "Δ Ganho vs Política A", value: "+R$ 193 mil/ano", tone: "positive" },
          { label: "Δ Duration média", value: "9 meses (limite 18 m)", tone: "neutral" },
          { label: "Δ Liquidez ponderada", value: "~30 dias", tone: "neutral" },
          { label: "Δ Risco de crédito", value: "Baixo (100% AAA, máx 25%/emissor)", tone: "positive" },
          { label: "Δ Governança exigida", value: "Comitê quinzenal + stress test", tone: "neutral" },
        ],
        commentary:
          "**Política dominante para a maioria das empresas com governança madura.** Captura **R$ 193 mil/ano adicionais** vs Política A com risco **marginalmente maior** (corporate AAA é assemelhado a soberano em escala local). Requer governança ativa: **comitê quinzenal, stress test mensal, marcação a mercado, política de downgrade (30 d para desinvestir em queda para AA−)**. A introdução de corporate AAA é **a alavanca de retorno mais eficiente** sem entrar em risco material — desde que respeitado o limite de 25% por emissor.",
      },
      reflection: {
        prompt:
          "Se a empresa tem **covenant de DL/EBITDA ≤ 2,5×**, qual ativo **dentro da Política B** pode pressioná-lo via marcação a mercado em ciclo adverso?",
        choices: [
          {
            id: "rb_a",
            label:
              "**Corporate AAA prefixados longos** e **Tesouro IPCA+ longo** — em ciclo de subida de Selic ou abertura da curva, sofrem **marcação adversa** de 5–15% que reduz o caixa do balanço, elevando a métrica DL/EBITDA mesmo sem mudança operacional.",
            correct: true,
            score: 25,
            feedback:
              "Correto e sofisticado. **Marcação a mercado** afeta o **caixa contábil** que entra no numerador de DL = Dívida Bruta − Caixa. Em ciclos adversos (2021 Brasil: Selic 2% → 13,75%), Tesouro IPCA+ 2035 caiu **~20% MtM** — uma empresa com R$ 5M nesse papel perde R$ 1M de caixa contábil e pode quebrar covenant sem qualquer evento operacional. Boa prática: em política B, **limitar duration média a 12 m** quando há covenant ativo, mesmo que a política permita até 18 m.",
          },
          {
            id: "rb_b",
            label:
              "**Fundos DI** — porque taxa de administração reduz o caixa nominal mensalmente.",
            correct: false,
            score: 0,
            feedback:
              "Confusão. Taxa de administração é **despesa**, não marcação. Fundos DI têm **baixíssima volatilidade** (LFT diária) — não pressionam covenant via MtM. O risco do fundo é **custo** (fee), não marcação. Marcação adversa vem de papéis **prefixados longos** e **IPCA+ longos**.",
          },
          {
            id: "rb_c",
            label:
              "**CDB AAA D+0** — porque tem liquidez diária, sua marcação varia diariamente.",
            correct: false,
            score: 0,
            feedback:
              "CDBs D+0 e LFTs **não têm marcação adversa relevante** — pagam pós-CDI e sua oscilação é mínima. Marcação adversa séria é fenômeno de **títulos prefixados ou indexados longos**, não de papéis pós-fixados de curto prazo.",
          },
          {
            id: "rb_d",
            label:
              "Nenhum — Política B é construída justamente para evitar marcação adversa.",
            correct: false,
            score: 5,
            feedback:
              "Política B **mitiga** marcação ao limitar duration média a 9 m, mas **não elimina** — ainda admite até 20% em corporate AAA e até 30% em CDB AAA 12–24 m, que carregam marcação relevante. Em ciclos extremos (2021–2022), mesmo Política B sofreu MtM negativa em papéis longos.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — Política ativa com gestor terceiro (≤ 50% excedente livre)",
      shortLabel: "Ativa c/ gestor",
      description:
        "Até **50% do excedente livre (R$ 6,25 M, = 25% do total)** alocado em **carteira via gestor terceiro especializado**. Fee 0,3% a.a. Duration até 18 m, rating mínimo AA local na parcela do gestor. Requer **comitê de risco mensal** com relatórios de stress. Indicada apenas para empresas com excedente recorrente > R$ 25 M e governança sofisticada.",
      resultPanel: {
        headline: "Retorno líquido R$ 3.193 mil/ano. Ganho real de R$ 313 mil vs A, R$ 120 mil vs B",
        deltas: [
          { label: "Δ Retorno bruto (% do CDI)", value: "110% = 12,93% a.a.", tone: "positive" },
          { label: "Δ Fee gestor + custos", value: "−R$ 38 mil/ano", tone: "negative" },
          { label: "Δ Retorno líquido (R$/ano)", value: "R$ 3.193 mil", tone: "positive" },
          { label: "Δ Ganho vs Política A", value: "+R$ 313 mil/ano", tone: "positive" },
          { label: "Δ Ganho vs Política B", value: "+R$ 120 mil/ano", tone: "positive" },
          { label: "Δ Duration média (parcela gestor)", value: "até 18 m", tone: "negative" },
          { label: "Δ Governança exigida", value: "Comitê mensal + auditoria gestor", tone: "negative" },
        ],
        commentary:
          "**Política indicada apenas para empresas com excedente recorrente e governança sofisticada.** O ganho de R$ 120 mil/ano vs Política B é **moderado** — equivale a ~48 bps líquidos — e vem acompanhado de: (i) **dependência do gestor** (performance pode reverter), (ii) **duration mais longa** (maior MtM em ciclos adversos), (iii) **governança mais cara** (comitê mensal, auditoria do gestor, due diligence inicial). **Risco de mandato**: gestor pode (a) alongar duration além do mandato, (b) tomar risco de crédito além do limite, (c) usar derivativos — todos exigem **monitoramento ativo** pela tesouraria, não apenas leitura de relatório.",
      },
      reflection: {
        prompt:
          "Contratar gestor terceiro **dispensa** o comitê interno de tesouraria de definir e monitorar limites próprios?",
        choices: [
          {
            id: "rc_a",
            label:
              "**Não.** O gestor opera **dentro da política da empresa** — limites de duration, rating, concentração, derivativos e stress test são definidos pelo **comitê interno** e auditados mensalmente. Delegar limites ao gestor cria conflito de interesses.",
            correct: true,
            score: 25,
            feedback:
              "Correto e é o ponto-chave de governança de gestor terceiro. **O gestor é executor; a política é da empresa.** Empresas que delegam limites ao gestor descobrem, em ciclos ruins, que o gestor está exposto a duration de 24+ meses, papéis BB+ ou estruturas com derivativo — porque o **mandato** foi escrito frouxamente. Boa prática: **mandato explícito** com limites quantitativos + **due diligence trimestral** + **direito de auditoria** + cláusula de **substituição em 30 dias** sem multa.",
          },
          {
            id: "rc_b",
            label:
              "**Sim.** Quem contrata gestor está **terceirizando responsabilidade fiduciária** — o comitê pode se reunir trimestralmente apenas para validar resultados.",
            correct: false,
            score: 0,
            feedback:
              "Erro frequente que já gerou perdas relevantes em casos públicos. **Responsabilidade fiduciária permanece com a administração** da empresa (CFO + comitê); gestor é prestador de serviço. CVM e governança corporativa são explícitas: terceirização **operacional** não significa terceirização **de governança**. Reunião trimestral é insuficiente para gestor ativo — comitê deve ser **mensal**.",
          },
          {
            id: "rc_c",
            label:
              "**Sim, se o gestor for top-tier** (BlackRock, Itaú Asset, XP). Gestores grandes têm processos próprios que substituem governança interna.",
            correct: false,
            score: 0,
            feedback:
              "Confusão entre **qualidade do gestor** e **estrutura de governança**. Mesmo BlackRock opera **dentro** do mandato do cliente — se o mandato permitir duration de 24 m, o gestor pode usar e a empresa carrega o risco. Top-tier reduz **risco operacional do gestor**, não **risco de governança da empresa**.",
          },
          {
            id: "rc_d",
            label:
              "**Apenas para a parcela em gestor (até 50%).** A parcela própria continua sob comitê — o gestor governa o que está sob sua gestão.",
            correct: false,
            score: 5,
            feedback:
              "Resposta parcialmente correta no espírito, mas **enganosa**: o comitê **define e monitora limites para AMBAS as parcelas**. O gestor executa dentro de mandato (que é parte da política); o comitê não terceiriza nem a governança nem o monitoramento. A divisão correta é **execução do gestor × governança do comitê**, não **gestor governa metade**.",
          },
        ],
      },
    },
  ],
};
