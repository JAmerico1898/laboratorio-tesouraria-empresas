import type { Scenario } from "@/types/scenario";

// =============================================================================
// S2.2 — Crise de liquidez prevista em 30 dias (modelo preditivo)
// =============================================================================
// Premissas (R$ milhões):
//
// Saldo atual = 3,0 ; Saldo mínimo = 2,0
// Modelo preditivo: 70% de probabilidade de violação do mínimo em 30 dias.
//
// Cenários (gap = saldo mínimo − caixa esperado em 30d):
//   Otimista : caixa esperado = -1,0  → gap =  3,0
//   Base     : caixa esperado = -6,0  → gap =  8,0
//   Pessimista: caixa esperado = -12,0 → gap = 14,0
//
// Alavancas internas mapeadas:
//   Carteira de recebíveis antecipável .......... R$ 6,0 M (cartão + duplicatas)
//   Pagamentos passíveis de adiamento ............ R$ 4,0 M (fornecedores não estratégicos)
//   CAPEX adiável ................................ R$ 1,5 M (manutenção postergável)
//
// Fontes externas:
//   Conta garantida pré-aprovada ................. R$ 10,0 M (CDI + 7% a.a. + IOF)
//   Capital de giro 18m (em análise) ............. até R$ 15 M (CDI + 3,5% a.a.)
//
// Custo de cada branch (estimado sobre cenário-base, gap 8 M):
//   A) Antecipação R$ 3 M @ 1,8%a.m. × 1 mês + CG R$ 5 M @ ~19%a.a. × 3 meses
//      Antecipação: 3,0 × 1,8% = 54 mil
//      CG (3m): 5,0 × 19,3% × 3/12 = 241 mil
//      Total ≈ R$ 295 mil ; custo relacional neutro ; rating preservado
//
//   B) CG 18m R$ 10 M @ 14,5% a.a. (CDI 11% + 3,5%) com duration ~9m
//      Custo ≈ 10,0 × 14,5% × 9/12 = 1.088 mil ≈ R$ 1.090 mil
//      Custo relacional positivo (sinal de planejamento) ; rating melhora
//      (estende perfil de dívida) ; resolve cenário pessimista também.
//
//   C) Adiar pagamentos R$ 8 M a fornecedores não estratégicos por 30-60d
//      Custo financeiro direto = 0 ; mas:
//      - Perda de desconto comercial (~2%) sobre R$ 8 M = R$ 160 mil
//      - Custo relacional alto (3-5 fornecedores) ; risco de corte de crédito
//      - Rating bancário neutro de início, negativo se virar padrão
//      Total quantificável ≈ R$ 160 mil; intangível: alto.
// =============================================================================

