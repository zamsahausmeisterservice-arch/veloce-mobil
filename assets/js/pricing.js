/* Fahrzeuggroessen-Umschalter fuer die 3 Tarif-Karten (Basis/
   Standard/Premium): wechselt Preis + Dauer je Karte mit einer
   kurzen Fade-Animation statt eines Tabellen-Umbaus. */
(function () {
  var toggle = document.querySelector("[data-pricing-toggle]");
  var cards = document.querySelectorAll("[data-pricing-card]");
  if (!toggle || !cards.length) return;

  var prices = JSON.parse(toggle.getAttribute("data-prices") || "{}");
  var buttons = toggle.querySelectorAll("button");

  function applySize(size) {
    cards.forEach(function (card) {
      var tier = card.getAttribute("data-pricing-card");
      var data = prices[size] && prices[size][tier];
      if (!data) return;

      var amountEl = card.querySelector("[data-price]");
      var durationEl = card.querySelector("[data-duration]");

      amountEl.classList.add("is-updating");
      durationEl.classList.add("is-updating");

      setTimeout(function () {
        amountEl.textContent = data[0];
        durationEl.textContent = data[1];
        amountEl.classList.remove("is-updating");
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
