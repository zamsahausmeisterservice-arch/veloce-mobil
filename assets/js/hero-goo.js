/* Cycelt die Hero-Ueberschrift endlos durch mehrere Phrasen, jede
   loest sich aus einem "goo"-Blob heraus auf und verschwindet nach
   ein paar Sekunden wieder darin (SVG-Filter #hero-goo). Start ist
   an das Wegschieben des Preloaders gekoppelt. */
(function () {
  var el = document.querySelector("[data-hero-morph]");
  var blur = document.querySelector("#hero-goo feGaussianBlur");
  if (!el || !blur) return;

  var phrases = JSON.parse(el.getAttribute("data-phrases") || "[]");
  var accents = JSON.parse(el.getAttribute("data-accent") || "[]");
  if (!phrases.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = phrases.join(" ");
    return;
  }

  var holdTime = 1800;
  var transitionTime = 450;
  var index = 0;

  function setPhrase(i) {
    el.textContent = phrases[i];
    el.classList.toggle("is-accent", !!accents[i]);
  }

  function animateBlur(from, to, duration, onDone) {
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      blur.setAttribute("stdDeviation", (from + (to - from) * p).toFixed(2));
      if (p < 1) {
        requestAnimationFrame(step);
      } else if (onDone) {
        onDone();
      }
    }
    requestAnimationFrame(step);
  }

  function cycle() {
    animateBlur(0, 12, transitionTime, function () {
      index = (index + 1) % phrases.length;
      setPhrase(index);
      animateBlur(12, 0, transitionTime, function () {
        setTimeout(cycle, holdTime);
      });
    });
  }

  function start() {
    setPhrase(0);
    animateBlur(12, 0, transitionTime, function () {
      setTimeout(cycle, holdTime);
    });
  }

  var pre = document.querySelector("[data-preloader]");
  if (!pre) {
    start();
    return;
  }
  if (pre.classList.contains("is-leaving")) {
    start();
    return;
  }

  var observer = new MutationObserver(function () {
    if (!document.body.contains(pre) || pre.classList.contains("is-leaving")) {
      observer.disconnect();
      start();
    }
  });
  observer.observe(document.body, { childList: true });
  observer.observe(pre, { attributes: true, attributeFilter: ["class"] });
})();
