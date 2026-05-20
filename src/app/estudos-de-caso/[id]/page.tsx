import Link from "next/link";
import { notFound } from "next/navigation";
import { CASE_STUDIES } from "@/data/case-studies";
import { CASE_STUDY_DATA } from "@/data/case-studies-data";
import { DataTableView } from "@/components/case-study/data-table-view";
import { DownloadXlsxButton } from "@/components/case-study/download-xlsx-button";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ id: c.id }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caseStudy = CASE_STUDIES.find((c) => c.id === id);
  if (!caseStudy) notFound();
  const dataset = CASE_STUDY_DATA[id];

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-20">
        <Link
          href="/estudos-de-caso"
          className="inline-block text-xs text-on-surface-variant hover:text-primary mb-8 transition-colors"
        >
          ← Estudos de Caso
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-white">
            Módulo {caseStudy.moduleNumber}
          </span>
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
            {caseStudy.moduleTitle}
          </span>
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight text-primary leading-tight mb-6">
          {caseStudy.title}
        </h1>

        {/* Resumo */}
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 mb-8 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">
            Resumo do caso
          </div>
          <p className="text-[15px] leading-relaxed text-on-surface m-0">
            {caseStudy.summary}
          </p>
        </div>

        {/* Dados disponibilizados */}
        <Section title="Dados disponibilizados ao aluno">
          <ul className="space-y-2 text-[15px] leading-relaxed">
            {caseStudy.data.map((d, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-secondary shrink-0">•</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Questões */}
        <Section title="Questões a responder">
          <ol className="space-y-3 text-[15px] leading-relaxed list-decimal list-inside marker:font-bold marker:text-secondary">
            {caseStudy.questions.map((q, i) => (
              <li key={i} className="pl-1">
                {q}
              </li>
            ))}
          </ol>
        </Section>

        {/* Entregáveis */}
        <Section title="Entregáveis">
          <ul className="space-y-2 text-[15px] leading-relaxed">
            {caseStudy.deliverables.map((d, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-secondary shrink-0">•</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Duração */}
        <div className="rounded-lg bg-secondary/10 px-5 py-4 mb-8">
          <div className="text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
            Duração estimada
          </div>
          <div className="text-[15px] text-on-surface font-semibold">
            {caseStudy.estimated}
          </div>
        </div>

        {/* Dados do caso (tabelas + download) */}
        {dataset && (
          <section className="mb-10">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <h2 className="text-xs font-bold uppercase tracking-wider text-secondary">
                Dados disponibilizados — relatórios financeiros
              </h2>
              <DownloadXlsxButton
                dataset={dataset}
                filename={`${caseStudy.id}_${caseStudy.title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, "")
                  .slice(0, 60)}.xlsx`}
              />
            </div>
            <p className="text-sm text-on-surface-variant mb-5">
              Os relatórios abaixo podem ser consultados nesta página ou
              baixados em formato Excel para análise.
            </p>
            <div className="space-y-4">
              {dataset.tables.map((t) => (
                <DataTableView key={t.id} table={t} />
              ))}
            </div>
          </section>
        )}

        {/* Notas de gabarito */}
        {caseStudy.teacherNotes && (
          <details className="rounded-xl border border-outline-variant bg-surface-container-low p-6 group">
            <summary className="cursor-pointer font-bold text-primary font-heading text-base flex items-center justify-between">
              <span>Notas de gabarito (apenas para professores)</span>
              <span className="text-secondary group-open:rotate-90 transition-transform">
                ›
              </span>
            </summary>
            <p className="mt-4 text-[14px] leading-relaxed text-on-surface-variant">
              {caseStudy.teacherNotes}
            </p>
          </details>
        )}
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">
        {title}
      </h2>
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
        {children}
      </div>
    </section>
  );
}
