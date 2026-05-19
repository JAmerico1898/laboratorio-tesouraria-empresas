import type { Scenario } from "@/types/scenario";

// =============================================================================
// S2.1 — Indústria Épsilon — Orçamento de caixa mensal (12 meses)
// =============================================================================
// Premissas (R$ milhões, 3 casas decimais nos cálculos, 2 na exibição):
//
// Receita anual = 60,0 M. Sazonalidade (% × 60):
//   Jan 5% =3,0 | Fev 5% =3,0 | Mar 6% =3,6 | Abr 7% =4,2 | Mai 8% =4,8 | Jun 9% =5,4
//   Jul 8% =4,8 | Ago 10%=6,0 | Set 11%=6,6 | Out 13%=7,8 | Nov 11%=6,6 | Dez 7% =4,2
//   1º sem = 24,0 (40%); 2º sem = 36,0 (60%). ✓
//
// Modelo de entradas (simplificação anunciada ao aluno):
//   50% das vendas do mês M entram em caixa em M, 50% em M+1.
//   Aplica-se inadimplência de 2% (recebe 98% do bruto).
//   Recebimentos(M) = 0,49 × [Vendas(M) + Vendas(M-1)]
//   Premissa de borda: Vendas(Dez-1) = 4,2 (steady state).
//   Total recebido no ano = 58,80 = 0,98 × 60 ✓
//
// Compras = 55% da receita do mês. PMPF 40d ≈ 33% no mês, 67% em M+1.
//   Pagamentos(M) = 0,33 × Compras(M) + 0,67 × Compras(M-1)
//   Compras(Dez-1) = 2,31.
//
// Folha = 1,5/mês. 13º +1,5 em Jun e Nov. Tributos = 1,2/mês.
// CAPEX 4,0 em Mar. Saldo inicial Jan = 2,5. Saldo mínimo = 1,5.
//
// Entradas por mês:
//   Jan 3,528 | Fev 2,940 | Mar 3,234 | Abr 3,822 | Mai 4,410 | Jun 4,998
//   Jul 4,998 | Ago 5,292 | Set 6,174 | Out 7,056 | Nov 7,056 | Dez 5,292
//
// Saídas por mês (compras + folha + 13º + tributos + CAPEX):
//   Jan 4,792 | Fev 4,350 | Mar 8,459 | Abr 4,789 | Mai 5,119 | Jun 6,949
//   Jul 5,561 | Ago 5,558 | Set 6,109 | Out 6,548 | Nov 8,272 | Dez 5,894
//
// Saldo do mês:
//   Jan -1,264 | Fev -1,410 | Mar -5,225 | Abr -0,967 | Mai -0,709 | Jun -1,951
//   Jul -0,563 | Ago -0,266 | Set +0,065 | Out +0,508 | Nov -1,216 | Dez -0,602
//
// Saldo acumulado (parte de 2,5):
//   Jan +1,236 | Fev -0,174 | Mar -5,399 | Abr -6,366 | Mai -7,075 | Jun -9,026
//   Jul -9,589 | Ago -9,855 | Set -9,790 | Out -9,282 | Nov -10,498 | Dez -11,100
//
// Necessidade de financiamento = max(0; 1,5 − Saldo acumulado):
//   Jan 0,264 | Fev 1,674 | Mar 6,899 | Abr 7,866 | Mai 8,575 | Jun 10,526
//   Jul 11,089 | Ago 11,355 | Set 11,290 | Out 10,782 | Nov 11,998 | Dez 12,600
//
// Necessidade-pico ≈ R$ 12,6 M (Dez); saldo abaixo do mínimo durante 11 meses
// consecutivos (Fev→Dez). Gap se abre com o CAPEX de Mar e é agravado pela
// concentração de saídas em Jun/Nov (13º) e Out/Nov (compras do pico).
//
// Branches — referência de custo (sobre necessidade média ~R$ 10 M no horizonte):
//   A) Conta garantida CDI+7% a.a. + IOF (CDI 11%): efetivo ~ 19% a.a.
//      Sobre saldo médio devedor ~R$ 9 M × 9 meses → custo ~R$ 1.280 mil
//   B) Capital de giro 12m CDI+4% a.a. (CDI 11%): efetivo ~ 15,3% a.a.
//      Sobre R$ 12 M tomado upfront × duration ~6m → custo ~R$ 920 mil
//   C) Antecipação de cartão 1,8% a.m. (composto): (1,018^12)-1 = 23,9% a.a.
//      Aplicável só sobre carteira disponível (estima-se R$ 5 M/mês de cartão);
//      cobre parcialmente a necessidade. Custo ~R$ 1.450 mil no ano.
// =============================================================================

