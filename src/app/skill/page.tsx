import Link from "next/link";

const BLOCOS = [
  "Capital de giro e Modelo Fleuriet (CCL, NCG, ST, Efeito Tesoura)",
  "Orçamento e previsão de caixa (aging, saldo mínimo, ponte lucro → caixa, DSO, roll rates)",
  "Aplicação de excedentes (IR, IOF, come-cotas, taxa líquida)",
  "Estoques (ABC × XYZ, EOQ, estoque de segurança, ponto de pedido)",
  "Contas a receber e crédito (d/k net n, análise marginal, 5 Cs, scoring KS/AUC/PSI, antecipação/FIDC)",
  "Fornecedores e passivos de curto prazo (desconto, CET, pooling, HHI, covenants)",
  "Além do curso: câmbio e hedge, tributos no caixa, RPA e Open Finance",
];

const PASSOS = [
  <>
    Baixe o arquivo <code>tesouraria-empresas.skill</code> no botão acima.
  </>,
  <>
    No Claude (claude.ai ou app desktop), abra{" "}
    <strong>Configurações → Capacidades</strong> e confirme que a execução de
    código está ativada.
  </>,
  <>
    Em <strong>Configurações → Skills</strong>, clique em{" "}
    <strong>Enviar skill</strong> e selecione o arquivo baixado.
  </>,
  <>
    Pronto. A skill aciona sozinha quando o pedido é de tesouraria de empresa
    (&ldquo;qual o ST?&rdquo;, &ldquo;CET desta linha&rdquo;, &ldquo;vale o
    2/10 net 30?&rdquo;). Se não acionar, escreva{" "}
    <code>/tesouraria-empresas</code> ou &ldquo;use a skill
    tesouraria-empresas&rdquo;.
  </>,
];

export default function SkillPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-8 pt-12 pb-20">
        <Link
          href="/"
          className="inline-block text-xs text-on-surface-variant hover:text-primary mb-8 transition-colors"
        >
          ← Início
        </Link>

        <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-3">
          Skill.md
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed mb-10">
          A skill <code>tesouraria-empresas</code> transforma o Claude em uma
          ferramenta de cálculo e análise para o tesoureiro ou CFO de uma
          empresa não financeira no Brasil. Ela resolve decisões do dia a dia e
          exercícios do curso com números auditáveis: premissas explícitas,
          fórmula, resultado com unidade e as checagens feitas. Os cálculos
          rodam em scripts Python, não &ldquo;de cabeça&rdquo;.
        </p>

        <section className="rounded-xl bg-surface-container-lowest p-8 mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            Alcance
          </h2>
          <p className="text-on-surface-variant mb-4">
            Cobre todo o conteúdo dos Módulos 1 a 5 do curso e vai além em dois
            blocos:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-on-surface-variant">
            {BLOCOS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <p className="text-on-surface-variant mt-4 text-sm">
            A perspectiva é a da empresa, não do banco. Dados de mercado (CDI,
            Selic, PTAX) nunca são inventados: a skill pede, busca no BCB ou
            marca o valor como hipotético.
          </p>
        </section>

        <section className="rounded-xl bg-surface-container-lowest p-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            Download e instalação
          </h2>
          <a
            href="/downloads/tesouraria-empresas.skill"
            download
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-5 py-3 font-bold text-sm hover:opacity-90 transition-opacity mb-6"
          >
            ↓ Baixar tesouraria-empresas.skill
          </a>
          <ol className="list-decimal pl-5 space-y-2 text-on-surface-variant">
            {PASSOS.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
          <p className="text-on-surface-variant mt-6 text-sm">
            <strong>Claude Code ou VS Code:</strong> o arquivo{" "}
            <code>.skill</code> é um ZIP. Descompacte-o em{" "}
            <code>~/.claude/skills/tesouraria-empresas/</code> para usar a skill
            em todos os projetos. Os scripts rodam só com a biblioteca padrão do
            Python 3.9+; apenas a estimação do scorecard exige{" "}
            <code>numpy</code>.
          </p>
        </section>
      </div>
    </main>
  );
}
