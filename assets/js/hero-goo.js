/* Loest die Hero-Ueberschrift beim Erscheinen aus einem "goo"-Blob
   heraus auf (SVG-Filter #hero-goo, Basis-Blur per CSS in hero.css).
   Startet, sobald der Preloader sich wegschiebt (Klasse "is-leaving"),
   damit die Aufloesung mit dem Sichtbarwerden synchron lauft. */
(function () {
  var heading = document.querySelector(".hero__text h1");
  var blur = document.querySelector("#hero-goo feGaussianBlur");
  if (!heading || !blur) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heading.style.filter = "none";
    return;
  }

  var duration = 900;
  var started = false;

  function run() {
    if (started) return;
    started = true;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      blur.setAttribute("stdDeviation", (12 * (1 - progress)).toFixed(2));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        heading.style.filter = "none";
      }
    }

    requestAnimationFrame(step);
  }

  var pre = document.querySelector("[data-preloader]");
  if (!pre) {
    run();
    return;
  }

  if (pre.classList.contains("is-leaving")) {
    run();
    return;
  }

  var observer = new MutationObserver(function () {
    if (!document.body.contains(pre) || pre.classList.contains("is-leaving")) {
      observer.disconnect();
      run();
    }
  });
  observer.observe(document.body, { childList: true });
  observer.observe(pre, { attributes: true, attributeFilter: ["class"] });
})();
