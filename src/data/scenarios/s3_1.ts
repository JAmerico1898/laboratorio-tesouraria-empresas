import type { Scenario } from "@/types/scenario";

// =============================================================================
// S3.1 — Curva ABC de 50 SKUs em Distribuidora Ômega
// =============================================================================
// Premissas:
//
// Carteira: 50 SKUs. Valor anual movimentado = R$ 40.000 mil.
// Distribuição empírica (após ordenação por consumo × preço unitário):
//   Top 10 SKUs (20%) ........ R$ 32.000 mil (80,0% do valor)
//   SKUs 11 a 25 (30%) ....... R$  6.000 mil (15,0%)
//   SKUs 26 a 50 (50%) ....... R$  2.000 mil ( 5,0%)
//
// Estoque atual: R$ 7.000 mil (PMRE ≈ 63 dias sobre CMV R$ 40 M).
// Custo de carregamento: 22% a.a. → R$ 1.540 mil/ano.
// Taxa de ruptura atual: 4% (heterogênea: 1,8% em A, 5% em B, 7% em C).
// Equipe de gestão de estoques: 4 pessoas, R$ 480 mil/ano.
//
// Branches (impacto em 12 meses sobre o estoque médio de R$ 7.000 mil):
//
//   A) Adoção integral (políticas diferenciadas por classe)
//      Redução de estoque: -10% = liberação R$ 700 mil
//      Ganho financeiro: 700 × 22% = R$ 154 mil/ano
//      Custo de implantação (sistemas + treinamento): R$ 120 mil one-off
//      Tempo de ramp-up: 6-9 meses
//      Risco de ruptura: cai para 2,8% (governança apertada em A)
//
//   B) Adoção parcial — apenas classe A
//      Redução de estoque: -5% = liberação R$ 350 mil
//      Ganho financeiro: 350 × 22% = R$ 77 mil/ano
//      Custo de implantação: R$ 45 mil (foco em 10 SKUs)
//      Tempo de ramp-up: 3 meses
//      Risco de ruptura A: 1,2% (foco); B e C inalterados
//
//   C) Adoção ABC + complemento XYZ
//      Cruza ABC × estabilidade da demanda (X = estável, Z = volátil)
//      Identifica matriz 3×3: A-X, A-Y, A-Z, B-X, ..., C-Z
//      Redução de estoque: -13% = liberação R$ 910 mil
//      Ganho financeiro: 910 × 22% = R$ 200 mil/ano
//      Custo de implantação: R$ 220 mil (analytics + reorganização)
//      Tempo de ramp-up: 9-12 meses (exige time maduro)
//      Risco de ruptura: cai para 2,2% (A-Z recebe ES reforçado)
// =============================================================================

