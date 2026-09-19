/* engine/util.js — petits utilitaires partagés (aucune dépendance) */
(function (R) {
  'use strict';
  const U = {};

  U.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Mini-balisage : **gras**, ___ (trou), retours à la ligne.
  U.rich = (s) => U.esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/___/g, '<span class="blank"></span>').replace(/\n/g, '<br>');

  U.el = function (tag, props, ...kids) {
    const e = document.createElement(tag);
    if (props) {
      for (const k in props) {
        const v = props[k];
        if (v == null || v === false) continue;
        if (k === 'class') e.className = v;
        else if (k === 'html') e.innerHTML = v;
        else if (k === 'text') e.textContent = v;
        else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
        else e.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const c of kids.flat(Infinity)) {
      if (c == null || c === false) continue;
      e.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return e;
  };

  U.shuffle = function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Comparaison de textes : minuscules, sans accents, sans ponctuation, espaces normalisés.
  U.clean = (s) => String(s).toLowerCase().replace(/[¿?¡!.,;:«»"“”]/g, '').replace(/\s+/g, ' ').trim();
  U.norm = (s) => U.clean(s).normalize('NFD').replace(/[̀-ͯ]/g, '');

  // "20 %", "0,5", " 150 mL" -> nombre. Refuse s'il y a plusieurs nombres.
  U.parseNum = function (s) {
    const t = String(s).replace(/ /g, ' ').replace(/(\d)\s+(?=\d{3}\b)/g, '$1').replace(/,/g, '.');
    const m = t.match(/-?\d+(?:\.\d+)?/g);
    if (!m || m.length !== 1) return null;
    return parseFloat(m[0]);
  };

  U.firstSentence = function (s) {
    const m = String(s).match(/^.*?[.!?](?=\s|$)/);
    return m ? m[0] : s;
  };

  // Horloge remplaçable (tests / démonstration)
  R.clockFn = () => Date.now();
  U.now = () => R.clockFn();
  R.setClock = (fn) => { R.clockFn = fn; };

  U.dayKey = function (ts) {
    const d = new Date(ts);
    const p = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  };
  U.DAY = 86400000;

  U.pct = (x) => Math.round(x * 100);
  U.lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);
  U.uid = () => Math.random().toString(36).slice(2, 9);

  R.util = U;
})((window.R = window.R || {}));
