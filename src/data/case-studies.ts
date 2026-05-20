export type CaseStudy = {
  id: string;
  moduleNumber: number;
  moduleTitle: string;
  title: string;
  summary: string;
  data: string[];
  questions: string[];
  deliverables: string[];
  estimated: string;
  teacherNotes?: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "cs1",
    moduleNumber: 1,
    moduleTitle: "Fundamentos do capital de giro",
    title: "Magazine Alvorada SA — o desafio do crescimento acelerado",
    summary:
      "Rede de varejo de eletroeletrônicos com 12 lojas, 380 colaboradores e receita anual de R$ 220 milhões. Cresceu 35% a.a. nos últimos 3 anos financiando a expansão com dívida bancária de curto prazo. O tesoureiro relata dificuldades crescentes para honrar compromissos no fim do mês, apesar do lucro líquido positivo.",
    data: [
      "BP e DRE detalhados dos 3 últimos exercícios.",
      "DFC pelo método indireto.",
      "Demonstrativo de endividamento por banco e modalidade.",
      "Projeção de orçamento de caixa mensal para os próximos 12 meses (incompleta).",
      "Política de dividendos: payout de 70% sobre o lucro líquido.",
    ],
    questions: [
      "Diagnostique a saúde financeira utilizando indicadores de liquidez, prazos médios, modelo Fleuriet (CCL, NCG, ST) e análise da evolução do efeito tesoura.",
      "Identifique as três causas principais da deterioração do ST.",
      "Proponha um plano de ação em 5 frentes (operacional, comercial, política de dividendos, estrutura de dívida e captação) com horizonte de 18 meses.",
      "Estime o impacto quantitativo das ações propostas sobre o ST.",
      "Apresente os principais riscos e indicadores de monitoramento.",
    ],
    deliverables: [
      "Relatório executivo de até 4 páginas com diagnóstico, plano e cronograma.",
      "Planilha de projeção da NCG, CCL e ST para 12 meses, com e sem as ações propostas.",
      "Quadro-resumo de riscos × mitigações.",
    ],
    estimated: "8 a 12 horas, em duas etapas (diagnóstico e plano).",
    teacherNotes:
      "Diagnóstico esperado: efeito tesoura clássico por payout alto (70%) incompatível com crescimento de 35% a.a. Sintomas: ST cai sistematicamente, dívida de CP cresce, concentração em 2 bancos. Plano-modelo: (i) reduzir payout para 30% por 24 meses; (ii) alongar dívida (de 12 para 36 meses); (iii) negociar PMPF com 3 maiores fornecedores; (iv) implantar curva ABC e revisar estoque (alvo: PMRE de 75 para 55 dias); (v) avaliar follow-on/dívida subordinada de R$ 40 milhões. Critérios de avaliação: qualidade do diagnóstico (30%), consistência quantitativa (25%), viabilidade do plano (25%), tratamento dos riscos (20%).",
  },
  {
    id: "cs2",
    moduleNumber: 2,
    moduleTitle: "Orçamento de caixa",
    title: "TecnoVerde SA — planejamento de caixa em ambiente sazonal",
    summary:
      "Fabricante de equipamentos para o agronegócio. 70% das vendas concentram-se entre julho e dezembro (pré-safra). No 1º semestre acumula excedentes; no 2º enfrenta picos de demanda por matéria-prima. O tesoureiro precisa orçar 12 meses, definir política de aplicação dos excedentes e plano de captação para o pico.",
    data: [
      "Receita projetada anual: R$ 180 milhões, com distribuição mensal fornecida.",
      "PMRV médio: 60 dias, com 90 dias para clientes de grande porte (40% do mix).",
      "PMPF médio: 45 dias, com possibilidade de extensão negociada.",
      "Inadimplência histórica: 1,8%.",
      "Caixa atual: R$ 12 milhões. Saldo mínimo: R$ 3 milhões.",
      "Linhas pré-aprovadas: R$ 40 milhões em 3 bancos.",
      "Calendário de tributos e folha (13º em junho e novembro).",
    ],
    questions: [
      "Monte o orçamento de caixa mensal (12 meses), identificando meses de superávit e déficit.",
      "Proponha a política de aplicação dos excedentes do 1º semestre, com mix e limites.",
      "Recomende o mix de fontes de captação para os meses deficitários, com cálculo do CET.",
      "Avalie o impacto de negociar PMPF de 45 para 60 dias com os 3 principais fornecedores.",
      "Apresente o painel mensal de monitoramento (saldo projetado vs realizado, alertas).",
    ],
    deliverables: [
      "Planilha de orçamento de caixa com cenário-base, otimista e pessimista.",
      "Memorando de 3 páginas com a política de investimento de excedentes.",
      "Tabela comparativa das alternativas de captação (custo, prazo, risco).",
    ],
    estimated: "10 a 14 horas, em três entregas parciais.",
    teacherNotes:
      "Cenário esperado: superávit médio de R$ 8-12 milhões entre fev-mai; déficit de R$ 6-10 milhões entre jul-set. Política de aplicação: 40% liquidez diária (CDB), 40% CDB 60-90 dias casados com a necessidade, 20% LFT/LCA. Captação: mix de antecipação de recebíveis (40%, custo CDI+5-6%) e capital de giro 12 meses (60%, custo CDI+3-4%). Negociação de PMPF: liberaria R$ 4,5 milhões em capital de giro, reduzindo necessidade de captação em ≈ 25%, com economia de custo financeiro de R$ 350-450 mil ao ano. Critérios de avaliação: aderência ao cenário base (25%), qualidade da política de investimento (25%), análise de captação (25%), painel de monitoramento (25%).",
  },
  {
    id: "cs3",
    moduleNumber: 3,
    moduleTitle: "Gestão de estoques",
    title: "Tintas Tropical — reformulando a política de estoque",
    summary:
      "Fabricante regional com 3.500 SKUs, 4 fábricas e atendimento a 1.200 clientes. O estoque atual representa 95 dias de vendas — bem acima da média setorial de 60 dias. O CFO contratou um diagnóstico para liberar capital sem comprometer o nível de serviço.",
    data: [
      "Mapa dos 3.500 SKUs com consumo anual e custo unitário.",
      "Estoque atual avaliado em R$ 142 milhões.",
      "Custo de carregamento estimado em 22% a.a. do valor estocado.",
      "Custo médio de pedido: R$ 95.",
      "Taxa de ruptura atual em itens classe A: 1,8%.",
      "Nível de serviço-alvo: 97% (itens críticos) e 92% (não críticos).",
    ],
    questions: [
      "Construa a curva ABC e indique a participação esperada em valor de cada classe.",
      "Calcule o EOQ para os 30 maiores SKUs e compare com o lote atualmente comprado.",
      "Dimensione o estoque de segurança para itens da classe A, considerando o nível de serviço-alvo.",
      "Estime o potencial total de redução de estoque e o impacto na NCG, no caixa e nos resultados.",
      "Proponha um cronograma de implantação em 12 meses, com indicadores de monitoramento.",
    ],
    deliverables: [
      "Memorando executivo com diagnóstico e recomendações (≤ 5 páginas).",
      "Planilha de cálculo da curva ABC, EOQ e ES por SKU (top 30).",
      "Cronograma com marcos e métricas (KPIs).",
    ],
    estimated: "10 a 14 horas, em duas entregas (diagnóstico e plano).",
    teacherNotes:
      "Curva ABC esperada: ~17-22% dos SKUs concentrando ~78-82% do valor. EOQ médio para SKUs top 30 normalmente fica 30-50% abaixo dos lotes praticados, indicando histórico de compra acima do ótimo. Potencial de redução de estoque: 20-30% (R$ 28-42 milhões) em 12 meses, sem deterioração do nível de serviço, se houver disciplina de execução. Indicadores-chave: PMRE mensal, taxa de ruptura por classe, % de SKUs em obsolescência, giro do estoque. Critérios de avaliação: qualidade da ABC (20%), aplicação correta do EOQ (25%), dimensionamento do ES (20%), análise financeira (20%), cronograma (15%).",
  },
  {
    id: "cs4",
    moduleNumber: 4,
    moduleTitle: "Gestão de contas a receber",
    title: "Distribuidora Sigma — reformulando a política de crédito e cobrança",
    summary:
      "Distribuidora com carteira em aberto de R$ 86 milhões dividida em 4 faixas de aging, política comercial de prazo padrão de 60 dias sem desconto por antecipação e análise manual de crédito. PMRV elevado e inadimplência crescente exigem redesenho integral da política de crédito e cobrança.",
    data: [
      "Aging detalhado da carteira em aberto (R$ 86 milhões em 4 faixas).",
      "Política atual: prazo padrão 60 dias, sem desconto por antecipação, análise manual de crédito.",
      "Inadimplência por faixa de cliente (A/B/C/D) e por setor atendido.",
      "Tabela do bureau de crédito utilizado.",
      "Estrutura atual da área de cobrança: 8 pessoas, custo R$ 1,4 milhão/ano.",
      "Custo de capital próprio: 15% a.a.",
    ],
    questions: [
      "Diagnostique os principais drivers do aumento de PMRV e inadimplência.",
      "Proponha um modelo de credit scoring com variáveis disponíveis e estruture o cutoff.",
      "Desenhe a política de cobrança escalonada otimizada com custos × recuperação.",
      "Avalie a viabilidade de oferecer condição 2/10 net 60 ou 3/15 net 60.",
      "Estime o impacto agregado das mudanças propostas no PMRV, na inadimplência e no caixa em 12 meses.",
    ],
    deliverables: [
      "Relatório executivo (≤ 6 páginas).",
      "Manual da nova política de crédito e cobrança (≤ 10 páginas).",
      "Planilha de simulação dos impactos financeiros, com cenários (otimista, base, pessimista).",
    ],
    estimated: "12 a 16 horas, em três entregas.",
    teacherNotes:
      "Diagnóstico esperado: PMRV efetivo de ~78 d vs contratual de 60 d, com inadimplência consolidada de 3,8% — drivers principais são (i) ausência de credit scoring sistematizado (análise manual deixa entrar D em condições de B), (ii) cobrança apenas reativa via e-mail/telefone (sem WhatsApp/SMS, sem terceirização), (iii) política única de prazo (sem segmentação por perfil). Modelo de scoring sugerido: regressão logística com variáveis bureau (Serasa) + setor + tempo de relacionamento + valor médio; cutoff em 600 (rejeita E, exige garantia em D, libera A/B). Política otimizada: 2/10 net 60 para A/B (TIR do desconto ~15% a.a., abaixo do WACC 15%), 30-45 d com pricing risco-ajustado para C, à vista para D. Cobrança: WhatsApp + SMS automatizados em D−3 e D+1, ativa interna até D+60, terceirizada > D+60 (25% do recuperado), cessão > D+90 (deságio 50%). Impacto projetado em 12 meses: PMRV cai para 62 d, inadimplência para 2,3%, caixa liberado ~R$ 16 M, ganho recorrente ~R$ 2,8 M/ano. Critérios de avaliação: diagnóstico (25%), modelo de scoring (25%), redesenho da cobrança (25%), análise financeira do impacto (25%).",
  },
  {
    id: "cs5",
    moduleNumber: 5,
    moduleTitle: "Gestão de fornecedores e passivos CP",
    title: "Indústria Omega — gestão integrada de passivos em ciclo recessivo",
    summary:
      "Indústria com dívida bancária diversificada, PMPF médio de 38 dias e EBITDA em retração (de R$ 42 M para R$ 35 M projetado). Covenants vigentes (DL/EBITDA ≤ 3,0x e EBITDA/D.Financeira ≥ 3,0x) sob pressão. Tesouraria precisa estruturar resposta integrada antes da violação.",
    data: [
      "Composição atual da dívida bancária por banco, modalidade, taxa e vencimento.",
      "PMPF médio: 38 dias (com fornecedores principais).",
      "Caixa atual: R$ 22 milhões; saldo mínimo: R$ 8 milhões.",
      "EBITDA atual (LTM): R$ 42 milhões; projetado próximo ano: R$ 35 milhões.",
      "Covenants vigentes: D.Líq/EBITDA ≤ 3,0x e EBITDA/D.Financeira ≥ 3,0x.",
      "Aging de fornecedores em aberto, com indicação dos 5 maiores.",
    ],
    questions: [
      "Diagnostique a estrutura atual da dívida (concentração, custo médio, perfil, riscos).",
      "Calcule a margem (cushion) atual sobre cada covenant e a projeção para o próximo ano.",
      "Proponha um plano de gestão integrada: ajustes de PMPF, otimização de linhas bancárias, política de saldo mínimo dinâmica.",
      "Avalie a viabilidade de implantar vendor finance para 2-3 fornecedores estratégicos.",
      "Defina o painel de monitoramento mensal, com gatilhos de ação.",
    ],
    deliverables: [
      "Relatório executivo (≤ 5 páginas) com diagnóstico e plano.",
      "Planilha consolidada de passivos com cenários (base, otimista, pessimista) e covenants.",
      "Memorando de proposta de vendor finance, com fornecedores-alvo e premissas comerciais.",
      "Quadro de governança da tesouraria: comitês, métricas, periodicidades.",
    ],
    estimated: "12 a 16 horas, em três entregas.",
    teacherNotes:
      "Diagnóstico esperado: DL = R$ 84 M, EBITDA LTM = R$ 42 M → DL/EBITDA atual 2,00x (cushion 1,0x sobre o cap 3,0x). Com EBITDA projetado em R$ 35 M (queda 17%), o ratio passa para 2,40x — ainda dentro, mas EBITDA/D.F. cai de 3,11x para 2,50x violando o covenant ≥ 3,0x. Plano integrado: (i) reduzir PMPF de 38 d para 32 d via vendor finance em 2-3 fornecedores estratégicos (libera ~R$ 4 M de caixa, não compromete fornecedor estratégico de matéria-prima); (ii) substituir conta garantida cara (CDI+9%) por capital de giro novo (CDI+4%) — economia ~R$ 250 mil/ano; (iii) reduzir saldo mínimo de R$ 8 M para R$ 6 M após implementar concentração bancária e cash pooling — libera R$ 2 M aplicáveis; (iv) renegociar covenant EBITDA/D.F. para ≥ 2,5x por 18 meses (fee + spread = R$ 0,8 M, evita aceleração da debênture). Painel: ratio DL/EBITDA mensal, EBITDA/D.F. trimestral, gatilho automático em 2,7x dispara comunicação proativa com debenturistas. Critérios de avaliação: diagnóstico da dívida (20%), cálculo dos covenants (25%), plano integrado (25%), vendor finance (15%), governança e monitoramento (15%).",
  },
];
