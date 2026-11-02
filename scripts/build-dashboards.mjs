// Gera public/dash/<slug>.html a partir de artifacts/<código>/ (exportados do claude.ai).
// Cada pasta: meta.json, page.html (o files/index.html do artifact), data/<arquivos>,
// e opcionalmente files/<outros arquivos da página>.
// Uso: node scripts/build-dashboards.mjs
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "artifacts");
const OUT = path.join(ROOT, "public", "dash");
const tokens = fs.readFileSync(path.join(OUT, "runtime", "dash.css"), "utf8");

export const slugOf = (code) => code.toLowerCase().replace(/\./g, "-");
const sha = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const safeJson = (v) => JSON.stringify(v).replace(/</g, "\\u003c");

let problems = 0;
const warn = (code, msg) => { problems++; console.warn(`  ! ${code}: ${msg}`); };

for (const code of fs.readdirSync(SRC).sort()) {
  const dir = path.join(SRC, code);
  if (!fs.statSync(dir).isDirectory() || !fs.existsSync(path.join(dir, "meta.json"))) continue;
  const meta = JSON.parse(fs.readFileSync(path.join(dir, "meta.json"), "utf8"));
  let page = fs.readFileSync(path.join(dir, "page.html"), "utf8");

  // Dados: confere sha256 com o do artifact e embute
  const data = {};
  for (const [id, ds] of Object.entries(meta.datasets || {})) {
    const buf = fs.readFileSync(path.join(dir, "data", ds.file));
    if (ds.sha256 && sha(buf) !== ds.sha256) warn(code, `sha256 diferente em ${ds.file}`);
    const fmt = ds.format || path.extname(ds.file).slice(1).toLowerCase();
    const text = buf.toString("utf8");
    data[id] = fmt === "json" ? { format: "json", data: JSON.parse(text) } : { format: fmt, text };
  }

  // Arquivos extras da página (<script src> / <link href> para files/<nome>)
  const filesDir = path.join(dir, "files");
  const extra = (name) => {
    const p = path.join(filesDir, name);
    if (!fs.existsSync(p)) { warn(code, `arquivo da página ausente: ${name}`); return ""; }
    return fs.readFileSync(p, "utf8");
  };
  page = page.replace(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/g, (_, n) => `<style>\n${extra(n)}\n</style>`);
  page = page.replace(/<script\b[^>]*src="([^"]+)"[^>]*>\s*<\/script>/g, (_, n) => `<script>\n${extra(n)}\n</script>`);

  // Cada script em escopo próprio, como no runtime original
  page = page.replace(/<script>([\s\S]*?)<\/script>/g, (_, body) => `<script>(function () {\n${body}\n})();</script>`);

  // Variáveis CSS usadas e não definidas
  const defined = new Set([...(tokens + page).matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
  const used = new Set([...page.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]));
  for (const v of used) if (!defined.has(v)) warn(code, `variável CSS sem definição: ${v}`);

  // APIs do runtime que ainda não existem aqui
  for (const api of [...new Set([...page.matchAll(/dash\.(\w+)/g)].map((m) => m[1]))]) {
    if (!["data", "onData", "draw", "calc", "loader", "colors", "refresh", "params", "setParams", "resetParams", "setLink"].includes(api)) warn(code, `API desconhecida: dash.${api}`);
  }

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${meta.title}</title>
<link rel="stylesheet" href="runtime/dash.css">
<script src="runtime/d3.v7.min.js"></script>
<script>window.__DASH_DATA = ${safeJson(data)};window.__DASH_PARAMS = ${safeJson(meta.params || {})};</script>
<script src="runtime/dash.js"></script>
</head>
<body>
<div id="dash-root">
${page}
</div>
<script>window.__dashStart();</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, `${slugOf(code)}.html`), html);
  console.log(`ok ${code} -> public/dash/${slugOf(code)}.html`);
}
if (problems) { console.error(`${problems} problema(s)`); process.exitCode = 1; }