export const S3_1: Scenario = {
  id: "s3_1",
  code: "S3.1",
  title: "Curva ABC de 50 SKUs — Distribuidora Ômega",
  company: "Distribuidora Ômega Ltda.",
  difficulty: "Intermediário",
  estimatedMinutes: 20,
  context: {
    narrative:
      "Você é responsável pela **gestão de estoques** da **Distribuidora Ômega**, atacadista regional com **50 SKUs** ativos e **R$ 40 milhões de valor anual movimentado**. O estoque atual é de **R$ 7,0 milhões** (PMRE ≈ 63 dias) e o **custo de carregamento** é estimado em **22% a.a.** sobre o valor estocado — R$ 1,54 milhão/ano de custo financeiro implícito. A política atual trata todos os SKUs **de forma uniforme** (contagem mensal, lote padrão de compra), o que sobrecarrega o time em itens de baixo valor e subgoverna os SKUs críticos. A taxa de ruptura média é de **4%**, mas concentrada em itens C (7%) — sinal de que o controle está mal alocado. O CFO pediu uma **proposta de classificação ABC** e políticas diferenciadas, com estimativa de liberação de caixa em 12 meses.",
    keyFacts: [
      ["SKUs ativos", "50"],
      ["Valor anual movimentado", "R$ 40,0 M"],
      ["Estoque atual", "R$ 7,0 M (PMRE ≈ 63 d)"],
      ["Custo de carregamento", "22% a.a. = R$ 1,54 M/ano"],
      ["Taxa de ruptura média", "4%"],
      ["Concentração esperada (top 20%)", "≈ 80% do valor"],
      ["Equipe de estoques", "4 pessoas, R$ 480 mil/ano"],
      ["Nível de serviço-alvo", "97% (A) / 92% (B/C)"],
      ["Redução de estoque esperada (A / B / C)", "−10% / −5% / −13%"],
      ["Custo de implantação (A / B / C)", "R$ 120 / 45 / 220 mil"],
    ],
  },
  statements: [
    {
      id: "abc_distribuicao",
      title: "Classificação ABC — distribuição empírica e políticas propostas",
      unit: "R$ mil / % / dias",
      periods: ["Classe A", "Classe B", "Classe C"],
      sections: [
        {
          label: "Distribuição empírica (após ordenação por valor anual)",
          rows: [
            { label: "Quantidade de SKUs", values: [10, 15, 25], indent: 1 },
            { label: "% dos itens", values: [20, 30, 50], indent: 1 },
            { label: "Valor anual movimentado (R$ mil)", values: [32000, 6000, 2000], emphasis: "bold" },
            { label: "% acumulado do valor", values: [80, 95, 100], emphasis: "subtotal" },
          ],
        },
        {
          label: "Estoque atual e custo de carregamento",
          rows: [
            { label: "Estoque médio atual (R$ mil)", values: [4900, 1400, 700], indent: 1 },
            { label: "Custo de carregamento (22% a.a., R$ mil/ano)", values: [1078, 308, 154], indent: 1 },
            { label: "Taxa de ruptura atual (%)", values: [1.8, 5.0, 7.0], indent: 1 },
          ],
        },
        {
          label: "Política diferenciada proposta",
          rows: [
            { label: "Frequência de contagem (vezes/ano)", values: [12, 4, 1], indent: 1 },
            { label: "EOQ refinado? (1=sim)", values: [1, 1, 0], indent: 1 },
            { label: "Estoque de segurança calculado? (1=sim)", values: [1, 1, 0], indent: 1 },
            { label: "Lote grande / mínimo (1=sim, classe C)", values: [0, 0, 1], indent: 1 },
            { label: "Redução esperada de estoque (%)", values: [12, 10, 5], emphasis: "bold" },
            { label: "Liberação esperada (R$ mil)", values: [588, 140, 35], emphasis: "total" },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Construir a curva ABC.** Qual conjunto de cortes é **mais apropriado** para classificar A/B/C?",
      choices: [
        {
          id: "e1_a",
          label:
            "**Limites 80/15/5** (clássicos de Pareto) — classe A até 80% acumulado, B até 95%, C até 100%. A distribuição empírica **se ajusta exatamente** a essa proporção (poucos itens / muito valor).",
          correct: true,
          score: 20,
          feedback:
            "Correto. Os limites **80/15/5** são o padrão de Pareto e — mais importante — **a curva empírica desta carteira se ajusta a eles**. Quando a curva real bate com o padrão (caso clássico de distribuidoras), usar limites adaptados é desnecessário e gera ruído. A regra: **comece sempre com 80/15/5 e só desvie se a curva pedir** (ex.: indústria com 5 SKUs grandes que sozinhos dão 90% — aí faz sentido adaptar).",
        },
        {
          id: "e1_b",
          label:
            "**Limites 50/30/20** — distribui mais uniformemente entre as classes para suavizar a gestão.",
          correct: false,
          score: 0,
          feedback:
            "Anula o **propósito** da curva ABC. O objetivo da segmentação é **concentrar atenção onde está o valor** — distribuir uniformemente força o time a gastar 30% do esforço em itens que respondem por 5% do valor. A classe A deve ser **pequena e densa em valor**, justamente para receber controle apertado sem sobrecarregar a equipe.",
        },
        {
          id: "e1_c",
          label:
            "**Limites 70/20/10** — adaptados para distribuições menos concentradas.",
          correct: false,
          score: 5,
          feedback:
            "Adaptação **defensável em curvas pouco concentradas** (ex.: indústria farmacêutica com muitos SKUs equivalentes em valor). Aqui, porém, a curva está **claramente concentrada** (80% nos 20% top) — usar 70/20/10 desloca itens **de B para A** sem ganho real de governança e infla a classe A a ponto de **diluir** o controle. Use só quando a curva real exigir.",
        },
        {
          id: "e1_d",
          label:
            "**Não classificar** — tratar todos os SKUs com a mesma política simplifica a operação.",
          correct: false,
          score: 0,
          feedback:
            "É exatamente a política atual — e o **resultado** está visível: ruptura de 7% nos itens C (porque ninguém presta atenção) e estoque excessivo nos itens A (porque o lote padrão não cabe a SKUs de alto giro). Política uniforme é **sempre subótima** quando há heterogeneidade material entre SKUs — a ABC existe justamente para corrigir isso.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Políticas diferenciadas por classe.** Definidos A (10 SKUs), B (15) e C (25), qual **combinação de políticas** captura o ganho com **risco operacional controlado**?",
      choices: [
        {
          id: "e2_a",
          label:
            "**A**: contagem mensal + EOQ refinado + estoque de segurança calculado por nível de serviço + monitoramento diário do consumo. **B**: contagem trimestral + EOQ padrão + ES simplificado. **C**: contagem anual + **lote grande** + ressuprimento por estoque mínimo (regra simples).",
          correct: true,
          score: 20,
          feedback:
            "Correto e **proporcional ao valor em jogo**. A classe A justifica esforço analítico — o ganho por SKU é alto, então EOQ refinado + ES dimensionado paga rapidamente o tempo investido. B recebe versão **simplificada** dos mesmos instrumentos. C recebe **regra de bolso** (lote grande para minimizar custo de pedido relativo ao valor; contagem anual porque inventário frequente custa mais que o erro contábil). A política espelha a **economia do controle**: cada hora dedicada a um SKU C custa mais do que o erro que evita.",
        },
        {
          id: "e2_b",
          label:
            "Aplicar **EOQ refinado + ES calculado em TODOS os SKUs** — quanto mais sofisticada a análise, melhor o resultado.",
          correct: false,
          score: 5,
          feedback:
            "Sobreengenharia. Calcular EOQ e ES para 25 SKUs C consome **horas do time** sem retorno: um erro de 30% no lote de um SKU C movimenta talvez R$ 50/ano em custos — abaixo do custo da própria análise. A maturidade da gestão de estoques está em **saber onde NÃO investir esforço**. Política uniforme sofisticada é tão ruim quanto uniforme simples — apenas mais cara.",
        },
        {
          id: "e2_c",
          label:
            "**A**: contagem anual (são poucos SKUs, fáceis de controlar visualmente). **B** e **C**: contagem mensal (mais itens, mais risco).",
          correct: false,
          score: 0,
          feedback:
            "Inversão clássica. **Quanto maior o valor por SKU, mais cara é uma divergência contábil** — itens A merecem contagem **frequente** porque cada unidade fora de controle vale muito. Itens C podem ser contados anualmente (ou por amostragem) porque o erro absoluto é pequeno. A direção da regra é **A frequente, C esparso**, não o contrário.",
        },
        {
          id: "e2_d",
          label:
            "**Pular itens C** — não comprar mais, deixar a posição esgotar e descontinuar a linha.",
          correct: false,
          score: 0,
          feedback:
            "Confunde **ABC** com **descontinuação de produto**. Itens C **não são desnecessários** — frequentemente são complementos da linha (parafuso, embalagem, peça de reposição) cuja ausência **inviabiliza vendas dos itens A**. Antes de descontinuar, avalie **criticidade operacional** (cruzar com curva XYZ). ABC governa **como controlar**, não **se vender**.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Estimar o ganho.** e redução esperada de 5-13% conforme política adotada, qual estimativa é **defensável** em comitê?",
      choices: [
        {
          id: "e3_a",
          label:
            "Liberação de **R$ 700 mil em 12 meses** (-10%) com **ganho financeiro de R$ 154 mil/ano** (700 × 22%) — patamar típico de adoção integral em distribuidoras, comprovado por benchmarks setoriais.",
          correct: true,
          score: 20,
          feedback:
            "Correto e bem dimensionado. **−10% do estoque em 12 meses** é a faixa central observada em projetos de ABC bem executados em distribuidoras (variação 5-15%); R$ 700 mil × 22% = **R$ 154 mil/ano de custo de carregamento evitado**, sem contar ganho de WACC pela liberação de capital. Boa prática: **apresentar faixa (R$ 500-900 mil) com central R$ 700 mil**, não número único — o comitê precisa entender a incerteza.",
        },
        {
          id: "e3_b",
          label:
            "Liberação de **R$ 3,5 milhões** (-50%) — projetos de excelência em estoques costumam cortar pela metade.",
          correct: false,
          score: 0,
          feedback:
            "Promessa **inviável**. −50% só ocorre em casos extremos (estoque historicamente fora de controle, mudança radical de modelo operacional — JIT puro). Em distribuidora com estoque já em ~63 dias, faixa realista é **−5 a −15%**. Prometer −50% destrói credibilidade da tesouraria no segundo trimestre, quando o realizado virá em R$ 500-900 mil.",
        },
        {
          id: "e3_c",
          label:
            "**Sem estimativa** — projeto qualitativo, retorno difícil de mensurar.",
          correct: false,
          score: 0,
          feedback:
            "Comitê **não aprova projeto sem business case**. O ganho **é mensurável** (estoque liberado × custo de carregamento) e **comparável** a benchmarks setoriais. A função do tesoureiro é justamente **traduzir governança operacional em número financeiro**.",
        },
        {
          id: "e3_d",
          label:
            "Liberação de **R$ 154 mil** — igual ao ganho financeiro anual.",
          correct: false,
          score: 5,
          feedback:
            "Confunde **liberação de capital** (R$ 700 mil, redução do estoque) com **ganho financeiro recorrente** (R$ 154 mil/ano = liberação × custo de carregamento). São números diferentes que respondem perguntas diferentes — comitê pede ambos: \"quanto de caixa volta\" (R$ 700 mil) e \"quanto economizo por ano\" (R$ 154 mil).",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Adoção integral das políticas diferenciadas",
      shortLabel: "Adoção integral",
      description:
        "Implementação completa em **6 a 9 meses**: políticas diferenciadas A/B/C, EOQ refinado para 25 SKUs (A+B), ES dimensionado por nível de serviço, contagens em frequências distintas. Custo de implantação **R$ 120 mil** (sistemas + treinamento). Risco médio de execução.",
      resultPanel: {
        headline: "Liberação R$ 700 mil + ganho recorrente R$ 154 mil/ano, ruptura cai de 4% para 2,8%",
        deltas: [
          { label: "Δ Estoque médio", value: "−R$ 700 mil (−10%)", tone: "positive" },
          { label: "Δ Custo de carregamento", value: "−R$ 154 mil/ano", tone: "positive" },
          { label: "Δ Taxa de ruptura média", value: "4,0% → 2,8%", tone: "positive" },
          { label: "Custo de implantação", value: "R$ 120 mil (one-off)", tone: "negative" },
          { label: "Payback estimado", value: "≈ 10 meses", tone: "positive" },
          { label: "Tempo de ramp-up", value: "6 a 9 meses", tone: "neutral" },
          { label: "Risco de execução", value: "Médio — exige disciplina do time", tone: "neutral" },
        ],
        commentary:
          "**Política dominante quando a equipe tem maturidade operacional média ou superior.** A liberação de R$ 700 mil é **caixa real** que reduz NCG e pode amortizar dívida de CP a custo médio ~16% a.a. = ganho adicional R$ 112 mil/ano (somado aos R$ 154 mil de carregamento = R$ 266 mil/ano total). Redução de ruptura vem do **foco** em A (1,8% → 1,2%) e da contagem mais frequente em B (5% → 3,5%). C permanece em 7% — aceitável porque o impacto em receita é marginal. Risco principal: **abandonar a disciplina** após 3-4 meses (\"voltar ao lote padrão por comodidade\") — anula 60% do ganho.",
      },
      reflection: {
        prompt:
          "A adoção integral entrega R$ 154 mil/ano. Em que situação esse ganho **não justifica** o esforço?",
        choices: [
          {
            id: "ra_a",
            label:
              "Quando a empresa enfrenta **prioridade estratégica concorrente** — implantação de ERP, fusão, expansão geográfica — que **competiria pelos mesmos recursos** (tempo do time, capacidade de mudança organizacional). R$ 154 mil/ano não compete com projetos de R$ 5-10 M de NPV.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **Capacidade de execução é recurso escasso** — em qualquer empresa, há um limite de projetos simultâneos que o time absorve sem desorganizar o dia-a-dia. R$ 154 mil/ano é ganho **importante mas não estratégico**; se concorre com ERP (NPV R$ 5-10 M) ou fusão, **adia-se a ABC** sem prejuízo material. Alternativa nesse caso: cenário B (apenas classe A), que captura metade do ganho com 20% do esforço.",
          },
          {
            id: "ra_b",
            label:
              "Quando o custo de carregamento é menor que 22% — o ganho é diretamente proporcional à taxa.",
            correct: false,
            score: 5,
            feedback:
              "Verdadeiro em magnitude, mas **22% é um piso conservador** em distribuidoras (capital de giro de empresas médias custa 18-25%; obsolescência e armazenagem somam mais 3-5%). Cenários onde 22% é excessivo são raros — bancos e seguradoras com excedente de caixa, onde a tesouraria de fato carrega ao CDI puro.",
          },
          {
            id: "ra_c",
            label:
              "Quando a empresa **terceiriza** a distribuição — aí estoque não é problema dela.",
            correct: false,
            score: 0,
            feedback:
              "Terceirização **transfere** a operação física mas o **estoque continua sendo da empresa** contabilmente (cessão simples não tira do balanço — só venda firme). E o custo de carregamento **se transforma em fee do operador**, que sobe quando o estoque sobe. ABC continua relevante.",
          },
          {
            id: "ra_d",
            label:
              "Nunca — R$ 154 mil é sempre material em qualquer empresa.",
            correct: false,
            score: 0,
            feedback:
              "Em uma empresa de R$ 5 bilhões de receita, R$ 154 mil é **0,003% do faturamento** — abaixo do radar do comitê executivo. Materialidade é **relativa**; em distribuidora pequena (R$ 50-100 M de receita), o mesmo número é altamente material. A pergunta sempre é **relativa ao porte e às alternativas**.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — Adoção parcial (apenas classe A)",
      shortLabel: "Apenas classe A",
      description:
        "Implementação focada em **10 SKUs da classe A** em 3 meses: EOQ refinado, ES por nível de serviço 97%, contagem mensal, monitoramento diário. Custo de implantação **R$ 45 mil**. Classes B e C permanecem na política atual. Estratégia de fortalecimento gradual.",
      resultPanel: {
        headline: "Liberação R$ 350 mil + ganho R$ 77 mil/ano com 1/3 do esforço — pilot bem dimensionado",
        deltas: [
          { label: "Δ Estoque médio", value: "−R$ 350 mil (−5%)", tone: "positive" },
          { label: "Δ Custo de carregamento", value: "−R$ 77 mil/ano", tone: "positive" },
          { label: "Δ Taxa de ruptura classe A", value: "1,8% → 1,2%", tone: "positive" },
          { label: "Δ Taxa de ruptura B/C", value: "Inalterada", tone: "neutral" },
          { label: "Custo de implantação", value: "R$ 45 mil (one-off)", tone: "negative" },
          { label: "Payback estimado", value: "≈ 7 meses", tone: "positive" },
          { label: "Tempo de ramp-up", value: "3 meses", tone: "positive" },
        ],
        commentary:
          "**Pilot bem dimensionado** — captura **50% do ganho do cenário A com 38% do custo de implantação e metade do tempo**. Vantagens: (1) **risco operacional baixo** (só 10 SKUs em mudança); (2) **gera caso de sucesso** que destrava aprovação para expandir a B e C; (3) **time aprende** a metodologia antes de escalar. Desvantagem: **deixa ganho em cima da mesa** (R$ 77 mil/ano de gap vs cenário A) e mantém ruptura alta em C (7%). Indicação: equipe com **baixa maturidade prévia** em gestão de estoques, primeiro projeto formal de ABC, ou empresa em meio a outras transformações.",
      },
      reflection: {
        prompt:
          "Pilot na classe A captura metade do ganho. Quando **vale a pena** parar no pilot e não expandir para B/C?",
        choices: [
          {
            id: "rb_a",
            label:
              "Quando o **gap de R$ 77 mil/ano** (B → A) é desproporcional ao **esforço adicional** de gerir B+C com EOQ/ES refinados (40 SKUs adicionais, 2-3 meses de implantação extra). Em times pequenos, o trade-off pode ficar negativo.",
            correct: true,
            score: 25,
            feedback:
              "Correto e maduro. **Cada classe adicional tem custo marginal de gestão**, e R$ 77 mil/ano é um valor que **pode ou não compensar** dependendo do tamanho do time. Em equipe de 4 pessoas (caso da Ômega), assumir 40 SKUs adicionais pode demandar 0,5-1 FTE incremental — custo R$ 60-120 mil/ano que **come o ganho**. Regra: **expansão para B só vale se o ganho marginal > custo marginal de gestão**. Para C, raramente compensa.",
          },
          {
            id: "rb_b",
            label:
              "Quando o resultado do pilot na classe A **já fica abaixo do esperado** — sinal de que B e C também não trariam ganho.",
            correct: false,
            score: 5,
            feedback:
              "Parcialmente correto, mas a lógica é **mais nuançada**: se o pilot ficou abaixo do esperado por **problema de execução** (time não disciplinou), o problema também afetará B/C — aí não adianta expandir. Mas se ficou abaixo por **característica da carteira** (curva já bem comportada em A), B/C podem mostrar comportamento diferente. Diagnóstico antes de generalizar.",
          },
          {
            id: "rb_c",
            label:
              "Sempre — pilot bem-sucedido **prova** que o método funciona, e expandir é desperdício de recurso.",
            correct: false,
            score: 0,
            feedback:
              "Inverso da lógica de pilot. O pilot existe **justamente para destravar a expansão** — se sempre se parasse no pilot, nenhum projeto entregaria seu pleno valor. A pergunta é **quando** expandir, não **se** expandir; e a resposta é **\"quando ganho marginal > custo marginal\"**.",
          },
          {
            id: "rb_d",
            label:
              "Quando há mudança de **diretoria** — projetos pendentes morrem em transições.",
            correct: false,
            score: 5,
            feedback:
              "Verdade observacional (projetos morrem em transições), mas **não é argumento econômico** para parar — é apenas constatação de que politicamente fica difícil. A pergunta era **quando vale a pena** parar; mudança de diretoria é razão para **adiar**, não para **decidir não expandir**.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — ABC complementada por XYZ (estabilidade da demanda)",
      shortLabel: "ABC + XYZ",
      description:
        "Cruzamento da **curva ABC** (valor) com **curva XYZ** (estabilidade da demanda: X = estável, Y = moderada, Z = volátil), formando matriz 3×3. Itens **A-Z** recebem ES reforçado; itens **C-X** recebem lote muito grande sem risco. Implementação em 9-12 meses, custo R$ 220 mil. Exige time maduro.",
      resultPanel: {
        headline: "Liberação R$ 910 mil + ganho R$ 200 mil/ano e ruptura cai a 2,2% — o ótimo, se houver maturidade",
        deltas: [
          { label: "Δ Estoque médio", value: "−R$ 910 mil (−13%)", tone: "positive" },
          { label: "Δ Custo de carregamento", value: "−R$ 200 mil/ano", tone: "positive" },
          { label: "Δ Taxa de ruptura média", value: "4,0% → 2,2%", tone: "positive" },
          { label: "Δ Ruptura A-Z (críticos voláteis)", value: "Cai mais que cenário A (foco específico)", tone: "positive" },
          { label: "Custo de implantação", value: "R$ 220 mil (one-off)", tone: "negative" },
          { label: "Payback estimado", value: "≈ 14 meses", tone: "neutral" },
          { label: "Tempo de ramp-up", value: "9 a 12 meses", tone: "negative" },
        ],
        commentary:
          "**O ótimo teórico, condicionado a maturidade do time.** Matriz ABC × XYZ reconhece que **valor (ABC) e variabilidade (XYZ) são dimensões independentes**: um SKU C-Z (baixo valor, demanda errática) pode causar ruptura significativa se não tiver ES dimensionado; um SKU A-X (alto valor, demanda estável) tolera lote grande sem risco. Ganho **adicional vs cenário A**: R$ 210 mil de liberação + R$ 46 mil/ano de carregamento + redução de ruptura mais focada. Custo de complexidade: time precisa **calcular σ da demanda** por SKU (12 meses de histórico mínimo) e **rever a matriz semestralmente** — o que exige analista dedicado. Em time sem maturidade, vira **planilha gigantesca abandonada em 4 meses**.",
      },
      reflection: {
        prompt:
          "O cenário C exige maturidade do time. Qual sinal indica que a Ômega **ainda não está pronta** para implementá-lo?",
        choices: [
          {
            id: "rc_a",
            label:
              "Se a empresa **não tem histórico organizado de 12+ meses** de consumo por SKU (necessário para calcular σ da demanda), **ou se não tem analista dedicado** a estoques, a matriz XYZ vira exercício acadêmico sem dados confiáveis.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **Pré-requisito de dados é absoluto**: σ calculado sobre 3-6 meses de histórico é **estatisticamente ruído** — pode classificar um SKU sazonal como Z (volátil) quando ele é apenas Y (com pico previsível). Sem **12-24 meses de dados limpos** + **analista que entenda a matemática** e revise periodicamente, ABC × XYZ não entrega o ganho prometido. Boa prática: **fazer cenário B primeiro** (gera dados de qualidade ao longo do ano), depois evoluir para C no ano seguinte.",
          },
          {
            id: "rc_b",
            label:
              "Se a equipe é de **4 pessoas** — XYZ exige 8+ pessoas dedicadas para funcionar.",
            correct: false,
            score: 5,
            feedback:
              "**Tamanho do time é menos relevante que perfil**. Time pequeno mas analítico (1 pessoa com SQL/Python + 3 operacionais) consegue rodar ABC × XYZ. Time grande mas pouco analítico (8 pessoas todas operacionais) não consegue. O bottleneck é **competência analítica**, não headcount.",
          },
          {
            id: "rc_c",
            label:
              "Se o ERP **não emite relatório formatado** para ABC × XYZ.",
            correct: false,
            score: 5,
            feedback:
              "ERP é facilitador, não bloqueador. **Excel + extração de movimentos** resolve a operação ABC × XYZ em qualquer empresa com ERP minimamente funcional. Falta de relatório nativo torna o trabalho mais manual, mas não impede.",
          },
          {
            id: "rc_d",
            label:
              "Nunca — qualquer empresa pode implementar XYZ desde o primeiro dia se contratar consultoria.",
            correct: false,
            score: 0,
            feedback:
              "Consultoria **acelera implantação**, mas **não cria maturidade institucional**. O risco clássico: consultoria entrega XYZ rodando, vai embora, e em 6 meses ninguém atualiza a matriz — a complexidade vira passivo, não ativo. Maturidade se constrói com tempo e prática; consultoria ajuda quem **já está pronto** para o próximo passo.",
          },
        ],
      },
    },
  ],
};
