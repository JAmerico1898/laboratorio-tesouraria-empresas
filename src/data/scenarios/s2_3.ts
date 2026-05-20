// S2.3 — RPA na conciliação bancária
// Anchors numéricos (todos derivados a seguir):
//
// Processo manual atual
//   Tempo: 14 h/semana × 52 = 728 h/ano (≈ 60,7 h/mês)
//   Custo hora analista pleno (c/ encargos): R$ 90/h
//   Custo direto anual = 728 × 90 = R$ 65.520/ano (R$ 5.460/mês)
//   Volume: 4.000 lançamentos/mês × 12 = 48.000/ano
//   Taxa de exceção atual: 8% → 320 exceções/mês × 0,75 h/exc = 240 h/mês de retrabalho parcial
//   Custo de retrabalho/erros (≈ 30% adicional sobre direto) = R$ 19.656/ano
//   Custo total processo manual ≈ R$ 85.176/ano (R$ 7,1 mil/mês)
//
// Branches (R$ mil/ano salvo indicação):
//
//   A) Piloto 1 banco
//      Invest. inicial:  R$  80 mil
//      Mensalidade:      R$   8 mil/mês  →  R$  96 mil/ano
//      Economia bruta:   R$ 164 mil/ano  (cobre o banco mais complexo e
//                                          libera capacidade do time)
//      Economia líquida ano 1 = 164 − 96 = R$  68 mil
//      Payback = 80 / (68/12) ≈ 14 meses
//      ROI ano 3 = (68×3 − 80)/80 = 155%   (isolado e otimista)
//      *Risco-chave: piloto isolado vira "ilha" sem escalar
//
//   B) Full 3 bancos
//      Invest. inicial:  R$ 200 mil
//      Mensalidade:      R$  18 mil/mês  →  R$ 216 mil/ano
//      Economia bruta:   R$ 366 mil/ano  (horas + redução de erros/juros
//                                          de mora + capacidade liberada)
//      Economia líquida ano 1 = 366 − 216 = R$ 150 mil
//      Payback = 200 / (150/12) ≈ 16 meses
//      ROI ano 3 = ((150×3) − 200) / 200 = 125% nominal
//                ≈ 95% considerando custo de oportunidade do capital (~14% a.a.)
//
//   C) SaaS terceirizado
//      Setup:            R$  15 mil
//      Mensalidade:      R$  12 mil/mês  →  R$ 144 mil/ano
//      Economia bruta:   R$ 166,5 mil/ano (menor — sem customização profunda
//                                          das exceções idiossincráticas)
//      Economia líquida ano 1 = 166,5 − 144 = R$ 22,5 mil
//      Payback = 15 / (22,5/12) ≈ 8 meses
//      ROI ano 3 = ((22,5×3) − 15)/15 = 350%
//      *Tradeoff: dependência total de fornecedor, sem propriedade dos bots

import type { Scenario } from "@/types/scenario";

