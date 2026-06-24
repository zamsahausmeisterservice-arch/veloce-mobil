/* Klick-Info-Karten: oeffnet/schliesst per Klick (nicht nur Hover,
   damit es auch auf Touch-Geraeten funktioniert), schliesst beim
   Klick ausserhalb oder beim Oeffnen einer anderen Karte. */
(function () {
  var triggers = document.querySelectorAll("[data-info-trigger]");
  if (!triggers.length) return;

  function closeAll(except) {
    triggers.forEach(function (t) {
      if (t === except) return;
      t.setAttribute("aria-expanded", "false");
      var card = document.getElementById(t.getAttribute("aria-controls"));
      if (card) card.classList.remove("is-open");
    });
  }

  triggers.forEach(function (trigger) {
    var card = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!card) return;

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = trigger.getAttribute("aria-expanded") === "true";
      closeAll(trigger);
      trigger.setAttribute("aria-expanded", isOpen ? "false" : "true");
      card.classList.toggle("is-open", !isOpen);
    });
  });

  document.addEventListener("click", function () { closeAll(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAll();
  });
})();
