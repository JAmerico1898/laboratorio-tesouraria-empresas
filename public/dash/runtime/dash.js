/* Runtime local dos dashboards exportados do claude.ai.
   Reimplementa a API usada pelas páginas (dash.data, dash.draw, dash.onData,
   dash.calc, dash.loader, dash.params...) sobre dados embutidos em
   window.__DASH_DATA pelo gerador (scripts/build-dashboards.mjs). */
(function () {
  // Erros da página, para checagem automatizada
  const errors = window.__dashErrors = [];
  window.addEventListener('error', (e) => errors.push(String(e.message)));
  const logErr = console.error.bind(console);
  console.error = (...a) => { errors.push(a.map(String).join(' ')); logErr(...a); };
  const RAW = window.__DASH_DATA || {};
  const cache = {};
  const calcs = {};
  const loaders = {};
  const draws = new Map();
  const onDatas = [];
  let params = {};
  let defaults = Object.assign({}, window.__DASH_PARAMS || {});
  params = Object.assign({}, defaults);
  let started = false;
  let gen = 0;
  const drawnGen = new WeakMap();
  const widths = new WeakMap();
  const mounted = new WeakMap();
  const stale = new WeakSet(); // pedidos de desenho feitos enquanto sob [hidden]

  function rowsOf(v) {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') {
      for (const k of ['rows', 'data', 'results']) if (Array.isArray(v[k])) return v[k];
    }
    return null;
  }
  function ok(v, meta) {
    const rows = rowsOf(v);
    const data = rows || v;
    const columns = rows ? (rows.columns || Object.keys(rows[0] || {})) : [];
    return { status: 'ok', data, rows: data, columns, value: v, message: '', refreshing: false, meta: meta || [] };
  }
  const pending = (status, message) => ({ status, data: [], rows: [], columns: [], value: undefined, message: message || '', refreshing: false, meta: [] });

  function parseRaw(s) {
    if (s.format === 'json') return s.data;
    return d3.dsvFormat(s.format === 'tsv' ? '\t' : ',').parse(s.text);
  }

  function data(id) {
    if (cache[id]) return cache[id];
    let r;
    if (calcs[id]) {
      const c = calcs[id];
      const ins = [];
      for (const i of c.inputs || []) {
        const d = data(i);
        if (d.status !== 'ok') return pending(d.status, d.message);
        ins.push(d.data);
      }
      try { r = ok(c.fn(...ins)); } catch (e) { console.error('[dash] calc ' + id, e); r = pending('error', String(e)); }
    } else if (RAW[id]) {
      try {
        let v = parseRaw(RAW[id]);
        let meta;
        if (loaders[id]) {
          const out = loaders[id].fn(v);
          if (out && !Array.isArray(out) && Array.isArray(out.rows) && 'meta' in out) { meta = out.meta; v = out.rows; } else v = out;
        }
        r = ok(v, meta);
      } catch (e) { console.error('[dash] dataset ' + id, e); r = pending('error', String(e)); }
    } else {
      console.warn('[dash] dataset ausente: ' + id);
      r = pending('missing');
    }
    cache[id] = r;
    return r;
  }

  const visible = (el) => el.isConnected && !el.closest('[hidden]');

  function runOne(name, el) {
    const d = draws.get(name);
    if (!d) return;
    drawnGen.set(el, gen);
    stale.delete(el);
    widths.set(el, el.clientWidth);
    try {
      if (typeof d === 'function') d(el);
      else {
        let m = mounted.get(el);
        if (!m) { el.replaceChildren(); m = { made: d.mount ? d.mount(el) : undefined }; mounted.set(el, m); }
        if (d.update) d.update(el, m.made);
      }
    } catch (e) {
      console.error('[dash] draw ' + name, e);
      if (typeof d !== 'function') {
        const m = mounted.get(el);
        try { if (d.unmount) d.unmount(el, m && m.made); } catch (_) { /* ignore */ }
        mounted.delete(el);
      }
    }
    observe(el);
  }
  function drawName(name) {
    document.querySelectorAll('[data-draw="' + CSS.escape(name) + '"]').forEach((el) => {
      if (visible(el)) runOne(name, el); else stale.add(el);
    });
  }
  function cycle() {
    gen++;
    onDatas.forEach((fn) => { try { fn(); } catch (e) { console.error('[dash] onData', e); } });
    for (const n of draws.keys()) drawName(n);
  }
  // Desenhos que estavam sob [hidden] e ficaram visíveis
  function catchUp() {
    document.querySelectorAll('[data-draw]').forEach((el) => {
      if ((drawnGen.get(el) !== gen || stale.has(el)) && visible(el)) runOne(el.dataset.draw, el);
    });
  }

  let raf = 0;
  let rafFull = false;
  function schedule(full) {
    rafFull = rafFull || full;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const f = rafFull;
      rafFull = false;
      if (f) cycle(); else catchUp();
    });
  }

  const ro = new ResizeObserver((entries) => {
    for (const en of entries) {
      const el = en.target;
      if (el.id === 'dash-root') continue;
      if (widths.get(el) !== el.clientWidth && visible(el) && el.dataset.draw) runOne(el.dataset.draw, el);
    }
  });
  const observed = new WeakSet();
  function observe(el) { if (!observed.has(el)) { observed.add(el); ro.observe(el); } }

  window.dash = {
    data,
    onData(fn) { onDatas.push(fn); if (started) { try { fn(); } catch (e) { console.error('[dash] onData', e); } } },
    draw(name, fn) {
      if (fn === undefined) { drawName(name); return; }
      draws.set(name, fn);
      if (started) drawName(name);
    },
    calc(id, spec) { calcs[id] = spec; delete cache[id]; },
    loader(id, spec) { loaders[id] = spec; delete cache[id]; },
    colors: ['#2A6FDB', '#E3A21A', '#2E9E5B', '#D64545', '#7B5CC4', '#1BA3A3', '#D9693B', '#8A8F98'],
    refresh() { /* dados locais: nada a atualizar */ },
    params() { return Object.assign({}, params); },
    setParams(p) {
      for (const k of Object.keys(p || {})) { if (p[k] === null || p[k] === undefined) delete params[k]; else params[k] = p[k]; }
      schedule(true);
    },
    resetParams() { params = Object.assign({}, defaults); schedule(true); },
    setLink() { /* sem links externos */ },
  };

  window.__dashStart = function () {
    started = true;
    const root = document.getElementById('dash-root');
    // Antes do 1º ciclo: um desenho pode revelar outro (tirar [hidden]) já nele
    new MutationObserver(() => schedule(false)).observe(root, { attributes: true, attributeFilter: ['hidden'], subtree: true });
    cycle();
    let lastW = root.clientWidth;
    new ResizeObserver(() => {
      if (root.clientWidth !== lastW) { lastW = root.clientWidth; schedule(true); }
    }).observe(root);
  };
})();
