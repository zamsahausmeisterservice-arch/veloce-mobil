/* "Magnetischer" Button: folgt der Maus innerhalb eines kleinen
   Radius und federt beim Verlassen zurueck (Vorbild: motion-footer
   "Magnetic Button"-Primitive, hier ohne Physik-Bibliothek). */
(function () {
  var magnets = document.querySelectorAll("[data-magnetic]");
  if (!magnets.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  magnets.forEach(function (el) {
    var strength = 0.35;

    el.addEventListener("mousemove", function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - (rect.left + rect.width / 2);
      var y = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = "translate(" + x * strength + "px, " + y * strength + "px)";
    });

    el.addEventListener("mouseleave", function () {
      el.style.transform = "translate(0, 0)";
    });
  });
})();
