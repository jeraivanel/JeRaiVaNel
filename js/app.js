/* js for complete-journey.html, journey-details.html, about.html */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const store = {
    get(k, d) { try { const v = localStorage.getItem('jrvl.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('jrvl.' + k, JSON.stringify(v)); } catch (e) {} }
  };

  // Journey types: label + whether images/sticker-<type>.gif exists
  const TYPES = {
    scenic:    { label: 'Scenic',    sticker: true },
    foodie:    { label: 'Foodie',    sticker: true },
    adventure: { label: 'Adventure' },
    photo:     { label: 'Photo' },
    fast:      { label: 'Fast' },
    budget:    { label: 'Budget',    sticker: true }
  };

  const peso = n => 'P' + n.toLocaleString('en-US') + '.00';
  const fmtLong = m => {
    const h = Math.floor(m / 60), mm = m % 60, parts = [];
    if (h) parts.push(h + (h === 1 ? ' hour' : ' hours'));
    if (mm || !h) parts.push(mm + (mm === 1 ? ' minute' : ' minutes'));
    return parts.join(' ');
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const page = document.body.dataset.page;

  // Back buttons
  $$('[data-back]').forEach(a => a.addEventListener('click', e => { if (history.length > 1) { e.preventDefault(); history.back(); } }));

  const getHistory = () => store.get('history', []);

  // Works with 'scenic' or 'Scenic'
  const sticker = t => {
    const key = String(t).toLowerCase(), T = TYPES[key];
    if (!T) return '<b>' + esc(t) + '</b>';
    return T.sticker ? `<img src="images/sticker-${key}.gif" alt="${T.label}">` : `<b>${T.label}</b>`;
  };

  const pages = {

    complete() {
      const h = getHistory(), e = h.find(j => j.id === store.get('last')) || h[0], m = $('#rating-msg');
      if (!e) { $('#completed-place').textContent = '-'; m.textContent = 'No finished journey yet. Plan one first!'; return; }
      $('#completed-place').textContent = e.dest;
      $('#view-link').href = 'journey-details.html?id=' + e.id;
      const stars = $$('.star'), show = n => stars.forEach((s, i) => s.classList.toggle('on', i < n));
      show(e.rating); if (e.rating) m.textContent = 'You rated this ' + e.rating + ' / 5';
      stars.forEach((s, i) => {
        s.addEventListener('mouseenter', () => show(i + 1));
        s.addEventListener('mouseleave', () => show(e.rating));
        s.addEventListener('click', () => { e.rating = i + 1; store.set('history', h); show(e.rating); m.textContent = 'Thank you! You rated this ' + e.rating + ' / 5'; });
      });
    },

    details() {
      const h = getHistory(), id = Number(new URLSearchParams(location.search).get('id')) || store.get('last');
      const e = h.find(j => j.id === id) || h[0];
      if (!e) { $('#dt-time').textContent = '-'; $('#dt-dist').textContent = '-'; $('#dt-places').innerHTML = '<p class="empty">No journeys yet. Finish one to see its details here.</p>'; return; }
      $('#dt-time').textContent = fmtLong(e.mins); $('#dt-dist').textContent = e.km + ' kilometers';
      $('#dt-route').textContent = e.start + '  \u2192  ' + e.dest + '   |   ' + peso(e.cost); $('#dt-badge').innerHTML = sticker(e.type);
      $('#dt-places').innerHTML = e.stops.map(s => `<li class="polaroid"><img src="${s.img}" alt="${esc(s.name)}"><p>${esc(s.name)}</p><i></i></li>`).join('');
    }

  };

  if (pages[page]) pages[page]();
})();