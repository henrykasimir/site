/* Theme toggle. The initial value is set by the inline script in each page's
   head, so this only handles clicks and storage. */
(function () {
  var root = document.documentElement;
  var buttons = document.querySelectorAll('.theme-toggle');
  if (!buttons.length) return;

  Array.prototype.forEach.call(buttons, function (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  });
})();

/* Show the rest of the bio on the homepage. */
(function () {
  var btn = document.querySelector('.more-toggle');
  var more = document.querySelector('.bio-more');
  if (!btn || !more) return;

  btn.addEventListener('click', function () {
    var open = !more.hidden;
    more.hidden = open;
    btn.textContent = open ? 'More' : 'Less';
  });
})();

/* Show the essay title in the top bar once the h1 has scrolled out of view. */
(function () {
  var running = document.querySelector('.running-title');
  var h1 = document.querySelector('article h1');
  if (!running || !h1 || !('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    running.classList.toggle('visible', !entries[0].isIntersecting);
  }, { rootMargin: '-70px 0px 0px 0px' });

  observer.observe(h1);
})();

/* Highlight the current section in the contents rail. */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.contents a'));
  var targets = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  if (!targets.length || !('IntersectionObserver' in window)) return;

  var seen = new Map();
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { seen.set(e.target, e.isIntersecting); });
    var currentIndex = -1;
    targets.forEach(function (t, i) { if (seen.get(t) && currentIndex === -1) currentIndex = i; });
    if (currentIndex === -1) return;
    links.forEach(function (a, i) { a.classList.toggle('current', i === currentIndex); });
  }, { rootMargin: '-20% 0px -70% 0px' });

  targets.forEach(function (t) { observer.observe(t); });
})();