export const S2_2: Scenario = {
  id: "s2_2",
  code: "S2.2",
  title: "Crise de liquidez prevista em 30 dias",
  company: "Distribuidora Delta",
  difficulty: "Intermediário",
  estimatedMinutes: 20,
  context: {
    narrative:
      "Você é tesoureiro(a) da **Distribuidora Delta**, empresa de médio porte. O **modelo preditivo de fluxo de caixa** (regressão sazonal com decomposição STL) alertou agora cedo: **70% de probabilidade** de o saldo de caixa **violar o mínimo de R$ 2,0 M em 30 dias**. O saldo atual é de **R$ 3,0 M**. As simulações apontam um **gap de R$ 8 M no cenário-base**, R$ 14 M no pessimista e R$ 3 M no otimista. Você tem 30 dias — antes que o problema vire reativo, precisa **dimensionar o gap**, **mapear alavancas internas** (antecipação de carteira, negociação de fornecedores, CAPEX adiável) e **acionar fontes externas** (conta garantida pré-aprovada, banco de relacionamento, Open Finance). O CFO quer um plano em 48 horas.",
    keyFacts: [
      ["Saldo atual", "R$ 3,0 M"],
      ["Saldo mínimo", "R$ 2,0 M"],
      ["Prob. de violação (30d)", "70%"],
      ["Gap cenário-base", "R$ 8,0 M"],
      ["Carteira antecipável", "R$ 6,0 M"],
      ["Pagamentos negociáveis", "R$ 4,0 M"],
      ["CG pré-aprovada", "R$ 10,0 M (CDI + 7%)"],
      ["Janela de decisão", "30 dias"],
    ],
  },
  statements: [
    {
      id: "cenarios_30d",
      title: "Diagnóstico de liquidez em 30 dias — cenários",
      unit: "R$ milhões",
      periods: ["Otimista", "Base", "Pessimista"],
      sections: [
        {
          label: "Posição esperada em 30 dias",
          rows: [
            { label: "Caixa esperado em 30d", values: [-1.0, -6.0, -12.0], emphasis: "bold" },
            { label: "Saldo mínimo regulamentar (interno)", values: [2.0, 2.0, 2.0], indent: 1 },
            { label: "Gap (mínimo − esperado)", values: [3.0, 8.0, 14.0], emphasis: "subtotal" },
            { label: "Probabilidade do cenário", values: [0.2, 0.5, 0.3], indent: 1 },
          ],
        },
        {
          label: "Alavancas internas disponíveis (limites)",
          rows: [
            { label: "Carteira de recebíveis antecipável", values: [6.0, 6.0, 6.0], indent: 1 },
            { label: "Pagamentos negociáveis (fornec. não estratégicos)", values: [4.0, 4.0, 4.0], indent: 1 },
            { label: "CAPEX adiável (manutenção postergável)", values: [1.5, 1.5, 1.5], indent: 1 },
            { label: "Total potencial interno", values: [11.5, 11.5, 11.5], emphasis: "subtotal" },
          ],
        },
        {
          label: "Fontes externas pré-mapeadas",
          rows: [
            { label: "Conta garantida pré-aprovada disponível", values: [10.0, 10.0, 10.0], indent: 1 },
            { label: "Capital de giro 18m (em análise)", values: [15.0, 15.0, 15.0], indent: 1 },
          ],
        },
        {
          label: "Avaliação líquida",
          rows: [
            {
              label: "Necessidade líquida estimada (gap pós alavancas internas mínimas)",
              values: [0, 2.0, 8.0],
              emphasis: "total",
            },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Dimensionar o gap.** Qual é o **valor de referência** correto para dimensionar o instrumento de financiamento?",
      choices: [
        {
          id: "e1_a",
          label:
            "Dimensionar pelo **valor esperado ponderado + colchão**: E[gap] = 0,2 × 3 + 0,5 × 8 + 0,3 × 14 = **8,2 M**; contratar limite de **~R$ 10-12 M** (colchão de 25-50%).",
          correct: true,
          score: 20,
          feedback:
            "Correto. **E[gap] = 0,2×3 + 0,5×8 + 0,3×14 = 0,6 + 4,0 + 4,2 = R$ 8,2 M**. O instrumento deve cobrir o **valor esperado + colchão** dimensionado pela cauda (a probabilidade de 30% do pessimista é material). Boa prática: limite ≈ E[gap] × (1 + 25-50%). Conceito reforçado: **dimensionamento probabilístico** combina projeção pontual com cauda — usar só o cenário-base ignora 30% de chance de gap quase 2× maior; usar só o pessimista paga prêmio sobre crédito que provavelmente não usará.",
        },
        {
          id: "e1_b",
          label:
            "Usar **apenas o cenário-base** (R$ 8 M) — é o caso mais provável (50%), e dimensionar pelo pessimista é conservadorismo excessivo.",
          correct: false,
          score: 5,
          feedback:
            "Subdimensiona o risco. Se o pessimista (30% de chance) materializar, o limite contratado **não cobre R$ 6 M de exposição residual** — você vira tomador de última hora, com pricing punitivo. Estatisticamente: **70% de chance do gap ser ≥ R$ 8 M** (base + pessimista). O cenário-base não é piso — é mediana. Limite deve ser dimensionado **acima do E[gap], com colchão**.",
        },
        {
          id: "e1_c",
          label:
            "Dimensionar pelo **pessimista (R$ 14 M)** integralmente — por prudência regulatória de tesouraria.",
          correct: false,
          score: 5,
          feedback:
            "Excesso de prudência. Contratar limite de R$ 14 M quando o E[gap] é R$ 8,2 M significa **pagar tarifa de manutenção / commitment fee sobre R$ 6 M que provavelmente não serão usados**. Para conta garantida, isso pode custar 0,25-0,5% a.a. sobre não-utilizado = **R$ 15-30 mil/ano de prêmio desnecessário**. Pessimista vira piso só se a perda em caso de violação for **catastrófica e irreversível** (falência, default de covenants graves).",
        },
        {
          id: "e1_d",
          label:
            "Usar a **média simples** dos três cenários: (3 + 8 + 14) / 3 = **R$ 8,3 M**.",
          correct: false,
          score: 5,
          feedback:
            "Coincidência numérica próxima do correto, mas **metodologicamente errado**. Média simples **ignora as probabilidades** atribuídas pelo modelo — trata como se cada cenário fosse equiprovável. O cálculo correto pondera: **E[gap] = Σ p(i) × gap(i) = 8,2 M**. Em cenários com probabilidades muito diferentes, média simples e esperança matemática divergem fortemente; aqui ficaram próximas por acaso.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Mapear alavancas internas.** Antes de acionar funding externo, qual combinação de alavancas internas faz **mais sentido financeiro e estratégico**?",
      choices: [
        {
          id: "e2_a",
          label:
            "**Antecipação parcial da carteira (~R$ 3 M)** + **adiamento de CAPEX adiável (R$ 1,5 M)** + **renegociação seletiva com 1-2 fornecedores não estratégicos**. Reduz o gap externo em ~R$ 5-6 M sem queimar relacionamento.",
          correct: true,
          score: 20,
          feedback:
            "Correto. **Hierarquia de qualidade**: (1) **CAPEX adiável** (custo zero, é só prazo); (2) **antecipação parcial** (custo financeiro mensurável, sem dano relacional); (3) **negociação seletiva** (custo relacional contido, não generalizado). Soma ≈ **R$ 5-6 M** — derruba o gap base de R$ 8 M para ~R$ 2-3 M, escala compatível com **CG dentro do limite pré-aprovado**. Conceito reforçado: **alavancas internas vêm antes de funding externo**; cada R$ 1 antecipado/adiado **reduz** a base de cálculo do juros bancário.",
        },
        {
          id: "e2_b",
          label:
            "**Antecipar 100% da carteira (R$ 6 M)** imediatamente — solução rápida e sem custo relacional.",
          correct: false,
          score: 5,
          feedback:
            "Sem custo **relacional** sim, mas com **custo financeiro alto**: 6 M × 1,8% a.m. = R$ 108 mil por mês antecipado. Antecipar **tudo** também **esgota a alavanca** — se o cenário piorar, você não tem mais carteira para antecipar. **Reserve parte da carteira** como buffer para o pessimista. Boa prática: antecipar **50-60% da carteira disponível**, mantendo o restante como reserva tática.",
        },
        {
          id: "e2_c",
          label:
            "**Negociar adiamento com TODOS os fornecedores** (R$ 4 M) — é a opção sem custo financeiro nominal.",
          correct: false,
          score: 0,
          feedback:
            "Custo **financeiro nominal** zero, mas **custo relacional altíssimo** e **risco de corte de crédito em cadeia**. Renegociar com **3-5 fornecedores não estratégicos** é diferente de **renegociar com todos** — generalizar a renegociação sinaliza dificuldade financeira ao mercado fornecedor, e o resultado típico é **encurtamento de prazos** dos demais nos próximos 60 dias (efeito boomerang). Use a alavanca **cirurgicamente**, nunca em massa.",
        },
        {
          id: "e2_d",
          label:
            "**Pular alavancas internas e ir direto à conta garantida** — o tempo de execução interno é maior que 30 dias.",
          correct: false,
          score: 0,
          feedback:
            "Não. **Antecipação de carteira** e **adiamento de CAPEX** são executáveis em **D+1 a D+5**, dentro da janela de 30 dias. Pular alavancas internas significa **pagar juros bancários sobre dinheiro que você poderia ter sem custo (CAPEX) ou com custo menor (carteira)**. Regra: **internal first, external para gap residual**.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Acionar fontes externas.** Para o gap residual (após alavancas internas), qual instrumento externo é o **mais adequado** considerando a janela de 30 dias e a incerteza dos cenários?",
      choices: [
        {
          id: "e3_a",
          label:
            "**Ativar a conta garantida pré-aprovada** (R$ 10 M, CDI + 7%) — instantânea, dimensionada para descasamentos pontuais, e a janela de 30 dias **não permite** estruturar um capital de giro novo (análise + comitê + contratação leva 30-60 dias).",
          correct: true,
          score: 20,
          feedback:
            "Correto. A conta garantida foi **desenhada exatamente para isto**: descasamento pontual com **execução em D+0**. Capital de giro novo exige **análise de crédito, comitê e contratação** — tipicamente 30-60 dias, inviável aqui. **Open Finance** pode acelerar análise multibancos para uma **segunda janela** (se o gap se mostrar estrutural), mas não é solução para 30 dias. Conceito reforçado: **o instrumento certo é função do prazo de execução disponível**, não só do custo nominal.",
        },
        {
          id: "e3_b",
          label:
            "**Captar capital de giro 18 meses (CDI + 3,5%)** imediatamente — é o mais barato em CET.",
          correct: false,
          score: 5,
          feedback:
            "Mais barato em CET, mas **inexequível na janela de 30 dias** — análise de crédito + aprovação de comitê + lavratura do contrato + registro de garantias = 30-60 dias em ambiente normal. Se você tentar acelerar, paga **spread emergencial** que neutraliza a economia. CG 18m faz sentido **como segunda etapa**, após a CG cobrir o gap imediato. **Sequenciamento importa** tanto quanto o pricing.",
        },
        {
          id: "e3_c",
          label:
            "**Recorrer ao banco de relacionamento** pedindo um **empréstimo emergencial fora das linhas pré-aprovadas**.",
          correct: false,
          score: 5,
          feedback:
            "Banco de relacionamento pode até atender, mas: (1) **pricing emergencial** (CDI + 9-12% típico), (2) **sinaliza fragilidade** ao gerente, podendo apertar covenants nas próximas operações, (3) **demora 5-15 dias** mesmo no relacionamento. A **CG pré-aprovada** existe justamente para você **não precisar pedir socorro**. Use o relacionamento para **outra coisa** (estruturar o CG 18m em paralelo, por exemplo).",
        },
        {
          id: "e3_d",
          label:
            "**Usar Open Finance** para abrir consultas simultâneas em 5 bancos e capturar a melhor taxa em 48h.",
          correct: false,
          score: 5,
          feedback:
            "Open Finance **acelera análise**, mas **não substitui o ciclo de contratação** (comitê, garantias, registro). Em 48h você obtém **pré-propostas**, não dinheiro em conta. Use Open Finance para **a segunda janela** (estruturar funding de médio prazo), não para o gap de 30 dias. Para o imediato, **CG pré-aprovada** é a única ferramenta com execução em D+0.",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Conservadora: antecipação parcial + conta garantida",
      shortLabel: "Antecipação + CG",
      description:
        "**Antecipar R$ 3 M da carteira** (50% da carteira disponível) por 30 dias + **acionar R$ 5 M da CG pré-aprovada** por ~90 dias. Reserva o restante da carteira e o limite de CG não usado como **buffer para o cenário pessimista**. Reduz exposição a um único instrumento.",
      resultPanel: {
        headline: "Custo total ~R$ 295 mil e buffer preservado: solução robusta à incerteza dos cenários",
        deltas: [
          { label: "Custo financeiro (estimado)", value: "≈ R$ 295 mil (antecipação 54 + CG 241)", tone: "neutral" },
          { label: "Custo relacional", value: "Neutro (sem renegociação com fornecedores)", tone: "positive" },
          { label: "Flexibilidade", value: "Alta — CG é rotativa, antecipação é pontual", tone: "positive" },
          { label: "Impacto no rating bancário", value: "Neutro a positivo (usa linha pré-aprovada com disciplina)", tone: "positive" },
          { label: "Prazo de resolução", value: "30-90 dias", tone: "neutral" },
          { label: "Buffer remanescente", value: "Carteira R$ 3 M + CG R$ 5 M disponíveis", tone: "positive" },
        ],
        commentary:
          "**Solução conservadora bem dimensionada.** Cálculos: **Antecipação** = 3,0 M × 1,8% × 1 mês = **R$ 54 mil**; **CG (3 meses)** = 5,0 M × 19,3% a.a. × 3/12 = **R$ 241 mil**; **total ≈ R$ 295 mil**. Vantagem central: **dois instrumentos em paralelo** diversificam risco operacional — se um banco da CG endurecer condições, a antecipação cobre; se a carteira de cartão cair, a CG cobre. Buffer remanescente (R$ 8 M entre os dois) atende ao cenário pessimista sem renegociar nada. Risco: se o gap se mostrar **estrutural** (volta nos próximos trimestres), você terá usado CG por mais tempo do que deveria — migrar para CG 18m vira **etapa seguinte obrigatória**.",
      },
      reflection: {
        prompt:
          "Se o gap **voltar nos próximos 4 trimestres** (sinal de problema estrutural), qual aspecto desta escolha conservadora gera **mais arrependimento**?",
        choices: [
          {
            id: "ra_a",
            label:
              "Ter **usado conta garantida como funding recorrente** — em 4 trimestres, o custo acumulado supera o de um CG 18m contratado já no início. CG é seguro de liquidez pontual, **não funding estrutural**.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **Conta garantida usada por > 90 dias paga prêmio sem entregar valor** — a flexibilidade de saque/quitação instantânea não é necessária se a empresa **sabe** que precisará do dinheiro pelos próximos 12 meses. Custo comparativo: 4 trimestres × R$ 241 mil = **~R$ 960 mil de CG** vs. **R$ 1.090 mil de CG 18m** (e este resolve também o cenário pessimista). O verdadeiro arrependimento: ter tratado o sintoma (gap de 30d) sem investigar a **doença** (NCG crescente, queda de margem, perda de cliente). Boa prática: **a cada uso de CG > 60 dias, reabrir o diagnóstico**.",
          },
          {
            id: "ra_b",
            label:
              "Ter **antecipado parte da carteira** — antecipação é deságio, então o custo é alto e não recuperável.",
            correct: false,
            score: 5,
            feedback:
              "A antecipação de 3 M custou apenas R$ 54 mil — **fração mínima** do custo total. O arrependimento não está aqui; está em **continuar usando CG como funding longo**, que é o componente caro e estrutural. Antecipação é tática e foi usada corretamente.",
          },
          {
            id: "ra_c",
            label:
              "Ter **mantido buffer** — se você tivesse usado a totalidade da CG e da carteira no Q1, o custo de funding nos trimestres seguintes seria menor.",
            correct: false,
            score: 0,
            feedback:
              "Inverso. **Manter buffer foi a decisão correta** — esgotar instrumentos no primeiro choque deixa a empresa sem amortecedor para o pessimista ou para choques subsequentes. O arrependimento é estrutural (não migrar para CG 18m), não tático (uso conservador das alavancas).",
          },
          {
            id: "ra_d",
            label:
              "Não há arrependimento — a escolha conservadora é dominante em qualquer cenário.",
            correct: false,
            score: 0,
            feedback:
              "**Dominante apenas em horizonte curto.** Se o gap virar recorrente, a solução conservadora vira **custosa por inação** — a empresa fica rolando CG quando deveria ter estruturado funding longo. Ausência de arrependimento é sinal de **não ter reavaliado o diagnóstico** após o segundo trimestre.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — Estrutural: capital de giro 18 meses",
      shortLabel: "CG 18m",
      description:
        "**Captar R$ 10 M em capital de giro de 18 meses** a **CDI + 3,5% a.a.**, com cronograma de amortização linear e covenants padrão (DL/EBITDA, liquidez corrente). Resolve o cenário pessimista, estende o perfil de dívida e sinaliza **planejamento** ao mercado.",
      resultPanel: {
        headline: "Solução estrutural: custo nominal maior, mas resolve cenários base e pessimista de uma vez",
        deltas: [
          { label: "Custo financeiro estimado", value: "≈ R$ 1.090 mil (10 M × 14,5% × duration 9m)", tone: "negative" },
          { label: "Custo relacional", value: "Positivo — sinaliza planejamento ao banco", tone: "positive" },
          { label: "Flexibilidade", value: "Baixa — cronograma contratado, multa de pré-pagamento", tone: "negative" },
          { label: "Impacto no rating bancário", value: "Positivo — alonga perfil de dívida", tone: "positive" },
          { label: "Prazo de resolução", value: "30-60 dias para contratar; 18 meses de vida útil", tone: "neutral" },
          { label: "Resolve o pessimista?", value: "Sim — R$ 10 M cobre gap de R$ 14 M com alavancas", tone: "positive" },
        ],
        commentary:
          "**Solução estrutural.** Cálculo: 10 M × **14,5% a.a.** (CDI 11% + spread 3,5%) × **duration ~9m** (amortização linear) = **R$ 1.090 mil**. Custo nominal maior que o cenário A (R$ 295 mil) porque resolve um **horizonte muito mais longo** e o **pessimista**. Vantagens: (1) **alonga perfil** de dívida → melhora rating; (2) **libera buffer interno** (carteira de cartão fica intacta); (3) sinaliza ao banco que a empresa **planeja**, fortalecendo relacionamento. Desvantagens: (1) **menos flexível** — se o cenário melhorar muito, sobra caixa pago a CDI+3,5%; (2) **covenants** exigem monitoramento. Risco crítico: contratar **R$ 10 M sem opção de pré-pagamento sem multa** trava a empresa por 18 meses; sempre negocie essa cláusula.",
      },
      reflection: {
        prompt:
          "A solução B custa R$ 800 mil a mais que a A no horizonte curto. Em que **diagnóstico** essa diferença se justifica?",
        choices: [
          {
            id: "rb_a",
            label:
              "Quando o gap não é descasamento pontual e sim **efeito tesoura incipiente** — NCG crescendo mais rápido que o autofinanciamento. Aí o problema voltará nos próximos trimestres, e o CG 18m **previne** múltiplas idas à conta garantida.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **Diagnóstico determina instrumento**. Se a tesoureira identifica que (1) a NCG cresceu acima da receita nos últimos 6 meses, (2) a margem está sob pressão, (3) o gap está se repetindo trimestralmente — então o problema é **estrutural**, e CG 18m é a resposta certa mesmo com custo nominal maior. Diferença de R$ 800 mil é o **prêmio por antecipar a solução** vs descobrir tarde demais. Conceito reforçado: **distinguir sintoma (gap de 30d) de doença (NCG crescente, queda de margem) é o trabalho central do tesoureiro maduro**.",
          },
          {
            id: "rb_b",
            label:
              "Quando o CDI vai subir nos próximos 12 meses — travar a taxa hoje é vantajoso.",
            correct: false,
            score: 5,
            feedback:
              "Ambos os instrumentos (CG e CG 18m) são **pós-fixados no CDI** — não há \"travar taxa\". O **spread sobre o CDI** é fixo, mas a referência flutua junto. A justificativa para CG 18m é **estrutural** (alongamento de perfil), não tática (lock-in de juros).",
          },
          {
            id: "rb_c",
            label:
              "Quando a empresa quer melhorar o rating bancário no curto prazo para uma operação maior nos próximos meses.",
            correct: false,
            score: 5,
            feedback:
              "**Pode contribuir**, mas tomar dívida só para melhorar rating é circular — rating melhora quando a empresa **prova** que gere dívida bem, não pelo simples ato de captar. A justificativa principal é **estrutural** (efeito tesoura incipiente, ciclo financeiro alongando) — o ganho de rating é consequência, não causa.",
          },
          {
            id: "rb_d",
            label:
              "Sempre — capital de giro 18m é sempre superior a CG porque o spread é menor.",
            correct: false,
            score: 0,
            feedback:
              "Não. CG 18m **trava** R$ 10 M por 18 meses pagando juros mesmo se o problema desaparecer em 2 meses. Para **descasamento pontual** (festividade, atraso de um grande cliente, sazonalidade conhecida), conta garantida é dominante. Instrumento certo depende de **diagnóstico**, não de regra fixa.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — Agressiva: adiar pagamentos a fornecedores não estratégicos",
      shortLabel: "Adiar fornecedores",
      description:
        "**Adiar R$ 8 M de pagamentos** a fornecedores não estratégicos por 30-60 dias via **renegociação formal** (não calote). Custo financeiro direto zero, mas custo relacional alto e perda de desconto comercial. Aceitável apenas em cenários extraordinários.",
      resultPanel: {
        headline: "Custo financeiro zero, mas R$ 160 mil de desconto perdido e risco relacional alto",
        deltas: [
          { label: "Custo financeiro direto", value: "R$ 0 (sem juros bancários)", tone: "positive" },
          { label: "Perda de desconto comercial (~2%)", value: "≈ R$ 160 mil sobre R$ 8 M renegociados", tone: "negative" },
          { label: "Custo relacional", value: "Alto — 3-5 fornecedores expostos à dificuldade da empresa", tone: "negative" },
          { label: "Flexibilidade", value: "Baixa — depende do aceite dos fornecedores", tone: "negative" },
          { label: "Impacto no rating bancário", value: "Neutro hoje; negativo se virar padrão", tone: "negative" },
          { label: "Risco de corte de crédito em cadeia", value: "Médio — fornecedores podem encurtar prazos dos demais", tone: "negative" },
        ],
        commentary:
          "**Solução heterodoxa — usar com extrema cautela.** Custo direto zero **é ilusão contábil**: a perda de desconto comercial (~2% sobre R$ 8 M) representa **R$ 160 mil de margem evaporada**, e essa perda **anualiza em ~26% a.a.** (2% em 30 dias composto = 26,8% a.a.) — taxa implícita **maior que CG (19%)**. Pior: o **custo relacional** é tipicamente subestimado — fornecedores que aceitam adiamento **encurtam prazos** ou **endurecem condições** nas próximas compras, criando custo invisível recorrente. Cenário onde se justifica: **stress extremo + ciclo claro de reversão em 60 dias + relacionamento muito sólido com fornecedores**. Em qualquer outro contexto, **CG é dominante** financeira e estrategicamente.",
      },
      reflection: {
        prompt:
          "A solução C parece grátis (custo bancário zero), mas o desconto comercial perdido equivale a quanto em taxa anualizada — e por que isso é decisivo?",
        choices: [
          {
            id: "rc_a",
            label:
              "**2% em 30 dias = (1,02)^12 − 1 ≈ 26,8% a.a.** — taxa implícita **maior que conta garantida (19%) e CG 18m (14,5%)**. A solução \"sem custo\" é, na prática, **o financiamento mais caro** das três.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **Custo de oportunidade do desconto comercial é a métrica certa** — sempre converta o desconto perdido em taxa anualizada composta. Resultado: **26,8% a.a.**, o **instrumento mais caro** do menu. Conceito reforçado: \"sem custo bancário\" não é \"sem custo\" — **desconto comercial perdido é juros embutidos**. Por isso a regra geral: **antes de adiar pagamento de fornecedor que oferece desconto à vista, compare a TIR do desconto com o custo da CG**.",
          },
          {
            id: "rc_b",
            label:
              "2% × 12 = **24% a.a. linear** — alto, mas próximo da conta garantida, então diferença marginal.",
            correct: false,
            score: 5,
            feedback:
              "Linearização **subestima** o custo. A capitalização composta sobre 12 períodos eleva de 24% para **26,8% a.a.**. Sobre R$ 8 M, a diferença entre linear e composto é R$ 224 mil — não marginal. Use sempre regime composto em comparações > 30 dias.",
          },
          {
            id: "rc_c",
            label:
              "**0% a.a.** — adiamento não tem custo financeiro, apenas relacional, que é qualitativo.",
            correct: false,
            score: 0,
            feedback:
              "Erro fundamental: ignora **custo de oportunidade do desconto** (perda de 2% sobre R$ 8 M = R$ 160 mil). Tratar custo como zero leva a **escolhas sistematicamente piores** — você sub-precifica a alavanca \"adiar fornecedores\" e a usa em excesso. Em economia financeira: **se há desconto comercial disponível, adiar pagamento NÃO é grátis — é o financiamento mais caro do mercado**.",
          },
          {
            id: "rc_d",
            label:
              "Depende do fornecedor — se ele não cobrar juros explícitos, o custo financeiro é zero independentemente do desconto.",
            correct: false,
            score: 0,
            feedback:
              "Inverte causalidade. **Juros explícitos** e **desconto à vista** são **duas formas equivalentes** de remunerar o capital adiantado — o fornecedor que oferece 2% de desconto à vista está, na prática, cobrando 26,8% a.a. de quem paga a prazo. Confundir \"sem juros nominais\" com \"sem custo financeiro\" é o erro mais frequente em análise de funding curto.",
          },
        ],
      },
    },
  ],
};
