import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_DASHBOARDS } from "@/data/dashboards";
import { DashboardFrame } from "@/components/dashboard-frame";

export function generateStaticParams() {
  return ALL_DASHBOARDS.map((d) => ({ slug: d.slug }));
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dashboard = ALL_DASHBOARDS.find((d) => d.slug === slug);
  if (!dashboard) notFound();

  return (
    <main className="min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 md:px-8 pt-8 pb-16">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Link
            href="/dashboards"
            className="text-xs text-on-surface-variant hover:text-primary transition-colors"
          >
            ← Dashboards
          </Link>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-white">
            Módulo {dashboard.module.number}
          </span>
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
            {dashboard.module.title}
          </span>
        </div>
        <div className="rounded-xl bg-white overflow-hidden shadow-[0_12px_32px_rgba(25,28,29,0.06)]">
          <DashboardFrame slug={dashboard.slug} title={`${dashboard.code} · ${dashboard.title}`} />
        </div>
      </div>
    </main>
  );
}
