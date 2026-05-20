import Link from "next/link";
import { CASE_STUDIES } from "@/data/case-studies";

export default function EstudosDeCasoPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-8 pt-12 pb-20">
        <Link
          href="/"
          className="inline-block text-xs text-on-surface-variant hover:text-primary mb-8 transition-colors"
        >
          ← Início
        </Link>

        <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-3">
          Estudos de Caso
        </h1>
        <p className="text-on-surface-variant text-lg max-w-3xl leading-relaxed mb-12">
          Cinco casos abertos — um por módulo — para aplicar de ponta a ponta os
          conceitos do curso. Cada caso traz contexto, dados disponibilizados,
          questões a responder e entregáveis esperados.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {CASE_STUDIES.map((c) => (
            <Link
              key={c.id}
              href={`/estudos-de-caso/${c.id}`}
              className="block group"
            >
              <div className="rounded-xl bg-surface-container-lowest p-8 transition-all hover:shadow-[0_12px_32px_rgba(25,28,29,0.06)] flex flex-col justify-between min-h-[260px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500" />
                <div className="relative">
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-white">
                      Módulo {c.moduleNumber}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
                      {c.estimated.split(",")[0]}
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-primary leading-tight mb-3">
                    {c.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-4">
                    {c.summary}
                  </p>
                </div>
                <div className="mt-6 flex items-center font-bold text-sm text-primary group-hover:translate-x-1 transition-transform">
                  <span>Abrir caso</span>
                  <span className="ml-2">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
