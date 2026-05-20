import type { Scenario } from "@/types/scenario";

// =============================================================================
// S4.1 — Concessão de crédito a cliente novo — Distribuidora Sigma
// =============================================================================
// Premissas:
//
// Empresa: Distribuidora Sigma (atacado de materiais elétricos).
// Cliente novo: varejista regional, 5 lojas, faturamento estimado R$ 12 M/ano.
// Pedido pretendido: R$ 800.000/ano, pagamento em 45 dias.
// Margem bruta da Sigma: 30%. Custo variável: 70%.
// Custo financeiro da Sigma (custo de capital): 1,5% a.m. = ~19,6% a.a.
// Custo administrativo da carteira: 0,3% sobre o valor faturado.
//
// Avaliação 5 Cs (síntese):
//   Caráter: histórico Serasa limpo, sem protestos, 7 anos no mercado (✓✓)
//   Capacidade: DRE 12M revela margem 8%, geração de caixa R$ 1,0 M/ano,
//     parcela de R$ 67 mil/mês (R$ 800k/12) é absorvível (✓✓)
//   Capital: PL R$ 1,8 M, DL/PL = 0,9, alavancagem moderada (✓)
//   Colateral: sem garantias formais inicialmente (oferta inicial); pode
//     oferecer aval do sócio e cessão fiduciária se exigido (~)
//   Condições: setor de varejo elétrico estável; macro: juros altos,
//     consumo retraído mas resiliente em reforma residencial (~)
// Score qualitativo: B+ (bom risco, sem garantias premium ainda).
//
// Análise marginal anual (sem garantias):
//   Margem bruta: 30% × 800.000 = R$ 240.000
//   Inadimplência esperada: 4% (perfil B+) × 800.000 = R$ 32.000
//     (sobre o custo: 4% × 70% × 800.000 = R$ 22.400 mais conservador)
//   Custo financeiro: 800.000/360 × 45 × 1,5%/30 × 12
//     = 100.000 (saldo médio em circulação) × 19,6% = R$ 19.600
//   Custo administrativo: 0,3% × 800.000 = R$ 2.400
//   Ganho líquido: 240.000 − 32.000 − 19.600 − 2.400 = R$ 186.000/ano
//   ROIC marginal: 186.000 / 100.000 (capital médio empatado) = 186%
//
// Cenário A — Aprovação plena (R$ 800k, 45 d, sem garantias adicionais)
//   Ganho líquido R$ 186 k/ano
//   Risco residual: inadimplência > esperada (cauda em B+)
//   Pricing padrão
//
// Cenário B — Aprovação com limite reduzido (R$ 400k, revisão em 6m)
//   Ganho líquido proporcional: 240k × 0,5 − 16k − 9,8k − 1,2k = R$ 93k/ano
//   Risco material: 50% inicial, expansão se cumprir.
//   Possível desistência do cliente (vai a concorrente que aprovou cheio)
//
// Cenário C — Aprovação plena + aval + cessão fiduciária + pricing premium
//   Ganho líquido com pricing +1% margem: 240k + 8k − 12k − 19,6k − 2,4k
//     = R$ 214k/ano (recuperação parcial pelo pricing premium)
//   Inadimplência efetiva: 1,5% (aval + cessão reduzem)
//   Risco residual baixo
//   Risco comercial: cliente pode rejeitar exigências (perde negócio)
// =============================================================================

