/* Faechert die Video-Karten um die aktive Karte herum an, mit
   elastischem Uebergang (siehe CSS-easing), Hover-Spread und
   zirkulaerer Navigation per Pfeilen/Punkten/Kartenklick. */
(function () {
  document.querySelectorAll("[data-fan-carousel]").forEach(function (root) {
    var cards = Array.from(root.querySelectorAll("[data-fan-card]"));
    var dotsWrap = root.querySelector("[data-fan-dots]");
    var prevBtn = root.querySelector("[data-fan-prev]");
    var nextBtn = root.querySelector("[data-fan-next]");
    if (!cards.length) return;

    var active = 0;
    var hovering = false;

    var dots = cards.map(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "fan-carousel__dot";
      dot.type = "button";
      dot.setAttribute("aria-label", "Video " + (i + 1));
      dot.addEventListener("click", function () { setActive(i); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    cards.forEach(function (card, i) {
      card.addEventListener("click", function () {
        if (i !== active) setActive(i);
      });
    });

    function layout() {
      var n = cards.length;
      cards.forEach(function (card, i) {
        var offset = i - active;
        if (offset > n / 2) offset -= n;
        if (offset < -n / 2) offset += n;

        var spread = hovering ? 1.5 : 1;
        var rotate = offset * 10 * spread;
        var translateX = offset * 85 * spread;
        var translateY = Math.abs(offset) * 16;
        var scale = offset === 0 ? 1 : Math.max(0.74, 1 - Math.abs(offset) * 0.12);
        var visible = Math.abs(offset) <= 2;

        card.style.transform =
          "translate(" + translateX + "px," + translateY + "px) rotate(" + rotate + "deg) scale(" + scale + ")";
        card.style.zIndex = String(10 - Math.abs(offset));
        card.style.opacity = visible ? "1" : "0";
        card.classList.toggle("is-active", offset === 0);
      });
      dots.forEach(function (dot, i) { dot.classList.toggle("is-active", i === active); });
    }

    function setActive(i) {
      active = ((i % cards.length) + cards.length) % cards.length;
      layout();
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { setActive(active - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { setActive(active + 1); });
    root.addEventListener("mouseenter", function () { hovering = true; layout(); });
    root.addEventListener("mouseleave", function () { hovering = false; layout(); });

    layout();
  });
})();
