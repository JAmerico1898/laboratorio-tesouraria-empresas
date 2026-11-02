"use client";

import { useEffect, useRef, useState } from "react";

// Mostra um dashboard de public/dash/ num iframe que cresce com o conteúdo.
// Mesma origem: a altura é medida direto no documento do iframe.
export function DashboardFrame({ slug, title }: { slug: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(900);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let ro: ResizeObserver | undefined;
    const attach = () => {
      const body = frame.contentDocument?.body;
      if (!body) return;
      ro?.disconnect();
      const measure = () => setHeight(Math.ceil(body.getBoundingClientRect().height));
      ro = new ResizeObserver(measure);
      ro.observe(body);
      measure();
    };
    // O iframe pode ter carregado antes da hidratação
    if (frame.contentDocument?.readyState === "complete") attach();
    frame.addEventListener("load", attach);
    return () => {
      frame.removeEventListener("load", attach);
      ro?.disconnect();
    };
  }, []);

  return (
    <iframe
      ref={ref}
      src={`/dash/${slug}.html`}
      title={title}
      style={{ height }}
      className="w-full border-0 block"
    />
  );
}
