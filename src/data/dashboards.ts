import { strings } from "@/lib/strings";

export type DashboardLink = { code: string; title: string; url: string };
export type DashboardModule = { number: number; title: string; dashboards: DashboardLink[] };

// Links publicados (fonte: Material_Base & Plano_Videoaulas/Dashboards/M*_Dashboards_publicados.md)
export const DASHBOARD_MODULES: DashboardModule[] = [
  {
    number: 1,
    title: strings.navM1,
    dashboards: [
      { code: "D1.1", title: "Balanço vivo", url: "https://claude.ai/artifact/GS6QahuWckyfizMHVwd77o" },
      { code: "D1.2", title: "Linha do tempo do ciclo", url: "https://claude.ai/artifact/6V4oRDb4ayvWQnNSJ6YrSA" },
      { code: "D1.3", title: "Reclassificador Fleuriet", url: "https://claude.ai/code/artifact/f406980b-431b-429a-842d-b771cdbac67c" },
      { code: "D1.4", title: "Efeito Tesoura", url: "https://claude.ai/artifact/Rmo9nyfShGCT21dNt26Jcd" },
    ],
  },
  {
    number: 2,
    title: strings.navM2,
    dashboards: [
      { code: "D2.1", title: "Cascata do orçamento de caixa", url: "https://claude.ai/artifact/SxCu9Zniu74ZoP2iMRkVeH" },
      { code: "D2.2", title: "Da receita ao caixa", url: "https://claude.ai/artifact/BSxQkNy4kR5rYGdaEVyNDF" },
      { code: "D2.3", title: "Calendário de saídas", url: "https://claude.ai/artifact/Gwe4Vhs71xk11iYcAZnmhL" },
      { code: "D2.4", title: "Lucro × caixa", url: "https://claude.ai/artifact/HQvXH6dTavc8vmopWHqXoR" },
      { code: "D2.5", title: "Excedentes", url: "https://claude.ai/artifact/RB7wfpWakhGKUSG1yD7N4R" },
      { code: "D2.6", title: "Financiar o déficit", url: "https://claude.ai/artifact/CiQewCkr34L3PautZ3Gujv" },
      { code: "D2.7", title: "Previsão de caixa", url: "https://claude.ai/artifact/VEMnbmguDNrcJBC6SGwBHX" },
    ],
  },
  {
    number: 3,
    title: strings.navM3,
    dashboards: [
      { code: "D3.1", title: "Estoque é dinheiro parado", url: "https://claude.ai/artifact/KWrnvFuovyebYaHZuqbmoH" },
      { code: "D3.2", title: "Curva ABC × XYZ", url: "https://claude.ai/artifact/2XNCBZSytxSpzudUuDEDv4" },
      { code: "D3.3", title: "Lote econômico", url: "https://claude.ai/artifact/SWM2tVA7aKttaM6mFpWZf7" },
      { code: "D3.4", title: "Dente de serra", url: "https://claude.ai/artifact/QrKmwfXbzgciX2PtbhsU7Q" },
    ],
  },
  {
    number: 4,
    title: strings.navM4,
    dashboards: [
      { code: "D4.1", title: "Venda a prazo: o fluxo", url: "https://claude.ai/artifact/3QEPzQBVQiMNp7yis8WNsN" },
      { code: "D4.2", title: "Condições de venda", url: "https://claude.ai/artifact/3YsoouWMarHUfyrNALCkbH" },
      { code: "D4.3", title: "Política A → Δ → B", url: "https://claude.ai/artifact/1iEW9q6fRKtDCtahAcced8" },
      { code: "D4.4", title: "5 Cs · dossiê Horizonte", url: "https://claude.ai/artifact/DUFeW2kTcnKN4oXop77fzW" },
      { code: "D4.5", title: "Score, cutoff e decisão", url: "https://claude.ai/artifact/SvctCnZaasLWatywPzWnib" },
      { code: "D4.6", title: "KS, AUC e PSI", url: "https://claude.ai/artifact/6Z9ExVZtUKGUu9toX2pBSm" },
      { code: "D4.7", title: "Régua de cobrança", url: "https://claude.ai/artifact/C22PuccB9VuqAVHMcUdjQW" },
      { code: "D4.8", title: "Antecipação, FIDC e cartão", url: "https://claude.ai/artifact/Dxy8DvTvuzKuYZZF2qioht" },
    ],
  },
  {
    number: 5,
    title: strings.navM5,
    dashboards: [
      { code: "D5.1", title: "Fornecedor é credor", url: "https://claude.ai/artifact/Gc9EeKCRgosY7qwWQpfBK9" },
      { code: "D5.2", title: "Mesa de negociação", url: "https://claude.ai/artifact/BoQcX3DXMveuXaFZxzzHts" },
      { code: "D5.3", title: "Cardápio de instrumentos", url: "https://claude.ai/artifact/Fq44w2C6N3WAptsFb7Nhqz" },
      { code: "D5.4", title: "Calculadora de CET", url: "https://claude.ai/artifact/PfE7utQKfHYtL22yH2XXSC" },
      { code: "D5.5", title: "Passivo integrado", url: "https://claude.ai/artifact/4CRAxk7eH98HpLVT5E9BNt" },
      { code: "D5.6", title: "Covenants com buffer", url: "https://claude.ai/artifact/XfqeSQ3UHepLrWYjdKMjEs" },
      { code: "D5.7", title: "Fecho da cadeia", url: "https://claude.ai/artifact/N4DV7tSomwVY4CQyuqQgnc" },
    ],
  },
];
