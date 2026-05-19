import Link from "next/link";
import { strings } from "@/lib/strings";

interface ModuleInfo {
  id: string;
  number: number;
  title: string;
  href: string | null;
}

const MODULES: ModuleInfo[] = [
  {
    id: "m1",
    number: 1,
    title: "Fundamentos do capital de giro",
    href: "/modulo-1",
  },
  { id: "m2", number: 2, title: "Orçamento de caixa", href: "/modulo-2" },
  { id: "m3", number: 3, title: "Gestão de estoques", href: null },
  { id: "m4", number: 4, title: "Gestão de contas a receber", href: null },
  {
    id: "m5",
    number: 5,
    title: "Gestão de fornecedores e passivos de curto prazo",
    href: null,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <div className="text-xs uppercase tracking-[0.18em] text-muted mb-4">
          {strings.institution}
        </div>
        <h1 className="font-serif text-5xl md:text-6xl font-bold leading-[1.05] mb-4">
          {strings.heroTitle}
        </h1>
        <p className="text-lg text-muted mb-2">{strings.professor}</p>
        <p className="text-base text-ink/80 max-w-2xl leading-relaxed mt-6">
          {strings.heroPitch}
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="text-xs uppercase tracking-[0.18em] text-accent mb-4 font-semibold">
          {strings.modulesTitle}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MODULES.map((m) => {
            const active = m.href !== null;
            const inner = (
              <div
                className={`h-full bg-surface border rounded-lg p-5 transition-all ${
                  active
                    ? "border-border-soft hover:border-accent cursor-pointer"
                    : "border-border-soft opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                    Módulo {m.number}
                  </span>
                  {!active && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                      {strings.emBreve}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-xl font-semibold leading-tight">
                  {m.title}
                </h3>
              </div>
            );
            return active && m.href ? (
              <Link key={m.id} href={m.href} className="block">
                {inner}
              </Link>
            ) : (
              <div key={m.id}>{inner}</div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-border-soft mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 text-xs text-muted">
          {strings.footer}
        </div>
      </footer>
    </main>
  );
}
