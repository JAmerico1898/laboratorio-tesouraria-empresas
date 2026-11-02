/* kit.js — utilitários comuns dos dashboards M2 e M3 (sem texto fixo: só formata, liga controles e desenha estados) */
(function () {
  const loc = d3.formatLocale({ decimal: ',', thousands: '.', grouping: [3], currency: ['R$ ', ''], minus: '−' });
  const K = window.K = {};
  const cache = {};
  K.fmt = (d) => cache[d] || (cache[d] = loc.format(d));
  K.n = (v, d = 0) => (v == null || !Number.isFinite(v) ? '—' : K.fmt(',.' + d + 'f')(Math.abs(v) < 0.5 * Math.pow(10, -d) ? 0 : v));
  K.s = (v, d = 0) => (v == null || !Number.isFinite(v) ? '—' : Math.abs(v) < 0.5 * Math.pow(10, -d) ? K.n(0, d) : K.fmt('+,.' + d + 'f')(v));
  K.p = (v, d = 1) => (v == null || !Number.isFinite(v) ? '—' : K.n(v * 100, d) + '%');
  K.MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  K.MESL = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  K.obj = (rows, key = 'chave', val = 'valor') => { const o = {}; (rows || []).forEach((r) => { const v = r[val]; o[r[key]] = v === '' || v == null || isNaN(Number(v)) ? v : Number(v); }); return o; };
  K.num = (rows) => (rows || []).map((r) => { const o = {}; Object.keys(r).forEach((c) => { const v = r[c]; o[c] = typeof v === 'string' && v.trim() !== '' && !isNaN(Number(v)) ? Number(v) : v; }); return o; });
  // status combinado de vários datasets
  K.status = (ids) => {
    let s = 'ok';
    ids.forEach((id) => { const st = dash.data(id).status; if (st === 'loading' && s === 'ok') s = 'loading'; else if (st !== 'ok' && st !== 'loading') s = 'error'; });
    return s;
  };
  // estado de falha/carregando dentro de um desenho
  K.fail = (el, s) => {
    el.classList.toggle('dash-skeleton', s === 'loading');
    if (s === 'loading') { el.replaceChildren(); return; }
    const d = document.createElement('div'); d.className = 'k-fail';
    const i = document.createElement('i'); d.append(i, 'Não carregou');
    el.replaceChildren(d);
  };
  // desenho de texto: fn(el) devolve string ou null
  K.txt = (name, ready, fn) => dash.draw(name, (el) => {
    const v = ready() ? fn(el) : null;
    el.classList.remove('dash-skeleton');
    el.textContent = v == null ? '—' : v;
  });
  // liga controles [data-k] ao objeto de estado S; onChange(k) após cada mudança
  K.bind = (S, onChange, scope) => {
    const root = scope || document;
    const clamp = (inp, v) => {
      const peer = root.querySelector('input[type=range][data-k="' + inp.dataset.k + '"]') || inp;
      const lo = peer.min === '' ? -Infinity : Number(peer.min), hi = peer.max === '' ? Infinity : Number(peer.max);
      return Math.min(hi, Math.max(lo, v));
    };
    root.querySelectorAll('input[data-k]').forEach((inp) => {
      if (inp.type === 'checkbox') {
        inp.addEventListener('change', () => { S[inp.dataset.k] = inp.checked; onChange(inp.dataset.k); });
        return;
      }
      inp.addEventListener(inp.type === 'range' ? 'input' : 'change', () => {
        const v = Number(inp.value);
        if (inp.value === '' || !Number.isFinite(v)) { K.sync(S, root); return; }
        S[inp.dataset.k] = clamp(inp, v);
        onChange(inp.dataset.k);
      });
    });
    root.querySelectorAll('select[data-k]').forEach((sel) => sel.addEventListener('change', () => {
      const v = sel.value; S[sel.dataset.k] = v !== '' && !isNaN(Number(v)) ? Number(v) : v; onChange(sel.dataset.k);
    }));
    root.querySelectorAll('button[data-k][data-v]').forEach((b) => b.addEventListener('click', () => {
      const v = b.dataset.v; S[b.dataset.k] = v === 'true' ? true : v === 'false' ? false : !isNaN(Number(v)) ? Number(v) : v; onChange(b.dataset.k);
    }));
  };
  K.sync = (S, scope) => {
    const root = scope || document;
    root.querySelectorAll('input[data-k]').forEach((inp) => {
      const v = S[inp.dataset.k]; if (v === undefined) return;
      if (inp.type === 'checkbox') inp.checked = !!v;
      else if (inp !== document.activeElement || inp.type === 'range') inp.value = String(Math.round(Number(v) * 1e6) / 1e6);
    });
    root.querySelectorAll('select[data-k]').forEach((sel) => { const v = S[sel.dataset.k]; if (v !== undefined) sel.value = String(v); });
    root.querySelectorAll('button[data-k][data-v]').forEach((b) => b.setAttribute('aria-pressed', String(String(S[b.dataset.k]) === b.dataset.v)));
  };
  K.redraw = (names) => names.forEach((n) => dash.draw(n));
  // abas: botões .k-tab[data-tab] e painéis [data-pane]; onShow(nome) depois de trocar
  K.tabs = (group, onShow) => {
    const btns = document.querySelectorAll('.k-tab[data-group="' + group + '"]');
    const show = (name) => {
      btns.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === name)));
      document.querySelectorAll('[data-pane][data-group="' + group + '"]').forEach((p) => { p.hidden = p.dataset.pane !== name; });
      if (onShow) onShow(name);
    };
    btns.forEach((b) => b.addEventListener('click', () => { show(b.dataset.tab); try { dash.setLink(b.dataset.tab); } catch (e) { /* ok */ } }));
    return show;
  };
  // frases alternativas: mostra só [data-frase] cujo nome está em keys (dentro do pai de el)
  K.frases = (el, keys) => {
    const set = new Set(keys);
    (el.closest('[data-frases]') || el.parentElement).querySelectorAll('[data-frase]').forEach((p) => { p.hidden = !set.has(p.dataset.frase); });
  };
  // tooltip dentro de um desenho: linhas = [[cor|null, rótulo, valor], …]
  K.tip = (box) => {
    const t = document.createElement('div'); t.className = 'k-tipbox'; t.hidden = true; box.append(t);
    return {
      show(head, linhas, x, y) {
        t.replaceChildren();
        if (head) { const h = document.createElement('div'); h.className = 'k-tiph'; h.textContent = head; t.append(h); }
        linhas.forEach(([cor, lab, val]) => {
          const l = document.createElement('div');
          if (cor) { const i = document.createElement('i'); i.style.background = cor; l.append(i); }
          l.append(lab + (val != null ? ': ' + val : '')); t.append(l);
        });
        t.hidden = false;
        const W = box.clientWidth, w = t.offsetWidth, h = t.offsetHeight;
        let left = x + 12; if (left + w > W) left = Math.max(0, x - w - 12);
        t.style.left = left + 'px'; t.style.top = Math.max(0, y - h - 8) + 'px';
      },
      hide() { t.hidden = true; },
    };
  };
  // svg responsivo dentro de el
  K.svg = (el, H, minW = 300) => {
    const W = Math.max(minW, el.clientWidth || minW);
    const svg = d3.create('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('height', H).style('display', 'block');
    return { svg, W, H };
  };
  K.cssVar = (name, el) => getComputedStyle(el || document.querySelector('.k') || document.body).getPropertyValue(name).trim();
  // bisseção genérica para TIR: f(r) muda de sinal em [lo, hi]
  K.bissec = (f, lo, hi, it = 200) => { let a = lo, b = hi, fa = f(a); for (let i = 0; i < it; i++) { const m = (a + b) / 2, fm = f(m); if ((fm > 0) === (fa > 0)) { a = m; fa = fm; } else b = m; } return (a + b) / 2; };
  // LCG determinístico (semente fixa) e normal por soma de 12 uniformes
  K.lcg = (seed) => { let s = seed >>> 0; return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 4294967296; }; };
  K.normal = (u) => { let a = 0; for (let i = 0; i < 12; i++) a += u(); return a - 6; };
})();

