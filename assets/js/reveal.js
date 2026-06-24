/* Generisches Scroll-Reveal: jeder [data-reveal]-Container blendet
   seine direkten Kinder gestaffelt ein, sobald er in den Viewport
   scrollt (siehe assets/css/utilities.css fuer die Animation). */
(function () {
  var groups = document.querySelectorAll("[data-reveal]");
  if (!groups.length) return;

  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    groups.forEach(function (g) { g.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  groups.forEach(function (g) { observer.observe(g); });
})();