export const S2_3: Scenario = {
  id: "s2_3",
  code: "S2.3",
  title: "RPA na conciliação bancária — piloto, full ou SaaS",
  company: "Tesouraria multibanco",
  difficulty: "Intermediário",
  estimatedMinutes: 20,
  context: {
    narrative:
      "Sua tesouraria gasta **14 horas/semana** com conciliação manual de **5 contas em 3 bancos**, processando ~**4.000 lançamentos/mês** com **taxa de exceção de 8%**. O **CFO autorizou um piloto de RPA** e quer ver ROI antes de aprovar a expansão. A hora do analista pleno custa **R$ 90/h** com encargos. Você precisa mapear o processo, desenhar a arquitetura-alvo (screen scraping, Open Finance ou SaaS) e demonstrar o retorno em horizonte de 36 meses.",
    keyFacts: [
      ["Horas conciliação", "14 h/semana"],
      ["Contas / bancos", "5 contas em 3 bancos"],
      ["Volume mensal", "~4.000 lançamentos"],
      ["Taxa de exceção", "8%"],
      ["Custo hora (c/ encargos)", "R$ 90/h"],
      ["Custo manual anual", "≈ R$ 85 mil"],
      ["Sponsor", "CFO autorizou piloto"],
      ["Horizonte de avaliação", "36 meses"],
    ],
  },
  statements: [
    {
      id: "custo_processo",
      title: "Custo do processo de conciliação — atual × pós-RPA",
      unit: "R$ mil",
      periods: ["Atual", "Pós-RPA piloto (1 banco)", "Pós-RPA full (3 bancos)"],
      sections: [
        {
          label: "Tempo direto (horas/mês)",
          rows: [
            { label: "Conciliação rotineira", values: [60.7, 40.5, 6.1], indent: 1 },
            { label: "Tratamento de exceções", values: [60.0, 40.0, 18.0], indent: 1 },
            { label: "Total horas/mês", values: [120.7, 80.5, 24.1], emphasis: "subtotal" },
          ],
        },
        {
          label: "Custo direto (R$ mil/mês)",
          rows: [
            { label: "Horas × R$ 90/h", values: [10.86, 7.25, 2.17], indent: 1 },
            { label: "Total mensal", values: [10.86, 7.25, 2.17], emphasis: "subtotal" },
          ],
        },
        {
          label: "Erros, retrabalho e juros de mora (R$ mil/ano)",
          rows: [
            { label: "Retrabalho de exceções", values: [19.7, 13.1, 3.5], indent: 1 },
            { label: "Multas e juros por baixa atrasada", values: [42.0, 28.0, 6.0], indent: 1 },
            { label: "Subtotal erros/ano", values: [61.7, 41.1, 9.5], emphasis: "subtotal" },
          ],
        },
        {
          label: "Custo total",
          rows: [
            { label: "Custo total mensal (direto + erros/12)", values: [16.00, 10.67, 2.96], emphasis: "bold" },
            { label: "Custo total anual", values: [192.0, 128.0, 35.6], emphasis: "total" },
            { label: "Economia bruta anual vs atual", values: [0, 64.0, 156.4], emphasis: "subtotal" },
          ],
        },
      ],
    },
    {
      id: "roi_table",
      title: "Cálculo de ROI — 3 alternativas",
      unit: "R$ mil",
      periods: ["A) Piloto 1 banco", "B) Full 3 bancos", "C) SaaS terceirizado"],
      sections: [
        {
          label: "Investimento e custos",
          rows: [
            { label: "Investimento inicial", values: [80, 200, 15], indent: 1 },
            { label: "Mensalidade (licença + suporte)", values: [8.0, 18.0, 12.0], indent: 1 },
            { label: "OPEX anual (12 × mensalidade)", values: [96, 216, 144], emphasis: "subtotal" },
          ],
        },
        {
          label: "Retorno",
          rows: [
            { label: "Economia bruta anual", values: [164, 366, 166.5], indent: 1 },
            { label: "Economia líquida ano 1 (bruta − OPEX)", values: [68, 150, 22.5], emphasis: "subtotal" },
            { label: "Payback (meses)", values: [14, 16, 8], emphasis: "bold" },
            { label: "ROI ano 3 nominal (%)", values: [155, 125, 350], indent: 1 },
            { label: "ROI ano 3 ajustado ao custo de capital (%)", values: [120, 95, 280], emphasis: "total" },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Mapear o processo manual.** Qual é a estimativa **mais defensável** do **custo total anual** do processo manual?",
      choices: [
        {
          id: "e1_a",
          label:
            "≈ R$ 85 mil/ano — soma do **custo direto (R$ 65,5 mil = 14×52×90)** com cerca de **30% adicionais** de retrabalho de exceções e juros de mora por baixa atrasada.",
          correct: true,
          score: 20,
          feedback:
            "Correto. **Custo direto** = 14 h/sem × 52 sem × R$ 90/h = **R$ 65.520/ano**. As **320 exceções/mês** (8% × 4.000) geram retrabalho parcial + risco de baixa atrasada com juros de mora — somando ~30% sobre o direto, o custo total realista fica em **~R$ 85 mil/ano**. Este é o **número correto a apresentar ao CFO**, porque é o que o RPA pode efetivamente atacar.",
        },
        {
          id: "e1_b",
          label:
            "≈ R$ 65,5 mil/ano — apenas o custo direto das horas (14 × 52 × 90). Os erros não devem ser contabilizados porque já estão dentro das horas.",
          correct: false,
          score: 5,
          feedback:
            "Erro típico: **subestima o caso de negócio** ignorando o custo das exceções. As 320 exceções/mês geram retrabalho **adicional** (não embutido nas 14h de rotina) e **juros de mora** quando lançamentos batem em D+1 e D+2. Ao apresentar só os R$ 65,5 mil ao CFO, o piloto parece marginal — quando na verdade o ganho real está justamente em **reduzir exceções**, não em economizar horas-rotina.",
        },
        {
          id: "e1_c",
          label:
            "≈ R$ 432 mil/ano — multiplicar 14h/sem × 52 × R$ 90/h × **6 contas** (1 por banco + caixa única).",
          correct: false,
          score: 0,
          feedback:
            "Erro de modelagem: as **14 h/semana já englobam as 5 contas dos 3 bancos** — é o esforço **total**, não por conta. Multiplicar pela quantidade de contas **conta tudo várias vezes** e gera um número irreal que o CFO descarta de imediato (lose-credibility move). Use o tempo **observado**, não o produto cruzado.",
        },
        {
          id: "e1_d",
          label:
            "≈ R$ 5,5 mil/ano — porque RPA é tipicamente justificado por **qualidade** e não por custo; o número direto pouco importa.",
          correct: false,
          score: 0,
          feedback:
            "Tese furada para um CFO. Mesmo que **qualidade e auditabilidade** sejam ganhos reais, o caso de negócio **exige número quantificado**. O custo correto é ~R$ 85 mil/ano (direto + retrabalho). Sem ele, o piloto não passa pelo crivo orçamentário.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Desenhar a arquitetura-alvo.** Qual é a leitura **tecnicamente mais correta** sobre essas alternativas?",
      choices: [
        {
          id: "e2_a",
          label:
            "**Open Finance** oferece contrato regulado, auditabilidade e resiliência a mudanças de UI. **Screen scraping** é mais barato no curto prazo, mas quebra a cada redesign do portal. **SaaS** é a forma mais rápida de operar, mas terceiriza o motor de matching.",
          correct: true,
          score: 20,
          feedback:
            "Diagnóstico correto. **Open Finance** (Resolução Conjunta nº 1/2020 BACEN/CMN) é a única integração com **SLA regulado** e **versionamento de contrato** — qualquer mudança passa por governança da estrutura. **Screen scraping** funciona, mas tem **manutenção contínua** (estima-se 2–4 quebras/ano por banco). **SaaS** é veloz, mas o motor de matching e regras de exceção ficam no fornecedor — o que importa para escala futura.",
        },
        {
          id: "e2_b",
          label:
            "**Screen scraping e Open Finance são equivalentes** — ambos leem o extrato; a única diferença é o canal técnico.",
          correct: false,
          score: 0,
          feedback:
            "Equívoco frequente. **Open Finance** é canal **regulado**, com contrato técnico estável e auditoria do BACEN. **Screen scraping** opera **fora** do contrato com o banco (frequentemente em zona cinzenta dos termos de uso), tem **fragilidade estrutural** (qualquer mudança de layout quebra) e **risco reputacional/jurídico** se o banco decidir bloquear. Equivaler os dois é um erro técnico e de risco.",
        },
        {
          id: "e2_c",
          label:
            "**SaaS é sempre mais barato** que solução própria — não há razão para construir RPA in-house em 2025.",
          correct: false,
          score: 0,
          feedback:
            "Falso no caso concreto. SaaS tem **payback rápido (~8m)** mas **OPEX maior** (R$ 144 mil/ano vs R$ 216 mil do full próprio, mas com **economia bruta muito menor** porque o motor de exceções é genérico). Em 3 anos, a versão full própria captura **R$ 366 mil/ano** vs **R$ 166,5 mil** do SaaS. Além disso, SaaS cria **dependência total** do fornecedor: sem propriedade dos bots, qualquer reajuste de contrato vira refém.",
        },
        {
          id: "e2_d",
          label:
            "O canal técnico é irrelevante — o que importa é o motor de matching. Use o canal **mais barato hoje** (screen scraping).",
          correct: false,
          score: 5,
          feedback:
            "Parcialmente verdadeiro (motor de matching importa), mas **escolher canal pelo custo de hoje** ignora **TCO** (Total Cost of Ownership) em 36 meses. Cada quebra de scraping custa 2–5 dias de tesouraria parada por banco — em 3 bancos, isso anula o ganho. **Open Finance** é mais caro de implementar e mais barato de operar.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Calcular o ROI.** Qual leitura de ROI é **financeiramente correta**?",
      choices: [
        {
          id: "e3_a",
          label:
            "Payback A ≈ **14 m**, B ≈ **16 m**, C ≈ **8 m**. O **SaaS tem payback mais curto**, mas o **Full** tem **maior valor presente em 36 meses** por capturar R$ 150 mil/ano líquidos vs R$ 22,5 mil/ano do SaaS.",
          correct: true,
          score: 20,
          feedback:
            "Correto. **Payback A** = 80 / (68/12) ≈ 14 m; **B** = 200 / (150/12) ≈ 16 m; **C** = 15 / (22,5/12) ≈ 8 m. Em horizonte de 36 meses, o **Full** gera **R$ 450 mil − R$ 200 mil = R$ 250 mil** de valor nominal; o SaaS gera **R$ 67,5 − R$ 15 = R$ 52,5 mil**. Payback é apenas uma métrica de **risco/liquidez** — **TIR ou VPL** governa a decisão de capital. Apresentar só payback ao CFO esconde a magnitude do ganho do Full.",
        },
        {
          id: "e3_b",
          label:
            "Como o SaaS tem **payback mais curto (8 m)**, ele é sempre dominante. Payback estático é a métrica oficial de ROI corporativo.",
          correct: false,
          score: 0,
          feedback:
            "Erro clássico. **Payback estático ignora o tamanho do ganho após o payback** e ignora o **custo de capital**. O Full tem payback maior (16m) mas captura **6,7× mais economia líquida anual** que o SaaS. Em VPL/TIR (que é a métrica que CFOs respeitam), o **Full domina o SaaS** em 36 meses. Payback serve para **gerência de risco de liquidez**, não para escolha de capital.",
        },
        {
          id: "e3_c",
          label:
            "Anualizar tudo linearmente: a economia bruta menos a mensalidade dá o ganho — não há por que descontar a taxas ou considerar custo de oportunidade do time já alocado.",
          correct: false,
          score: 5,
          feedback:
            "Subestima dois componentes. (1) **Custo de capital**: trazer R$ 150 mil/ano a 14% a.a. reduz o ROI nominal de 125% para ~95% em 3 anos — relevante. (2) **Custo de oportunidade do time**: as 14 h/semana liberadas **não desaparecem da folha** — o analista vai realocar essas horas para análise de variação, conciliação intercompany, projeção de caixa. O ganho real **inclui** o valor desse trabalho adicional, não só a economia de salário.",
        },
        {
          id: "e3_d",
          label:
            "Soma da economia bruta do Full em 3 anos: 366 × 3 = **R$ 1,098 milhão** de ROI. Subtrair apenas o investimento inicial (R$ 200k) e ignorar a mensalidade — porque mensalidade é OPEX, não entra no ROI.",
          correct: false,
          score: 0,
          feedback:
            "Erro grave: **mensalidade SEMPRE entra no cálculo de ROI/VPL** porque é dispêndio recorrente que reduz o caixa líquido. ROI correto ano 3 nominal = ((150×3) − 200) / 200 = **125%**, não 449%. Excluir OPEX é o tipo de erro que faz uma análise ser **descartada pelo controller** na primeira leitura.",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Piloto restrito a 1 banco",
      shortLabel: "Piloto 1 banco",
      description:
        "Implantar RPA via **Open Finance** apenas no **banco com mais exceções (33% do volume)**. Investimento de **R$ 80 mil**, mensalidade de **R$ 8 mil/mês**. Estratégia de **provar valor** antes de escalar.",
      resultPanel: {
        headline: "Payback ~14 meses, mas o ganho fica limitado a 1 banco — risco de virar ilha",
        deltas: [
          { label: "Δ Investimento inicial", value: "R$ 80 mil", tone: "neutral" },
          { label: "Δ Mensalidade", value: "R$ 8 mil/mês (R$ 96 mil/ano)", tone: "negative" },
          { label: "Δ Economia líquida ano 1", value: "+R$ 68 mil/ano", tone: "positive" },
          { label: "Δ Payback", value: "~14 meses", tone: "neutral" },
          { label: "Δ Economia ano 3 acumulada", value: "+R$ 204 mil (líquida acumulada)", tone: "positive" },
          { label: "Risco operacional", value: "Baixo — escopo contido", tone: "positive" },
          { label: "Dependência de fornecedor", value: "Média — Open Finance regulado", tone: "neutral" },
        ],
        commentary:
          "**Aprendizado barato, ganho parcial.** O piloto resolve o banco mais doloroso (33% do volume e ~50% das exceções) e gera R$ 68 mil/ano líquidos. Cumpre o objetivo de **provar a tecnologia** para o CFO. Riscos: (1) **virar ilha** — o time aprende RPA em 1 banco mas não escala; (2) **migração futura** — quando expandir para os outros 2 bancos, parte do investimento inicial (motor de matching) é reaproveitado, mas há retrabalho de configuração; (3) **custo de carregamento institucional** — manter governança de RPA para uma única integração é ineficiente.",
      },
      reflection: {
        prompt:
          "Se a tesouraria pretende **escalar para os 3 bancos em 18 meses**, qual é a fragilidade central de fazer o piloto isolado primeiro?",
        choices: [
          {
            id: "ra_a",
            label:
              "Retrabalho de migração: configurações, regras de exceção e governança feitas para 1 banco precisam ser **refatoradas** para multi-banco — frequentemente custa **30–50% do invest. original** em rework.",
            correct: true,
            score: 25,
            feedback:
              "Correto. O motor de matching é reutilizável, mas **plano de exceções, dicionário de contrapartes e workflow de aprovação** geralmente foram modelados para o caso único. Empresas que pulam essa etapa de **abstração** acabam reescrevendo. Boa prática: se a decisão de escalar já está tomada, **arquitetar o piloto desde o início como módulo de uma solução multi-banco** — mesmo que rode em 1 só.",
          },
          {
            id: "ra_b",
            label:
              "Nenhuma — piloto isolado é sempre dominante porque reduz risco. Não há custo de migração.",
            correct: false,
            score: 0,
            feedback:
              "Custo de migração é **regra, não exceção**. Pilotos não desenhados para escala incorrem em 30–50% de retrabalho. Boa prática: documentar **arquitetura-alvo** desde o piloto.",
          },
          {
            id: "ra_c",
            label:
              "O piloto rouba budget que poderia ir para SaaS — comprometendo a contratação futura.",
            correct: false,
            score: 0,
            feedback:
              "Argumento orçamentário fraco. R$ 80 mil é despesa moderada e o aprendizado tem valor. A fragilidade real é **técnica e organizacional** (rework de escala), não orçamentária.",
          },
          {
            id: "ra_d",
            label:
              "Open Finance só pode ser usado em 1 banco por contrato — escolher 1 trava as outras integrações.",
            correct: false,
            score: 0,
            feedback:
              "Falso. **Open Finance** é estrutura regulada pelo BACEN aberta para **todas as instituições participantes** — não há cláusula de exclusividade. Qualquer banco autorizado pode ser integrado simultaneamente.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — Implantação full nos 3 bancos",
      shortLabel: "Full 3 bancos",
      description:
        "Roll-out simultâneo dos 3 bancos via **Open Finance**, com motor de matching próprio e governança centralizada. Investimento de **R$ 200 mil**, mensalidade de **R$ 18 mil/mês**. Maior risco de execução, maior ganho estrutural.",
      resultPanel: {
        headline: "Payback ~16 m, R$ 150 mil/ano líquidos — solução estrutural se houver sponsor",
        deltas: [
          { label: "Δ Investimento inicial", value: "R$ 200 mil", tone: "neutral" },
          { label: "Δ Mensalidade", value: "R$ 18 mil/mês (R$ 216 mil/ano)", tone: "negative" },
          { label: "Δ Economia líquida ano 1", value: "+R$ 150 mil/ano", tone: "positive" },
          { label: "Δ Payback", value: "~16 meses", tone: "neutral" },
          { label: "Δ ROI 36 m (ajustado ao custo de capital)", value: "≈ 95%", tone: "positive" },
          { label: "Risco operacional", value: "Médio — execução simultânea", tone: "negative" },
          { label: "Dependência de fornecedor", value: "Baixa — propriedade do motor", tone: "positive" },
        ],
        commentary:
          "**Solução estrutural.** Captura R$ 150 mil/ano líquidos e elimina ~90% das horas manuais. **Payback de 16 m** é maior que o piloto isolado, mas o **valor acumulado em 36 m (~R$ 250 mil nominal, ~R$ 190 mil descontado a 14% a.a.)** é 4× superior. Vantagem-chave: **propriedade do motor de matching** — a empresa pode evoluir regras conforme novos cenários (intercompany, conciliação de cartões, splits judiciais) sem renegociar contrato. Riscos: (1) execução simultânea exige **sponsor sênior** e gerente de projeto dedicado; (2) curva de aprendizado nos primeiros 4 meses pode gerar **ruído operacional**.",
      },
      reflection: {
        prompt:
          "O Full tem **VPL/TIR superiores** ao Piloto e ao SaaS, mas o **payback é o maior dos três**. Qual é a justificativa correta para defender o Full ao CFO?",
        choices: [
          {
            id: "rb_a",
            label:
              "Payback isolado é **métrica de risco de liquidez**, não de valor. Em capital, manda **VPL/TIR**: o Full captura ~R$ 250 mil em 36 m vs ~R$ 52 mil do SaaS — 4,8× mais valor por R$ investido.",
            correct: true,
            score: 25,
            feedback:
              "Correto e bem posicionado para defesa orçamentária. **Payback** responde *quando recupero o capital*; **TIR/VPL** responde *quanto vale o projeto*. CFOs sofisticados pedem ambos, mas decidem por VPL/TIR sob restrição de payback máximo (usualmente 24 m em RPA). Aqui o Full passa a restrição (16 m < 24 m) e domina em VPL — escolha clara.",
          },
          {
            id: "rb_b",
            label:
              "Payback maior é melhor porque significa **investimento mais ambicioso**. Quanto maior o payback, maior o ROI.",
            correct: false,
            score: 0,
            feedback:
              "Inversão grave. **Payback maior = mais risco/menor liquidez**. Não há relação positiva entre payback e ROI. O argumento correto é que o **VPL/TIR** do Full superam o payback ligeiramente mais longo — não que payback maior é virtude.",
          },
          {
            id: "rb_c",
            label:
              "O Full elimina 100% do trabalho manual e, portanto, **demite analistas** — gerando economia de salário.",
            correct: false,
            score: 0,
            feedback:
              "Erro de tese — e perigoso politicamente. Empresas maduras **realocam** o time liberado (análise de variação, conciliação intercompany, governança), capturando **valor adicional** sem demissão. O argumento de demissão queima sponsor interno e raramente se realiza na prática.",
          },
          {
            id: "rb_d",
            label:
              "Como o Full tem mensalidade maior, **gera mais imposto a recuperar** — esse é o principal ganho.",
            correct: false,
            score: 5,
            feedback:
              "Crédito de PIS/COFINS sobre serviços tecnológicos existe em alguns regimes, mas é **componente marginal**, não tese central. O ganho principal é **economia de horas + redução de erros + capacidade liberada**, não tributário.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — SaaS terceirizado",
      shortLabel: "SaaS",
      description:
        "Contratar **SaaS especializado em conciliação** com setup de **R$ 15 mil** e mensalidade de **R$ 12 mil/mês**. Time-to-value rápido, mas motor de matching e regras ficam no fornecedor.",
      resultPanel: {
        headline: "Payback ~8 m, mas economia anual baixa (~R$ 22,5 mil) e dependência total",
        deltas: [
          { label: "Δ Investimento inicial (setup)", value: "R$ 15 mil", tone: "positive" },
          { label: "Δ Mensalidade", value: "R$ 12 mil/mês (R$ 144 mil/ano)", tone: "negative" },
          { label: "Δ Economia líquida ano 1", value: "+R$ 22,5 mil/ano", tone: "positive" },
          { label: "Δ Payback", value: "~8 meses", tone: "positive" },
          { label: "Δ Economia ano 3 acumulada", value: "+R$ 67,5 mil (vs R$ 450 mil do Full)", tone: "negative" },
          { label: "Risco operacional", value: "Baixo no curto, alto no longo (lock-in)", tone: "negative" },
          { label: "Dependência de fornecedor", value: "Alta — propriedade externa", tone: "negative" },
        ],
        commentary:
          "**Solução rápida, ganho limitado.** Payback de 8 m parece atraente, mas o **motor de matching é genérico**: não trata exceções idiossincráticas (recebimento via PIX QR de marketplace, splits judiciais, intercompany com múltiplas moedas) — exatamente os casos que **mais consomem horas**. Por isso a economia bruta é ~R$ 166 mil (vs R$ 366 mil do Full). Em 36 m, captura ~R$ 67,5 mil acumulados — **3,7× menos que o Full**. Tradeoff aceitável quando o time é **enxuto**, a operação é **commodity** e não há sponsor para projeto interno.",
      },
      reflection: {
        prompt:
          "SaaS tem **payback ótimo** e **invest. ínfimo**. Por que ainda assim pode ser a **pior escolha** para uma tesouraria que pretende escalar?",
        choices: [
          {
            id: "rc_a",
            label:
              "**Lock-in**: regras de matching e dicionário de contrapartes ficam no fornecedor — sair custa tanto quanto reimplementar do zero. E o **OPEX** (R$ 144 mil/ano) tende a subir 8–15% a.a. sem que a empresa tenha alternativa de barganha real.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **Lock-in tecnológico** é o risco estratégico subestimado em SaaS de back-office. Sair exige reimplementação completa porque **os dados de regras** não são exportáveis em formato útil. Em horizonte de 5+ anos, o **OPEX acumulado** ultrapassa o Full próprio em larga margem. Boa prática: SaaS para operações *commodity*; in-house para processos *core* de tesouraria.",
          },
          {
            id: "rc_b",
            label:
              "Nenhuma — SaaS com payback de 8 m é sempre dominante. Não há racional para construir in-house.",
            correct: false,
            score: 0,
            feedback:
              "Falso. SaaS otimiza **time-to-value**, mas **subotimiza valor capturado** (R$ 22,5 mil/ano vs R$ 150 mil do Full) e cria **dependência estratégica**. Domínio depende do horizonte e do caso.",
          },
          {
            id: "rc_c",
            label:
              "SaaS é **proibido por compliance** em tesourarias brasileiras desde 2024.",
            correct: false,
            score: 0,
            feedback:
              "Não existe essa proibição. SaaS é amplamente usado, inclusive em conciliação. O cuidado é com **LGPD** (dados transacionais), mas é endereçável por contrato e DPA.",
          },
          {
            id: "rc_d",
            label:
              "Porque o **OPEX é despesa, não investimento** — então não há ROI a calcular em SaaS.",
            correct: false,
            score: 5,
            feedback:
              "Confusão contábil-financeira. OPEX é **despesa contábil**, mas qualquer pagamento recorrente entra no cálculo de **fluxo de caixa do projeto** e, portanto, no ROI/VPL. O fato de não capitalizar não significa não calcular. O argumento correto contra SaaS é **lock-in e ganho menor**, não capex × opex.",
          },
        ],
      },
    },
  ],
};