export const S4_1: Scenario = {
  id: "s4_1",
  code: "S4.1",
  title: "Concessão de crédito a cliente novo — Distribuidora Sigma",
  company: "Distribuidora Sigma Ltda.",
  difficulty: "Intermediário",
  estimatedMinutes: 22,
  context: {
    narrative:
      "Você integra o **comitê de crédito** da **Distribuidora Sigma**, atacadista de materiais elétricos. Um **cliente novo** — varejista regional com **5 lojas** e faturamento estimado de **R$ 12 milhões/ano** — solicita conta corrente com **pedido anual estimado de R$ 800 mil** e prazo de **45 dias**. A margem bruta da Sigma é de **30%**, custo financeiro do capital é **1,5% a.m. (~19,6% a.a.)** e custo administrativo da carteira é **0,3%** sobre o faturado. A análise preliminar dos **5 Cs** indica perfil **B+** (bom risco com algumas ressalvas): Serasa limpo, 7 anos no mercado, geração de caixa de R$ 1 M/ano e DL/PL de 0,9. O cliente **não oferece garantias formais** inicialmente. O comitê precisa decidir entre **aprovação plena**, **aprovação com limite reduzido** ou **aprovação com aval + cessão fiduciária + pricing premium**.",
    keyFacts: [
      ["Pedido anual", "R$ 800.000"],
      ["Prazo solicitado", "45 dias"],
      ["Margem bruta", "30%"],
      ["Custo financeiro (Sigma)", "1,5% a.m. (~19,6% a.a.)"],
      ["Custo administrativo", "0,3% × faturado"],
      ["Perfil 5 Cs", "B+ (bom com ressalvas)"],
      ["Inadimplência esperada (perfil B+)", "4%"],
      ["Decisão", "Plena × Limite reduzido × Aval + cessão + pricing"],
    ],
  },
  statements: [
    {
      id: "analise_marginal",
      title: "Análise marginal anual — três configurações de aprovação",
      unit: "R$ / % / dias",
      periods: ["A: Plena", "B: Limite reduzido", "C: Aval + cessão + pricing"],
      sections: [
        {
          label: "Volume e prazo",
          rows: [
            { label: "Volume anual aprovado (R$)", values: [800000, 400000, 800000], emphasis: "bold" },
            { label: "Prazo (dias)", values: [45, 45, 45], indent: 1 },
            { label: "Margem efetiva (%)", values: [30.0, 30.0, 31.0], indent: 1 },
          ],
        },
        {
          label: "Componentes da margem líquida (R$/ano)",
          rows: [
            { label: "Margem bruta", values: [240000, 120000, 248000], indent: 1 },
            { label: "Inadimplência esperada", values: [-32000, -16000, -12000], indent: 1 },
            { label: "Custo financeiro do prazo", values: [-19600, -9800, -19600], indent: 1 },
            { label: "Custo administrativo", values: [-2400, -1200, -2400], indent: 1 },
            { label: "Ganho líquido anual (R$)", values: [186000, 93000, 214000], emphasis: "total" },
          ],
        },
        {
          label: "Métricas de risco e comerciais",
          rows: [
            { label: "Inadimplência efetiva esperada (%)", values: [4.0, 4.0, 1.5], indent: 1 },
            { label: "Capital empatado médio (R$)", values: [100000, 50000, 100000], indent: 1 },
            { label: "ROIC marginal (% a.a.)", values: [186, 186, 214], emphasis: "subtotal" },
            { label: "Risco residual (1-5)", values: [3, 2, 1], indent: 1 },
            { label: "Risco comercial (cliente desistir)", values: [1, 3, 4], indent: 1 },
          ],
        },
      ],
    },
  ],
  etapas: [
    {
      id: "etapa_1",
      prompt:
        "**Etapa 1 — Aplicar os 5 Cs.** Qual é a **leitura defensável** para o comitê?",
      choices: [
        {
          id: "e1_a",
          label:
            "**Perfil B+** — bom risco com **ressalvas em Colateral e Condições**. Caráter e Capacidade carregam o diagnóstico; ausência de garantias é o item que **pode ser endereçado** (aval pessoal do sócio, cessão fiduciária). Comitê deve aprovar com decisão sobre garantias.",
          correct: true,
          score: 20,
          feedback:
            "Correto. Os 5 Cs são **vetores ponderados**, não checklist binário. **Caráter + Capacidade são os mais pesados** porque indicam *vontade* e *meios* de pagar; Colateral é importante mas **substituível** (aval e cessão são instrumentos comuns); Condições são contexto. Perfil B+ com colateral ausente é **endereçável** — não é veto automático, é parâmetro para configurar a aprovação (limite, prazo, garantias exigidas).",
        },
        {
          id: "e1_b",
          label:
            "**Perfil D** — falta de colateral é veto absoluto em política conservadora. Recusar a venda.",
          correct: false,
          score: 0,
          feedback:
            "Veto por **único C** ignora ponderação. Empresas com Caráter e Capacidade fortes podem ser aprovadas **sem colateral** (com pricing ajustado) — é assim que **bancos digitais** operam (Nubank, Inter). Recusar venda de R$ 800k/ano por falta de garantia é **abrir caminho para a concorrência** sem fundamento técnico.",
        },
        {
          id: "e1_c",
          label:
            "**Perfil A** — todos os Cs positivos; aprovar imediatamente sem ressalvas.",
          correct: false,
          score: 5,
          feedback:
            "Diagnóstico **inflado**. Capital moderado (DL/PL 0,9 é alto-moderado), Colateral ausente e Condições médias **não suportam** perfil A. Aprovar como A leva a **pricing sub-ótimo** (margem inferior à compatível com o risco real) e a **falta de monitoramento** (cliente A não é revisado tão frequentemente).",
        },
        {
          id: "e1_d",
          label:
            "**Sem perfil definido** — esperar 6 meses de relacionamento antes de classificar.",
          correct: false,
          score: 0,
          feedback:
            "Inviável — o cliente quer comprar **hoje**. Política comercial exige decisão **com informação disponível**, não com informação perfeita. Score B+ baseado em bureau + DRE + análise setorial **é suficiente** para decisão de primeira aprovação; revisão posterior ajusta o perfil com dados de pagamento.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Calcular o ganho marginal.** Para o **cenário A (plena)**, com margem 30%, inadimplência esperada 4%, prazo 45 dias e custo financeiro 1,5% a.m., qual é o **ganho líquido anual**?",
      choices: [
        {
          id: "e2_a",
          label:
            "Margem 240k − Inadimplência 32k (4% × 800k) − Custo financeiro 19,6k (capital médio 100k × 19,6%) − Admin 2,4k = **R$ 186 mil/ano**. ROIC marginal = 186k/100k capital empatado = **186% a.a.** — política viável.",
          correct: true,
          score: 20,
          feedback:
            "Correto. **Análise marginal** funciona assim: margem bruta − inadimplência esperada − custo financeiro do prazo − despesa administrativa. **Capital médio empatado** = receita × prazo/360 = 800k × 45/360 = 100k. ROIC marginal de 186% **parece exagerado**, mas é correto — refletem que cada R$ 1 de crédito gera 30 centavos de margem, e o capital fica empatado apenas 45 dias. Boa prática: **comparar ROIC marginal vs custo de capital** (19,6%) — diferencial enorme indica viabilidade clara.",
        },
        {
          id: "e2_b",
          label:
            "Margem 240k − Custo financeiro sobre receita total 156k (19,6% × 800k) = **R$ 84 mil/ano**.",
          correct: false,
          score: 0,
          feedback:
            "Aplica o custo financeiro sobre o **valor errado** — não é sobre os R$ 800k de receita, é sobre o **capital médio empatado** (R$ 100k = receita × prazo/360). O capital não fica empatado o ano inteiro — é uma carteira girando 8 vezes ao ano (360/45). Custo financeiro correto: 100k × 19,6% = R$ 19,6k, não R$ 156k. Erro factor ~8×.",
        },
        {
          id: "e2_c",
          label:
            "Margem 240k − Inadimplência 32k = **R$ 208 mil/ano** (custo financeiro é absorvido pela margem).",
          correct: false,
          score: 5,
          feedback:
            "Esqueceu o **custo financeiro do prazo concedido**. Conceder 45 dias **é financiar o cliente** — esse capital tem custo de oportunidade que **precisa ser deduzido**. Ignorá-lo superestima o ganho em R$ 19,6k e leva a aprovações que parecem rentáveis mas são marginais.",
        },
        {
          id: "e2_d",
          label:
            "Receita total 800k − Custos totais (560k + 32k + 19,6k + 2,4k) = **R$ 186 mil/ano** — abordagem alternativa que dá mesmo resultado.",
          correct: false,
          score: 15,
          feedback:
            "**Numerador correto** (R$ 186k), mas **denominação errada da metodologia**: você não subtraiu \"custos totais\", subtraiu o **CMV (560k = 70% × 800)** + os componentes de risco/financeiro/admin. Chamar isso de \"receita − custos totais\" é correto contabilmente, mas mistura naturezas — margem bruta já considera CMV. Em análise marginal, prefira **partir da margem bruta** e deduzir os incrementais (inadimplência, custo financeiro, admin) — fica mais transparente para o comitê.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Decidir a configuração.** Qual é a **decisão mais defensável**?",
      choices: [
        {
          id: "e3_a",
          label:
            "**Cenário A (plena), com revisão programada em 6 meses** — captura o ganho cheio (R$ 186k/ano), evita risco comercial (cliente não rejeita), e a revisão em 6 meses **converte para B ou C** se o histórico de pagamento desviar do esperado. Risco residual gerenciado por monitoramento, não por exigência prévia.",
          correct: true,
          score: 20,
          feedback:
            "Correto e proporcional. Para **cliente B+ com Caráter forte**, exigir aval/cessão **antes do relacionamento** sinaliza desconfiança e pode levar a perder o negócio (e a margem) para concorrência que aceitou risco similar. **Aprovar plena + monitorar** é a prática dominante em B2B: primeiro pagamento atrasado dispara revisão automática, e exigência de garantias entra **no contrato de renovação**, não na primeira venda. Boa prática: estabelecer KPIs de revisão (PMRV efetivo ≤ 50 dias, atrasos < 7 dias) e gatilhos explícitos para reclassificação.",
        },
        {
          id: "e3_b",
          label:
            "**Cenário B (limite reduzido R$ 400k)** — abre relacionamento com baixa exposição, monitora 6 meses, expande se cumprir.",
          correct: false,
          score: 10,
          feedback:
            "Estratégia razoável em **clientes C ou D**, mas **desproporcional para B+**. Limitar a R$ 400k em cliente com geração de R$ 1 M/ano de caixa **sinaliza desconfiança** desnecessária e **abre espaço para concorrência** (a Sigma vai vender R$ 400k, e a concorrente Beta vai vender os outros R$ 400k que o cliente queria comprar). Perde-se 50% da margem (R$ 93k) sem ganho proporcional de segurança — perfil B+ tem 4% de inadimplência esperada em qualquer dos volumes.",
        },
        {
          id: "e3_c",
          label:
            "**Cenário C (aval + cessão + pricing +1%)** — captura ganho extra de R$ 28k/ano com risco baixo. Exigir garantias é prática prudente em todo cliente novo.",
          correct: false,
          score: 5,
          feedback:
            "Exigências **desproporcionais ao perfil**. Aval pessoal e cessão fiduciária são instrumentos para **clientes C/D** (perfil de risco real) ou para **operações grandes** (> R$ 2 M); aplicar em B+ de R$ 800k transmite desconfiança e **frequentemente leva o cliente a rejeitar e ir embora**. Em mercado competitivo, perder negócio por exigência inadequada custa **muito mais** que o ganho marginal de R$ 28k/ano. Risco comercial 4/5 anula o ganho.",
        },
        {
          id: "e3_d",
          label:
            "**Recusar a venda** — sem colateral, o risco é inaceitável em qualquer configuração.",
          correct: false,
          score: 0,
          feedback:
            "Política suicida em B2B. Recusar cliente B+ com geração de caixa comprovada e Serasa limpo **por falta de colateral** é abrir mão de R$ 186k/ano em ganho marginal e **enviar o cliente para a concorrência** (que aceitará nas mesmas condições). Colateral é **fortalecedor**, não **pré-requisito** — análise de crédito moderna prescinde de garantia em perfis acima de B.",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Aprovação plena com pricing padrão",
      shortLabel: "Aprovação plena",
      description:
        "Aprovar **R$ 800 mil/ano** com prazo de 45 dias, margem padrão 30%, **sem garantias adicionais**. Revisão automática em 6 meses com base em histórico de pagamento. Captura ganho cheio (R$ 186k/ano, ROIC marginal 186%), aceita risco residual de inadimplência típico de perfil B+.",
      resultPanel: {
        headline: "Ganho R$ 186 mil/ano, ROIC marginal 186%, sem fricção comercial — política dominante para B+",
        deltas: [
          { label: "Ganho líquido anual", value: "R$ 186 mil/ano", tone: "positive" },
          { label: "ROIC marginal", value: "186% a.a. (vs custo de capital 19,6%)", tone: "positive" },
          { label: "Risco residual", value: "Médio (3/5) — inadimplência típica B+", tone: "neutral" },
          { label: "Risco comercial (cliente recusar)", value: "Baixo — sem exigências", tone: "positive" },
          { label: "Capital empatado médio", value: "R$ 100 mil", tone: "neutral" },
          { label: "Revisão programada", value: "6 meses (gatilho por atraso)", tone: "positive" },
          { label: "Margem para evoluir (C)", value: "Aberta se histórico desviar", tone: "positive" },
        ],
        commentary:
          "**Política recomendada para clientes B+ em mercado competitivo.** Captura ganho cheio sem fricção comercial e mantém **opções abertas** — se o cliente pagar em dia por 6 meses, evolui para A (limites maiores, condições preferenciais); se atrasar, evolui para C (exige garantias na renovação). Risco residual de 4% de inadimplência é **embutido no preço** (margem 30% absorve com folga); ganho líquido de R$ 186k/ano é confortável. Boa prática complementar: **monitoramento mensal** do PMRV efetivo deste cliente nas primeiras 3-4 faturas — desvio > 15 dias dispara revisão antecipada.",
      },
      reflection: {
        prompt:
          "Se na 3ª fatura o cliente paga com **20 dias de atraso** (PMRV efetivo = 65 dias), qual resposta é proporcional?",
        choices: [
          {
            id: "ra_a",
            label:
              "**Contato comercial imediato** para entender o atraso (eventual ou estrutural?), **suspender novos pedidos até regularização** e disparar **revisão antecipada** com possível exigência de aval ou cessão fiduciária no próximo contrato.",
            correct: true,
            score: 25,
            feedback:
              "Correto e proporcional. **20 dias de atraso na 3ª fatura** é **sinal forte mas não definitivo** — pode ser problema transitório (atraso de cliente importante dele) ou estrutural (deterioração do caixa). Contato comercial **diagnóstica** sem queimar o relacionamento; suspensão de novos pedidos **protege a exposição** sem cancelar histórica; revisão antecipada **formaliza a resposta**. Sequência clássica: \"compreender, conter, revisar\". Nunca **cortar de uma vez** (queima relacionamento) nem **deixar passar** (acumula exposição em deterioração).",
          },
          {
            id: "ra_b",
            label:
              "**Suspender imediatamente** o cliente e enviar para protesto — atraso na 3ª fatura é sinal claro de calote iminente.",
            correct: false,
            score: 0,
            feedback:
              "Reação **desproporcional** que mata o relacionamento sem diagnóstico. 20 dias na 3ª fatura **frequentemente é transitório** (cliente teve atraso de pagamento próprio, mudou de gerente financeiro, problema técnico no boleto). Protesto na primeira ocorrência é antipadrão de gestão de carteira — queima cliente que poderia gerar R$ 186k/ano por anos.",
          },
          {
            id: "ra_c",
            label:
              "**Ignorar** — 20 dias está dentro da tolerância padrão para clientes novos.",
            correct: false,
            score: 0,
            feedback:
              "Tolerância sem **diagnóstico** é como abrir torneira sem ver onde a água vai. Atraso é informação — **usar ou perder**. Ignorar 20 dias na 3ª fatura **acumula** o atraso (próxima vem com 30, depois 40) e quando se percebe, exposição já é R$ 300-400k em cliente em deterioração.",
          },
          {
            id: "ra_d",
            label:
              "**Renegociar prazo para 60 dias** — se o cliente está atrasando, ele precisa de mais tempo.",
            correct: false,
            score: 5,
            feedback:
              "**Inversa lógica**: estender prazo para cliente em atraso **aumenta exposição** sem reduzir o problema. Se a causa é estrutural (caixa insuficiente), 60 dias só adia o calote em 15 dias. Decisão correta é **diagnóstico primeiro**, só depois eventualmente renegociar — e renegociação para B+ em deterioração tipicamente vem com **garantias adicionais**, não com prazo estendido.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — Limite reduzido (R$ 400k) com revisão em 6 meses",
      shortLabel: "Limite reduzido",
      description:
        "Aprovar apenas **R$ 400 mil** iniciais (50% do solicitado) com revisão e possível expansão em 6 meses. Captura **R$ 93k/ano** (50% do ganho cheio), reduz exposição inicial. Estratégia conservadora típica de **clientes C** — superdimensionada para B+, com risco comercial alto.",
      resultPanel: {
        headline: "Ganho R$ 93 mil/ano (metade do A): segurança extra com risco comercial alto",
        deltas: [
          { label: "Ganho líquido anual", value: "R$ 93 mil/ano", tone: "neutral" },
          { label: "Δ vs cenário A", value: "−R$ 93 mil/ano", tone: "negative" },
          { label: "ROIC marginal", value: "186% a.a. (proporcional)", tone: "positive" },
          { label: "Risco residual", value: "Baixo (2/5)", tone: "positive" },
          { label: "Risco comercial (cliente ir à concorrência)", value: "Alto — solicitou R$ 800k, recebe R$ 400k", tone: "negative" },
          { label: "Capital empatado médio", value: "R$ 50 mil", tone: "positive" },
          { label: "Caminho de expansão", value: "Programado em 6 meses", tone: "positive" },
        ],
        commentary:
          "**Estratégia apropriada para clientes C** (risco real elevado) **ou para B+ em setor em deterioração**. Em cliente B+ saudável, limitar a 50% sinaliza desconfiança e **frequentemente leva a perda parcial do negócio** — cliente pode aceitar os R$ 400k mas comprar os outros R$ 400k da concorrência, e ao revisar em 6 meses já terá relacionamento principal com outro fornecedor. Trade-off típico: **R$ 93k/ano garantido vs R$ 186k/ano com risco residual moderado**. Para B+ com Caráter forte, A é dominante; B faz sentido em B+ com Caráter dúbio ou em mercado saturado de oferta.",
      },
      reflection: {
        prompt:
          "Cenário B custa R$ 93 mil/ano de ganho marginal em relação a A. Em que contexto esse \"prêmio de prudência\" se justifica?",
        choices: [
          {
            id: "rb_a",
            label:
              "Quando o **setor do cliente está em deterioração macro** (concordatas recentes em varejistas similares, queda agregada de demanda) — perfil B+ pontual pode escorregar para C/D rapidamente. Limitar exposição inicial protege contra revisão de perfil em 6-12 meses.",
            correct: true,
            score: 25,
            feedback:
              "Correto e relevante. **Perfil individual não é independente do setor** — em macro adverso, B+ de hoje pode ser C de amanhã. Limitar exposição inicial em R$ 400k é **opção real**: se setor se deteriorar, a Sigma sai do cliente com perda menor (R$ 16k de inadimplência esperada em B vs R$ 32k em A). Em setor estável, R$ 93k/ano é prêmio excessivo; em setor em risco, é seguro razoável.",
          },
          {
            id: "rb_b",
            label:
              "Quando a Sigma tem **restrição de funding** (NCG no limite, caixa apertado) — limitar exposição reduz necessidade de capital de giro.",
            correct: false,
            score: 10,
            feedback:
              "Argumento válido (R$ 50k de capital empatado vs R$ 100k), mas **fraco** para uma empresa do porte da Sigma — diferença de R$ 50k é marginal. Restrição de funding genuína afeta **todas as aprovações**, não apenas este cliente; resposta correta é **ajustar política geral**, não tratar cliente específico de forma diferente.",
          },
          {
            id: "rb_c",
            label:
              "Sempre — segurança extra é virtude em comitê de crédito.",
            correct: false,
            score: 0,
            feedback:
              "Conservadorismo sem fundamento **destrói valor**. Cada R$ 93k/ano renunciado em A vs B é **margem real** que vai para concorrência. Em mercado competitivo, comitês excessivamente prudentes perdem participação de mercado para concorrentes que assumem risco compatível com o perfil.",
          },
          {
            id: "rb_d",
            label:
              "Quando o cliente **demonstra resistência à exigência de garantias** — limite reduzido é alternativa que não exige garantia.",
            correct: false,
            score: 5,
            feedback:
              "Lógica circular — em B+ a Sigma **não devia exigir** garantia inicialmente (resposta da etapa 3). Se a Sigma optou por exigir garantia e o cliente recusou, a falha está na exigência inicial, não na resposta a ela. Decisão de limite deve refletir **risco percebido**, não compensar exigências mal calibradas.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — Plena + aval + cessão fiduciária + pricing premium",
      shortLabel: "Garantido + premium",
      description:
        "Aprovar **R$ 800 mil** com **aval pessoal do sócio** + **cessão fiduciária de recebíveis** + pricing com margem **+1 ponto percentual** (31% em vez de 30%). Captura ganho extra (**R$ 214k/ano**) e reduz inadimplência efetiva para 1,5%. Apropriado para perfis C/D ou para operações de risco elevado — sobredimensionado para B+ típico.",
      resultPanel: {
        headline: "Ganho R$ 214 mil/ano (+R$ 28k vs A) — máximo controle de risco, alta chance de o cliente recusar",
        deltas: [
          { label: "Ganho líquido anual", value: "R$ 214 mil/ano", tone: "positive" },
          { label: "Δ vs cenário A", value: "+R$ 28 mil/ano", tone: "positive" },
          { label: "ROIC marginal", value: "214% a.a.", tone: "positive" },
          { label: "Risco residual", value: "Muito baixo (1/5)", tone: "positive" },
          { label: "Risco comercial (cliente recusar exigências)", value: "Alto (4/5) — perfil B+ resiste a aval pessoal", tone: "negative" },
          { label: "Inadimplência efetiva", value: "1,5% (aval+cessão reduzem)", tone: "positive" },
          { label: "Sinalização ao mercado", value: "Sigma exige garantia até para B+ — pode espantar B+ futuros", tone: "negative" },
        ],
        commentary:
          "**Configuração apropriada para clientes C/D** (perfil de risco real) **ou para operações de alto volume** (> R$ 2-3 M onde a exposição justifica) — **sobredimensionada para B+ típico**. Exigir aval pessoal de sócio de varejista B+ frequentemente **leva à recusa**: o sócio não quer dar bem pessoal por R$ 800k de compra anual, e migra para concorrente que aceita risco padrão. Ganho extra de R$ 28k/ano é **pequeno** em relação à probabilidade de perder o negócio inteiro (R$ 186k). Sinalização ao mercado também é negativa — \"Sigma exige garantia até de B+\" reduz qualidade da pipeline futura.",
      },
      reflection: {
        prompt:
          "Mesmo sendo sobredimensionado para B+, há contexto em que C **se justifica plenamente**?",
        choices: [
          {
            id: "rc_a",
            label:
              "Quando o **pedido é muito grande** (> R$ 2-3 milhões/ano) — a exposição absoluta justifica garantia mesmo em B+, e o cliente entende a lógica. Acima desse patamar, política de garantia é padrão de mercado, não desconfiança.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **Volume absoluto** é dimensão de risco independente do perfil — uma inadimplência de R$ 2 M em B+ é mais material que R$ 80k em D (mesmo com probabilidade maior em D). Acima de **R$ 2-3 M/ano**, exigência de aval + cessão **é padrão de mercado** e o cliente B+ aceita sem fricção (sabe que é prática setorial). Abaixo desse patamar, exigência sinaliza desconfiança injustificada. Política calibrada: **B+ até R$ 1,5 M sem garantia; acima, garantia padrão**.",
          },
          {
            id: "rc_b",
            label:
              "Quando o sócio do cliente tem **patrimônio pessoal expressivo** — aval pessoal não custa nada para ele, e a Sigma ganha proteção sem fricção.",
            correct: false,
            score: 5,
            feedback:
              "**Inversão**: sócios com patrimônio pessoal **resistem mais** a dar aval, justamente porque sabem o que estão arriscando. Pequenos empresários sem patrimônio assinam aval porque não têm o que perder (aval vira inexequível em prática). \"Sem fricção\" é raro — aval é fricção real para qualquer sócio que pense estrategicamente.",
          },
          {
            id: "rc_c",
            label:
              "Sempre — controle de risco é virtude operacional.",
            correct: false,
            score: 0,
            feedback:
              "Visão técnica que **ignora dimensão comercial**. Política de crédito é **trade-off custo × volume**: mais controle = menos volume. \"Sempre máximo controle\" é maximizar custo sem maximizar lucro. Política ótima calibra ao perfil e ao volume.",
          },
          {
            id: "rc_d",
            label:
              "Quando o cliente **operou com a concorrência sem garantias** — aprovar com garantia mostra que a Sigma é mais rigorosa.",
            correct: false,
            score: 0,
            feedback:
              "**Antipadrão competitivo**: se a concorrência opera sem garantia, exigir garantia **expulsa o cliente**, não impressiona. Mercado funciona por **paridade competitiva** — se a Sigma quer ser mais rigorosa, precisa compensar com **outra vantagem** (preço, atendimento, prazo de entrega), não apenas exigir mais sem oferecer mais.",
          },
        ],
      },
    },
  ],
};
