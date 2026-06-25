/* Ordnet die Karten im Stack neu: Klick auf die oberste Karte (oder
   "Weiter") schickt sie nach hinten, die naechste rutscht an die
   Spitze. Pfeile/Punkte erlauben gezielte Navigation. */
(function () {
  document.querySelectorAll("[data-card-stack]").forEach(function (root) {
    var cards = Array.from(root.querySelectorAll("[data-stack-card]"));
    var dotsWrap = root.querySelector("[data-stack-dots]");
    var prevBtn = root.querySelector("[data-stack-prev]");
    var nextBtn = root.querySelector("[data-stack-next]");
    if (!cards.length) return;

    var order = cards.map(function (_, i) { return i; });

    var dots = cards.map(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "card-stack__dot";
      dot.type = "button";
      dot.setAttribute("aria-label", "Schritt " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function layout() {
      order.forEach(function (cardIndex, pos) {
        var card = cards[cardIndex];
        var tilt = pos === 0 ? 0 : (pos % 2 === 0 ? -1 : 1) * (pos + 1) * 1.5;
        card.style.transform =
          "translateY(" + pos * 12 + "px) scale(" + (1 - pos * 0.045) + ") rotate(" + tilt + "deg)";
        card.style.zIndex = String(cards.length - pos);
        card.style.opacity = pos < 3 ? "1" : "0";
        card.style.pointerEvents = pos === 0 ? "auto" : "none";
      });
      dots.forEach(function (dot, i) { dot.classList.toggle("is-active", order[0] === i); });
    }

    function next() {
      order.push(order.shift());
      layout();
    }

    function prev() {
      order.unshift(order.pop());
      layout();
    }

    function goTo(i) {
      while (order[0] !== i) order.push(order.shift());
      layout();
    }

    cards.forEach(function (card, i) {
      card.addEventListener("click", function (e) {
        if (e.target.closest(".info-trigger, .info-card")) return;
        if (order[0] === i) next();
      });
    });

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    layout();
  });
})();
