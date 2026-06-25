/* Fahrzeuggroessen-Umschalter fuer die 3 Tarif-Karten (Basis/
   Standard/Premium): die Zahl rollt beim Wechsel sanft vom alten
   zum neuen Preis (statt Fade), die Dauer wechselt kurz ueberblendet. */
(function () {
  var toggle = document.querySelector("[data-pricing-toggle]");
  var cards = document.querySelectorAll("[data-pricing-card]");
  if (!toggle || !cards.length) return;

  var prices = JSON.parse(toggle.getAttribute("data-prices") || "{}");
  var buttons = toggle.querySelectorAll("button");

  function animateNumber(el, from, to, duration) {
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (from + (to - from) * eased).toFixed(2);
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = to.toFixed(2);
      }
    }
    requestAnimationFrame(step);
  }

  function applySize(size) {
    cards.forEach(function (card) {
      var tier = card.getAttribute("data-pricing-card");
      var data = prices[size] && prices[size][tier];
      if (!data) return;

      var amountEl = card.querySelector("[data-price]");
      var durationEl = card.querySelector("[data-duration]");
      var from = parseFloat(amountEl.textContent) || 0;

      animateNumber(amountEl, from, data[0], 500);

      durationEl.classList.add("is-updating");
      setTimeout(function () {
        durationEl.textContent = data[1];
        durationEl.classList.remove("is-updating");
      }, 160);
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      buttons.forEach(function (b) { b.setAttribute("aria-selected", "false"); });
      btn.setAttribute("aria-selected", "true");
      applySize(btn.getAttribute("data-size"));
    });
  });
})();