export const S2_1: Scenario = {
  id: "s2_1",
  code: "S2.1",
  title: "Indústria Épsilon — orçamento de caixa mensal",
  company: "Indústria Épsilon S.A.",
  difficulty: "Intermediário",
  estimatedMinutes: 22,
  context: {
    narrative:
      "Você é tesoureiro(a) da **Indústria Épsilon**, fabricante com **receita projetada de R$ 60 milhões** no ano e **sazonalidade pesada**: 40% no 1º semestre e 60% no 2º. O CFO pede um **orçamento de caixa mensal de 12 meses** para dimensionar a necessidade de funding antes do pico. As premissas operacionais já estão fechadas: **PMRV efetivo de ~45 dias** (50% recebido no mês, 50% no seguinte, com **2% de inadimplência**), **compras = 55% da receita** com PMPF 40 dias (33%/67%), folha mensal de R$ 1,5 M com **13º em junho e novembro**, tributos mensais de R$ 1,2 M, **CAPEX único de R$ 4,0 M em março** e **saldo inicial de R$ 2,5 M**. A política exige saldo mínimo de **R$ 1,5 M** ao final de cada mês.",
    keyFacts: [
      ["Receita anual", "R$ 60,0 M"],
      ["Sazonalidade 1H/2H", "40% / 60%"],
      ["PMRV (modelo)", "50% mês + 50% M+1"],
      ["Inadimplência", "2% (recebe 98%)"],
      ["Compras / receita", "55%"],
      ["PMPF", "40d (33% / 67%)"],
      ["Folha mensal + 13º", "R$ 1,5 M + Jun/Nov"],
      ["CAPEX", "R$ 4,0 M em Março"],
      ["Saldo inicial / mínimo", "R$ 2,5 M / R$ 1,5 M"],
    ],
  },
  statements: [
    {
      id: "orcamento_caixa_epsilon",
      title: "Orçamento de caixa mensal — Indústria Épsilon",
      unit: "R$ milhões",
      periods: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      sections: [
        {
          label: "Vendas brutas (premissa de sazonalidade)",
          rows: [
            {
              label: "Vendas do mês",
              values: [3.0, 3.0, 3.6, 4.2, 4.8, 5.4, 4.8, 6.0, 6.6, 7.8, 6.6, 4.2],
              indent: 1,
            },
            {
              label: "% da receita anual",
              values: [0.05, 0.05, 0.06, 0.07, 0.08, 0.09, 0.08, 0.10, 0.11, 0.13, 0.11, 0.07],
              indent: 1,
            },
          ],
        },
        {
          label: "ENTRADAS DE CAIXA",
          rows: [
            {
              label: "Recebimento de vendas (98% × [50% M + 50% M-1])",
              values: [3.53, 2.94, 3.23, 3.82, 4.41, 5.00, 5.00, 5.29, 6.17, 7.06, 7.06, 5.29],
              indent: 1,
            },
            {
              label: "Total de entradas",
              values: [3.53, 2.94, 3.23, 3.82, 4.41, 5.00, 5.00, 5.29, 6.17, 7.06, 7.06, 5.29],
              emphasis: "subtotal",
              indent: 0,
            },
          ],
        },
        {
          label: "SAÍDAS DE CAIXA",
          rows: [
            {
              label: "Pagamento a fornecedores (33% mês + 67% M-1)",
              values: [2.09, 1.65, 1.76, 2.09, 2.42, 2.75, 2.86, 2.86, 3.41, 3.85, 4.07, 3.19],
              indent: 1,
            },
            {
              label: "Folha mensal",
              values: [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5],
              indent: 1,
            },
            {
              label: "13º salário (parcelas Jun e Nov)",
              values: [0, 0, 0, 0, 0, 1.5, 0, 0, 0, 0, 1.5, 0],
              indent: 1,
            },
            {
              label: "Tributos mensais",
              values: [1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2],
              indent: 1,
            },
            {
              label: "CAPEX (aquisição de equipamento)",
              values: [0, 0, 4.0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              indent: 1,
            },
            {
              label: "Total de saídas",
              values: [4.79, 4.35, 8.46, 4.79, 5.12, 6.95, 5.56, 5.56, 6.11, 6.55, 8.27, 5.89],
              emphasis: "subtotal",
              indent: 0,
            },
          ],
        },
        {
          label: "RESULTADO E POSIÇÃO DE CAIXA",
          rows: [
            {
              label: "Saldo do mês (Entradas − Saídas)",
              values: [-1.26, -1.41, -5.23, -0.97, -0.71, -1.95, -0.56, -0.27, 0.07, 0.51, -1.22, -0.6],
              emphasis: "bold",
              indent: 0,
            },
            {
              label: "Saldo acumulado (inicial 2,5 + Σ saldo do mês)",
              values: [1.24, -0.17, -5.4, -6.37, -7.08, -9.03, -9.59, -9.86, -9.79, -9.28, -10.5, -11.1],
              emphasis: "bold",
              indent: 0,
            },
            {
              label: "Saldo mínimo desejado",
              values: [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5],
              indent: 1,
            },
            {
              label: "Necessidade de financiamento (mínimo − acumulado, se > 0)",
              values: [0.26, 1.67, 6.9, 7.87, 8.58, 10.53, 11.09, 11.36, 11.29, 10.78, 12.0, 12.6],
              emphasis: "total",
              indent: 0,
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
        "**Etapa 1 — Projetar entradas.** Em **outubro**, a venda bruta projetada é de **R$ 7,8 M** (pico anual). Aplicando o modelo simplificado (**50% mês + 50% M+1**, líquido de inadimplência de **2%**) e considerando que a venda de setembro foi de **R$ 6,6 M**, qual é o **recebimento em caixa de outubro**?",
      choices: [
        {
          id: "e1_a",
          label: "R$ 7,06 M — fórmula 0,49 × (7,8 + 6,6) = 0,49 × 14,4",
          correct: true,
          score: 20,
          feedback:
            "Correto. **Recebimento(Out) = 0,98 × [0,5 × V(Out) + 0,5 × V(Set)] = 0,49 × (7,8 + 6,6) = R$ 7,06 M**. Esse é o padrão usado em todo o orçamento: cada mês recebe **metade líquida da venda corrente e metade líquida da venda anterior**. Conceito reforçado: **receita não é caixa** — o orçamento converte a DRE em fluxo via *ageing* simplificado, e a inadimplência entra como redução **proporcional** ao bruto, não no fim do horizonte.",
        },
        {
          id: "e1_b",
          label: "R$ 7,64 M — 0,98 × 7,8 (toda a venda de outubro entra como caixa)",
          correct: false,
          score: 0,
          feedback:
            "Erro clássico: confundir **DRE** com **orçamento de caixa**. Receita reconhecida ≠ caixa recebido. Com PMRV de ~45 dias, **metade da venda de outubro só entra em novembro** (e em condições reais, parte ainda em dezembro). Fórmula correta: **0,49 × (V(M) + V(M-1)) = R$ 7,06 M**, não 7,64.",
        },
        {
          id: "e1_c",
          label: "R$ 7,20 M — 0,5 × (7,8 + 6,6) = 7,20 (esquece a inadimplência)",
          correct: false,
          score: 5,
          feedback:
            "Quase. Você acertou o *ageing* (50%/50%) mas **esqueceu a inadimplência de 2%**. Tratar a perda como evento residual no fim do ano **infla as entradas mensais** e mascara a necessidade de funding. O correto é aplicar 0,98 dentro do mês: **0,49 × (7,8 + 6,6) = R$ 7,06 M**. A diferença de R$ 0,14 M por mês acumula R$ 1,7 M no ano — exatamente a margem entre rolar conta garantida ou não.",
        },
        {
          id: "e1_d",
          label: "R$ 3,82 M — apenas 50% da venda do próprio mês de outubro, líquido de 2%",
          correct: false,
          score: 0,
          feedback:
            "Esqueceu a **parcela diferida da venda anterior**. Em um modelo de PMRV de 45 dias, o caixa do mês M sempre recebe **duas safras**: metade da venda corrente + metade da venda anterior. Fórmula: **0,49 × (V(M) + V(M-1)) = 0,49 × 14,4 = R$ 7,06 M**.",
        },
      ],
    },
    {
      id: "etapa_2",
      prompt:
        "**Etapa 2 — Projetar saídas operacionais.** Como tratar o **13º salário** (folha de R$ 1,5 M de referência) e a **inadimplência**, e como isso conversa com a forma como **DRE** registra esses eventos?",
      choices: [
        {
          id: "e2_a",
          label:
            "Caixa: **R$ 1,5 M extras em Jun e em Nov** (parcelas legais). DRE: **provisão linear** de 1/12 ao longo do ano. Inadimplência: aplica-se proporcional ao recebimento (98%) — não é provisão contábil.",
          correct: true,
          score: 20,
          feedback:
            "Correto. O **orçamento de caixa segue o calendário legal** (1ª parcela do 13º até 30/nov, 2ª até 20/dez — convencionalmente concentramos em Jun e Nov por simplicidade). Já a DRE provisiona linearmente o encargo para refletir competência. Conceito reforçado: o tesoureiro precisa de **ambas as visões** — competência (DRE) para preço/margem, regime de caixa (orçamento) para liquidez. Inadimplência, no orçamento, é **redutor direto de entrada** (0,98 do bruto); na DRE entra como **PDD** (perda esperada).",
        },
        {
          id: "e2_b",
          label:
            "Caixa: **provisão mensal de R$ 0,125 M** (1/12 do 13º) para suavizar. Inadimplência: lançada no fim do ano.",
          correct: false,
          score: 0,
          feedback:
            "Inversão clássica: você aplicou a **lógica de competência (DRE) ao caixa**. Provisão **não sai do caixa** — quem sai é o **pagamento legal em Jun e Nov**. Suavizar artificialmente o 13º no orçamento **esconde os dois picos de saída** que justamente exigem captação. Lançar inadimplência só no fim do ano também distorce o saldo intermediário.",
        },
        {
          id: "e2_c",
          label:
            "Caixa: 13º apenas em **novembro** (R$ 3,0 M concentrado). Inadimplência: aplicada como 2% sobre receita anual no mês de dezembro.",
          correct: false,
          score: 5,
          feedback:
            "O 13º tem **duas parcelas legais** — a 1ª até 30/nov e a 2ª até 20/dez; por convenção do enunciado, modelamos como R$ 1,5 M em **Jun e Nov** (representando antecipação de férias + 13º). Concentrar tudo em novembro **subdimensiona o gap de junho**, que é o primeiro choque relevante após o CAPEX de março. Inadimplência diluída em 12 meses ≠ deduzida só em dezembro.",
        },
        {
          id: "e2_d",
          label:
            "Caixa e DRE são equivalentes para folha — usar a mesma série em ambos: R$ 1,5 M × 12 + R$ 0,125 M × 12 de provisão.",
          correct: false,
          score: 0,
          feedback:
            "DRE e orçamento de caixa **divergem deliberadamente**. DRE segue competência; caixa segue desembolso. Misturar os dois (dobrar o 13º via provisão + parcela real) **infla as saídas em R$ 1,5 M** e gera necessidade de funding fantasma. Regra mnemônica: **DRE para o resultado; orçamento para o caixa; nunca os dois ao mesmo tempo na mesma linha**.",
        },
      ],
    },
    {
      id: "etapa_3",
      prompt:
        "**Etapa 3 — Dimensionar o gap.** Observando o orçamento construído, qual é o diagnóstico **mais preciso** da necessidade de financiamento da Épsilon ao longo do ano?",
      choices: [
        {
          id: "e3_a",
          label:
            "Gap **estrutural, não pontual**: saldo acumulado fica abaixo do mínimo de **fev a dez (11 meses)**, com pico de **R$ 12,6 M em dez**. O CAPEX de março abre o buraco; 13º (jun e nov) e compras do pico (out/nov) aprofundam.",
          correct: true,
          score: 20,
          feedback:
            "Diagnóstico correto. **Pico de necessidade = R$ 12,6 M em Dez**; faixa de gap = R$ 6,9 M (Mar) → R$ 12,6 M (Dez), com **três degraus**: (1) **+R$ 5,2 M em Mar** (CAPEX), (2) **+R$ 2 M em Jun** (1ª parcela do 13º) e (3) **+R$ 1,2 M em Nov** (2ª parcela + compras do pico). Conceito reforçado: gap > 90 dias com **trajetória ascendente** é **estrutural** — o instrumento de funding deve ser dimensionado pela **necessidade-pico + colchão**, não pela média.",
        },
        {
          id: "e3_b",
          label:
            "Gap **pontual de R$ 5,2 M no mês de março** (CAPEX); a partir de abril, o caixa volta ao normal.",
          correct: false,
          score: 5,
          feedback:
            "Erro de leitura: você confundiu **saldo do mês** com **saldo acumulado**. Em março o saldo do mês é −5,2 M, mas o **acumulado segue piorando** mês a mês porque as entradas líquidas não cobrem as saídas. Em dezembro o acumulado é **−R$ 11,1 M**. Olhar só o pior mês isolado é o erro mais comum — leva a contratar conta garantida de 30 dias para um problema de 11 meses.",
        },
        {
          id: "e3_c",
          label:
            "Não há gap relevante — a receita anual de R$ 60 M cobre as saídas anuais de R$ 72,4 M se considerarmos o autofinanciamento via lucro retido.",
          correct: false,
          score: 0,
          feedback:
            "Erro grave: **receita ≠ caixa** e **lucro retido ≠ liquidez disponível**. Você não pode usar autofinanciamento que **ainda não ocorreu** para cobrir saídas que **já estão acontecendo**. Além disso, R$ 60 M de receita anual **não cobre** R$ 72,4 M de saídas — exige captação externa real. O autofinanciamento é fluxo futuro, não saldo.",
        },
        {
          id: "e3_d",
          label:
            "Pico de gap em **julho-agosto** (~R$ 4 M), antes do pico de vendas, com recuperação completa em outubro.",
          correct: false,
          score: 5,
          feedback:
            "Esse seria o padrão ideal para uma operação **sem CAPEX em março**. Mas o CAPEX de R$ 4 M antecipa o stress para o 1º trimestre e o gap **não fecha** — em outubro o acumulado ainda está em **−R$ 9,3 M**. O equívoco é raciocinar pela **lógica da sazonalidade pura** sem incorporar o investimento e o 13º. O acumulado depende de **todos os meses anteriores**, não só da sazonalidade comercial.",
        },
      ],
    },
  ],
  branches: [
    {
      id: "branch_a",
      letter: "A",
      label: "Cenário A — Cobrir todo o gap com conta garantida",
      shortLabel: "Conta garantida",
      description:
        "Acionar a **conta garantida pré-aprovada** de R$ 15 M (limite folgado vs pico de R$ 12,6 M). Custo: **CDI + 7% a.a. + IOF** (0,38% adicional + 0,0041% a.d., teto 365 dias). Sem amortização programada — paga-se proporcional ao uso e ao tempo.",
      resultPanel: {
        headline: "Cobertura imediata, mas custo efetivo > 19% a.a. corrói margem o ano inteiro",
        deltas: [
          { label: "Taxa efetiva anualizada", value: "≈ 19,3% a.a. (CDI 11% + spread 7% + IOF)", tone: "negative" },
          { label: "Saldo médio devedor", value: "≈ R$ 9,0 M (média mar-dez)", tone: "neutral" },
          { label: "Custo financeiro estimado (ano)", value: "≈ R$ 1.280 mil", tone: "negative" },
          { label: "Prazo de exposição", value: "11 meses (fev → dez)", tone: "negative" },
          { label: "Flexibilidade", value: "Alta — usa e paga conforme necessidade", tone: "positive" },
          { label: "Garantias exigidas", value: "Recebíveis em caução (alienação fiduciária)", tone: "neutral" },
        ],
        commentary:
          "**Solução tática usada como estrutural — antieconômica.** Cálculo do custo: CDI ~11% a.a. + spread 7% = **18% nominal**; adicionando IOF de 0,38% + 0,0041%/dia (≈ 1,5% no ano, com teto), o **CET ≈ 19,3% a.a.**. Sobre saldo médio devedor de R$ 9,0 M por ~9 meses úteis: **custo ≈ R$ 1.280 mil**. Vantagem real: zero amortização programada — quando entra recebível em set/out, o saldo cai e o juro cai junto. Risco central: **conta garantida foi desenhada para descasamentos < 90 dias**; usá-la 11 meses paga **prêmio de flexibilidade sem precisar dele**.",
      },
      reflection: {
        prompt:
          "Por que a conta garantida pode sair **mais cara** do que outras opções mesmo quando a **taxa nominal** está próxima das alternativas?",
        choices: [
          {
            id: "ra_a",
            label:
              "Porque cobra **IOF adicional, tarifa e spread maior**, e o custo incide sobre o saldo devedor **diário** — quando usada por meses, o CET supera fácil 18-20% a.a., enquanto capital de giro contratado em LP custa 14-16%.",
            correct: true,
            score: 25,
            feedback:
              "Correto. A conta garantida tem **três camadas de custo** que não aparecem na taxa nominal: (1) **IOF adicional de 0,38% + 0,0041%/dia até o teto de 365d**, (2) **spread elevado** (banco precifica liquidez instantânea), (3) **tarifa de manutenção de limite**. O instrumento foi desenhado para **descasamentos < 90 dias**; usá-lo por 11 meses paga o prêmio de uma opção que você não está exercendo. Boa prática: **monitore o CET acumulado** — quando passar de 4-5 meses, migre para CG.",
          },
          {
            id: "ra_b",
            label: "Porque a conta garantida exige amortização mensal obrigatória, igual a um empréstimo.",
            correct: false,
            score: 0,
            feedback:
              "Inverso: a conta garantida **não tem amortização programada** — é rotativa. Essa é justamente sua **vantagem operacional**. O problema é o **custo**, não o cronograma.",
          },
          {
            id: "ra_c",
            label:
              "Porque o CDI cobrado na conta garantida é diferente do CDI cobrado em outras linhas (existe um CDI específico para crédito rotativo).",
            correct: false,
            score: 0,
            feedback:
              "Não. **CDI é único** — a referência é a mesma. O que muda é o **spread sobre o CDI** e a estrutura tributária (IOF). Confundir CDI com spread é erro comum: o CDI é o **piso de mercado**; o spread é o que o banco cobra sobre ele.",
          },
          {
            id: "ra_d",
            label:
              "Não fica mais cara — o cálculo simples é taxa × saldo × tempo. Se a taxa nominal é parecida, o custo final é parecido.",
            correct: false,
            score: 5,
            feedback:
              "Engano de cálculo: você ignora a **capitalização composta** e os **custos adicionais (IOF, tarifa)**. Taxa nominal de 18% a.a. com capitalização diária composta → **efetiva ≈ 19,7% a.a.**; somando IOF, supera 21%. O cálculo linear (taxa × prazo) **subestima sistematicamente** o custo de instrumentos com IOF.",
          },
        ],
      },
    },
    {
      id: "branch_b",
      letter: "B",
      label: "Cenário B — Capital de giro 12 meses com amortizações casadas ao 2º semestre",
      shortLabel: "Capital de giro 12m",
      description:
        "Captar **R$ 12,0 M em capital de giro de 12 meses** a **CDI + 4% a.a.**, com cronograma de amortização **casado à entrada de caixa do 2º semestre** (parcelas maiores em out/nov/dez e ago/set). Garantia: alienação fiduciária + aval dos sócios.",
      resultPanel: {
        headline: "Custo 15% a.a. e cronograma sincronizado: ~30% mais barato que conta garantida",
        deltas: [
          { label: "Taxa efetiva anualizada", value: "≈ 15,3% a.a. (CDI 11% + spread 4% + IOF)", tone: "positive" },
          { label: "Volume captado", value: "R$ 12,0 M (cobre o pico de R$ 12,6 M com folga via caixa)", tone: "positive" },
          { label: "Custo financeiro estimado (ano)", value: "≈ R$ 920 mil", tone: "positive" },
          { label: "Prazo / duration", value: "12 meses / duration ≈ 6 meses", tone: "neutral" },
          { label: "Flexibilidade", value: "Baixa — amortização contratada", tone: "negative" },
          { label: "Covenants", value: "DL/EBITDA, liquidez corrente ≥ 1,2", tone: "neutral" },
        ],
        commentary:
          "**Solução estrutural alinhada ao perfil do gap.** Cálculo: CDI 11% + spread 4% = **15% nominal** ≈ 15,3% efetivo com IOF do principal. Sobre R$ 12 M tomado com duration ~6 meses (amortizações concentradas no 2º sem): **custo ≈ R$ 920 mil**. Economia vs conta garantida: **~R$ 360 mil**. Trade-off: **menos flexibilidade** — se o cenário melhora (ex: recebimento extraordinário), você fica com sobra de caixa pagando custo de carregamento. Mitigação: contratar **opção de pré-pagamento sem multa** (negocie isso no booking). Risco: **covenant breach** se EBITDA cair > 20% — exige acompanhamento trimestral.",
      },
      reflection: {
        prompt:
          "O capital de giro 12m sai ~R$ 360 mil mais barato que a conta garantida. Em que **situação real** essa economia pode **desaparecer ou inverter**?",
        choices: [
          {
            id: "rb_a",
            label:
              "Se o cenário melhorar (recebimento extraordinário ou queda de juros) e o pré-pagamento tiver **multa**, a empresa fica pagando custo de carregamento sobre caixa que poderia ter quitado a dívida.",
            correct: true,
            score: 25,
            feedback:
              "Correto. Capital de giro é **dívida contratada com cronograma**: se você captou R$ 12 M e o gap real ficou em R$ 8 M, sobram R$ 4 M aplicados a CDI enquanto a dívida paga CDI + 4%. **Spread negativo de 4% × R$ 4 M × ~6 meses ≈ R$ 80 mil de prejuízo**. Boa prática: contratar **opção de pré-pagamento sem multa** ou **estrutura de saque parcial** — alinha a dívida ao consumo efetivo.",
          },
          {
            id: "rb_b",
            label: "Se o CDI subir, o CG fica mais caro do que a conta garantida (porque o spread do CG é fixo).",
            correct: false,
            score: 0,
            feedback:
              "Ambos são pós-fixados no CDI — se o CDI sobe, **ambos sobem na mesma proporção**. O spread fixo do CG (4%) é **menor** que o da conta garantida (7%) em qualquer cenário de CDI. A inversão não vem do CDI.",
          },
          {
            id: "rb_c",
            label: "Se a empresa pagar o 13º em parcela única (não em duas), o cronograma do CG quebra.",
            correct: false,
            score: 0,
            feedback:
              "O cronograma do CG é fixo no contrato — independe do calendário de folha da empresa. A relação é o oposto: o cronograma do CG é desenhado **para servir** ao calendário de caixa, não o contrário.",
          },
          {
            id: "rb_d",
            label: "A economia nunca desaparece — CG sempre será mais barato porque o spread é menor.",
            correct: false,
            score: 5,
            feedback:
              "Visão simplista. O spread nominal é menor (4% vs 7%), mas o **custo total depende de**: (1) volume captado vs necessidade real, (2) capacidade de pré-pagamento, (3) covenants. Se você superestimar a necessidade ou se o gap for menor que o projetado, **a parcela de carregamento corrói a economia**. Em casos extremos, CG pode sair mais caro que conta garantida.",
          },
        ],
      },
    },
    {
      id: "branch_c",
      letter: "C",
      label: "Cenário C — Antecipação de recebíveis de cartão de crédito",
      shortLabel: "Antecipação de cartão",
      description:
        "Antecipar a **carteira de recebíveis de cartão** (~R$ 5 M/mês em D+30) com **deságio de 1,8% a.m.** (composto). Não exige garantia adicional, é executável em D+0 via banco adquirente ou FIDC. **Limita-se ao volume da carteira disponível** — pode cobrir parte, não todo o gap.",
      resultPanel: {
        headline: "Acesso instantâneo sem garantia, mas deságio anualizado de 23,9% a.a. é caro",
        deltas: [
          { label: "Taxa efetiva anualizada", value: "(1,018)^12 − 1 ≈ 23,9% a.a.", tone: "negative" },
          { label: "Cobertura máxima", value: "≈ R$ 5 M/mês × 12 = limitado à carteira", tone: "neutral" },
          { label: "Custo financeiro estimado (ano)", value: "≈ R$ 1.450 mil", tone: "negative" },
          { label: "Prazo médio antecipado", value: "30 dias (D+30 → D+0)", tone: "neutral" },
          { label: "Flexibilidade", value: "Alta — aciona quando quer", tone: "positive" },
          { label: "Garantias / covenants", value: "Nenhuma adicional", tone: "positive" },
        ],
        commentary:
          "**Solução flexível, mas a mais cara em CET.** Cálculo do anualizado: 1,8% a.m. composto = **(1,018)^12 − 1 = 23,9% a.a.** (o cálculo linear 1,8% × 12 = 21,6% **subestima** por ignorar capitalização). Se antecipar R$ 5 M/mês durante 12 meses por 30 dias cada: **custo ≈ R$ 5 M × 1,8% × 12 = R$ 1.080 mil**; somando carryover e IOF: **~R$ 1.450 mil**. Limitação operacional: **só funciona se houver carteira de cartão** — para Épsilon (B2B industrial), o mix de cartão é tipicamente < 20%, então cobre **parcialmente** o gap. Uso correto: **combinar com CG** (CG cobre o estrutural, antecipação tampa o pontual de Mar/Jun).",
      },
      reflection: {
        prompt:
          "A antecipação de cartão tem deságio nominal de 1,8% a.m. — qual é a forma **correta** de comparar com uma linha de capital de giro de **CDI + 4% a.a.**?",
        choices: [
          {
            id: "rc_a",
            label:
              "Anualizar pelo **regime composto**: (1,018)^12 − 1 ≈ **23,9% a.a.** Comparar com o **CET do CG** (CDI 11% + spread 4% + IOF ≈ 15,3% a.a.). A antecipação é **~8,6 p.p. mais cara**.",
            correct: true,
            score: 25,
            feedback:
              "Correto. **Composição é regra** quando comparam-se prazos diferentes (mensal vs anual). O cálculo linear (1,8% × 12 = 21,6%) **subestima** em ~2,3 p.p. — sobre R$ 5 M, são R$ 115 mil de erro. Conceito reforçado: **pecking order de funding curto** — quando a empresa tem múltiplas opções, ordene por CET anualizado **composto**, ajustado por **prazo de uso real**. Antecipação cara compensa se o uso for curto e os outros instrumentos cobrarem **abertura de operação**.",
          },
          {
            id: "rc_b",
            label:
              "Linearizar: 1,8% × 12 = **21,6% a.a.** O CG (CDI + 4% ≈ 15%) é 6,6 p.p. mais barato.",
            correct: false,
            score: 5,
            feedback:
              "Direção certa mas magnitude errada. Em prazos longos, **composição importa** — (1,018)^12 = 1,239, ou seja, **23,9% a.a.** não 21,6%. A diferença parece pequena mas, sobre R$ 60 M de movimentação anual, são centenas de milhares de reais. Use composição em qualquer comparação > 30 dias.",
          },
          {
            id: "rc_c",
            label:
              "Como o deságio é **descontado upfront**, é equivalente à taxa nominal — **1,8% a.m.** = ~22% a.a. linear.",
            correct: false,
            score: 0,
            feedback:
              "Dois erros: (1) **upfront não anula composição** — você reaplica o capital líquido a cada ciclo; (2) **deságio sobre face é maior que juros sobre líquido** — se R$ 100 vira R$ 98,2 em 30 dias, a **taxa sobre o líquido** é 1,8/98,2 = 1,833%, não 1,8%. Sutilezas que importam quando o volume é alto.",
          },
          {
            id: "rc_d",
            label:
              "Não dá para comparar — antecipação de cartão é deságio (não juros), enquanto CG é juros — operações financeiramente diferentes.",
            correct: false,
            score: 0,
            feedback:
              "São **comparáveis pelo CET**. Deságio e juros são **formas diferentes de remunerar o capital adiantado**, mas ambos podem (e devem) ser convertidos para uma **base anualizada composta** para escolha racional. A regulação do BCB (CET) **exige** essa equivalência justamente para evitar comparações distorcidas.",
          },
        ],
      },
    },
  ],
};
