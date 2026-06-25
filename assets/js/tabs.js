/* Bewegt den Pill-Indikator zum aktiven Tab und blendet das
   zugehoerige Panel ein. Wechselt automatisch alle paar Sekunden
   weiter, solange der Nutzer nicht selbst klickt (Klick setzt den
   Timer einfach zurueck). */
(function () {
  document.querySelectorAll("[data-tabs]").forEach(function (root) {
    var triggers = Array.from(root.querySelectorAll("[data-tab-trigger]"));
    var panels = Array.from(root.querySelectorAll("[data-tab-panel]"));
    var indicator = root.querySelector("[data-tab-indicator]");
    if (!triggers.length || !indicator) return;

    var autoDelay = 4500;
    var timer = null;

    function moveIndicator(tab) {
      indicator.style.transform = "translateX(" + tab.offsetLeft + "px)";
      indicator.style.width = tab.offsetWidth + "px";
    }

    function currentActive() {
      return triggers.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || triggers[0];
    }

    function activate(tab) {
      triggers.forEach(function (t) { t.setAttribute("aria-selected", String(t === tab)); });
      var target = tab.getAttribute("data-tab-target");
      panels.forEach(function (p) {
        p.classList.toggle("is-active", p.getAttribute("data-tab-panel") === target);
      });
      moveIndicator(tab);
    }

    function stopAuto() {
      if (timer) clearInterval(timer);
    }

    function startAuto() {
      stopAuto();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = setInterval(function () {
        var current = currentActive();
        var idx = triggers.indexOf(current);
        activate(triggers[(idx + 1) % triggers.length]);
      }, autoDelay);
    }

    triggers.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activate(tab);
        tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        startAuto();
      });
    });

    var listWrap = root.querySelector(".tabs__list-wrap");
    if (listWrap) listWrap.scrollLeft = 0;

    requestAnimationFrame(function () { moveIndicator(currentActive()); });
    window.addEventListener("resize", function () { moveIndicator(currentActive()); });

    startAuto();
  });
})();
