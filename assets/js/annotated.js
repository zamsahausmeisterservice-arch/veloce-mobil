/* Blendet die Callout-Karten der annotierten Auto-Grafik ein,
   sobald die Sektion in den Viewport scrollt. */
(function () {
  var el = document.querySelector("[data-annotated]");
  if (!el) return;

  if (!("IntersectionObserver" in window)) {
    el.classList.add("is-visible");
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(el);
})();
