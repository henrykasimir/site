/* ---------------------------------------------------------------
   Dark and light toggle.
   The starting value is set by the inline script in each page head
   so the page never flashes the wrong colours.
   --------------------------------------------------------------- */
(function () {
  var root = document.documentElement;
  var box = document.querySelector('.toggle-checkbox');
  var label = document.querySelector('.toggle-label');
  if (!box) return;

  box.checked = root.getAttribute('data-theme') === 'dark';

  // The knob only animates after the first paint, as on the reference site.
  window.setTimeout(function () {
    if (label) label.classList.add('has-transition');
  }, 100);

  box.addEventListener('change', function () {
    var next = box.checked ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

/* ---------------------------------------------------------------
   Contents rail, built from the headings in the article.
   Add or rename a heading and the rail updates itself.
   --------------------------------------------------------------- */
(function () {
  var content = document.querySelector('[data-toc-contents]');
  var list = document.querySelector('[data-toc-list]');
  if (!content || !list) return;

  function slug(text) {
    return text.toLowerCase().trim()
      .replace(/[\u2018\u2019'"]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  var headings = Array.prototype.slice.call(content.querySelectorAll('h2, h3'));
  if (!headings.length) return;

  headings.forEach(function (h) {
    if (!h.id) h.id = slug(h.textContent);

    var li = document.createElement('li');
    if (h.tagName === 'H3') li.className = 'cc-sub';

    var a = document.createElement('a');
    a.className = 'toc-link';
    a.href = '#' + h.id;
    a.textContent = h.textContent.trim();

    li.appendChild(a);
    list.appendChild(li);
  });

  var links = Array.prototype.slice.call(list.querySelectorAll('.toc-link'));
  if (!('IntersectionObserver' in window)) return;

  var seen = new Map();
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { seen.set(e.target, e.isIntersecting); });
    var current = -1;
    headings.forEach(function (h, i) { if (seen.get(h) && current === -1) current = i; });
    if (current === -1) return;
    links.forEach(function (a, i) { a.classList.toggle('cc-active', i === current); });
  }, { rootMargin: '-15% 0px -70% 0px' });

  headings.forEach(function (h) { observer.observe(h); });
})();

/* Contents rail open and close on narrow screens. */
(function () {
  var btn = document.querySelector('.toc-toggle');
  var nav = document.querySelector('.toc-container');
  if (!btn || !nav) return;

  btn.addEventListener('click', function () {
    nav.classList.toggle('cc-open');
    var open = nav.classList.contains('cc-open');
    btn.querySelector('.cc-close').style.display = open ? 'block' : 'none';
    btn.querySelector('.cc-hamburger').style.display = open ? 'none' : 'block';
  });

  nav.addEventListener('click', function (e) {
    if (e.target.classList.contains('toc-link')) nav.classList.remove('cc-open');
  });
})();

/* ---------------------------------------------------------------
   Footnotes. Numbered markers in the text link down to the list,
   the list gets return arrows, and hovering a marker shows the note.
   Write <sup>1</sup> in the body and the matching <li> in the list.
   --------------------------------------------------------------- */
(function () {
  var body = document.querySelector('[data-footnotes="body"]');
  var listWrap = document.querySelector('[data-footnotes="list"]');
  if (!body || !listWrap) return;

  var items = listWrap.querySelectorAll('ol > li');
  if (!items.length) return;

  var sups = Array.prototype.slice.call(body.querySelectorAll('.rich-text sup'));

  sups.forEach(function (sup) {
    var n = parseInt(sup.textContent.trim(), 10);
    var li = items[n - 1];
    if (!n || !li) return;

    sup.id = 'fnref-' + n;
    li.id = 'fn-' + n;

    var link = document.createElement('a');
    link.href = '#fn-' + n;
    link.className = 'footnote-ref';
    link.textContent = n;

    var tip = document.createElement('span');
    tip.className = 'footnote-tooltip';
    tip.innerHTML = li.innerHTML;

    sup.textContent = '';
    sup.appendChild(link);
    sup.appendChild(tip);

    var back = document.createElement('a');
    back.href = '#fnref-' + n;
    back.className = 'footnote-backref';
    back.innerHTML = '&#8617;';
    li.appendChild(document.createTextNode(' '));
    li.appendChild(back);
  });
})();

/* The intro expander. It only matters on phones, where the CSS shows the
   link. On wider screens the CSS forces the extra paragraphs open. */
(function () {
  var btn = document.querySelector('.home-intro_expand-link');
  var content = document.querySelector('.home-intro_expand-content');
  if (!btn || !content) return;

  btn.addEventListener('click', function () {
    var open = !content.hidden;
    content.hidden = open;
    btn.textContent = open ? 'More' : 'Less';
  });
})();
