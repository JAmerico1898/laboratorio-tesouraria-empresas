import Link from "next/link";
import { DASHBOARD_MODULES } from "@/data/dashboards";

export default function DashboardsPage() {
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
          Dashboards
        </h1>
        <p className="text-on-surface-variant text-lg max-w-3xl leading-relaxed mb-12">
          Dashboards interativos de cada módulo do curso. Clique em um dashboard
          para abri-lo em nova aba.
        </p>

        <div className="space-y-8">
          {DASHBOARD_MODULES.map((m) => (
            <section
              key={m.number}
              className="rounded-xl bg-surface-container-lowest p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-12 -mt-12" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-white">
                    Módulo {m.number}
                  </span>
                  <h2 className="font-heading text-2xl font-bold text-primary leading-tight">
                    {m.title}
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {m.dashboards.map((d) => (
                    <a
                      key={d.code}
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-lg border border-primary/10 bg-white p-5 flex flex-col justify-between min-h-[130px] transition-all hover:border-primary/40 hover:shadow-[0_12px_32px_rgba(25,28,29,0.06)]"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                          {d.code}
                        </span>
                        <h3 className="font-heading text-base font-bold text-primary leading-snug mt-1">
                          {d.title}
                        </h3>
                      </div>
                      <div className="mt-4 flex items-center font-bold text-xs text-primary group-hover:translate-x-1 transition-transform">
                        <span>Abrir dashboard</span>
                        <span className="ml-2">↗</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
