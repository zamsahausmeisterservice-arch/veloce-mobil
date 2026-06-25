/* Bewegt den Pill-Indikator zum angeklickten Tab und blendet das
   zugehoerige Panel ein. */
(function () {
  document.querySelectorAll("[data-tabs]").forEach(function (root) {
    var triggers = Array.from(root.querySelectorAll("[data-tab-trigger]"));
    var panels = Array.from(root.querySelectorAll("[data-tab-panel]"));
    var indicator = root.querySelector("[data-tab-indicator]");
    if (!triggers.length || !indicator) return;

    function moveIndicator(tab) {
      indicator.style.transform = "translateX(" + tab.offsetLeft + "px)";
      indicator.style.width = tab.offsetWidth + "px";
    }

    function activate(tab) {
      triggers.forEach(function (t) { t.setAttribute("aria-selected", String(t === tab)); });
      var target = tab.getAttribute("data-tab-target");
      panels.forEach(function (p) {
        p.classList.toggle("is-active", p.getAttribute("data-tab-panel") === target);
      });
      moveIndicator(tab);
    }

    triggers.forEach(function (tab) {
      tab.addEventListener("click", function () { activate(tab); });
    });

    function currentActive() {
      return triggers.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || triggers[0];
    }

    requestAnimationFrame(function () { moveIndicator(currentActive()); });
    window.addEventListener("resize", function () { moveIndicator(currentActive()); });
  });
})();
