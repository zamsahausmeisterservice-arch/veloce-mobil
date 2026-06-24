/* 3D-Tilt-Karten: Rotation + Glanz-Position folgen der Mausposition
   relativ zur Kachel. Deaktiviert bei reduced-motion und Touch,
   damit es auf Mobilgeraeten nicht haengen bleibt. */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  var MAX_DEG = 7;
  var cards = document.querySelectorAll("[data-tilt]");

  cards.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;

      var ry = (px - 0.5) * MAX_DEG * 2;
      var rx = (0.5 - py) * MAX_DEG * 2;

      card.classList.add("is-tilting");
      card.style.setProperty("--rx", rx.toFixed(2) + "deg");
      card.style.setProperty("--ry", ry.toFixed(2) + "deg");
      card.style.setProperty("--tilt-scale", "1.015");
      card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
    });

    card.addEventListener("mouseleave", function () {
      card.classList.remove("is-tilting");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--tilt-scale", "1");
    });
  });
})();
