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
