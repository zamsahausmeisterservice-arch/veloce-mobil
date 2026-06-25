/* Ordnet die Testimonial-Karten im Stapel neu: Klick auf die
   oberste Karte schickt sie nach hinten, die naechste rutscht an
   die Spitze. */
(function () {
  document.querySelectorAll("[data-testimonial-stack]").forEach(function (root) {
    var cards = Array.from(root.querySelectorAll("[data-stack-card]"));
    if (!cards.length) return;

    var order = cards.map(function (_, i) { return i; });

    function layout() {
      order.forEach(function (cardIndex, pos) {
        var card = cards[cardIndex];
        var tilt = pos === 0 ? 0 : (pos % 2 === 0 ? -1 : 1) * (pos + 1) * 1.5;
        card.style.transform =
          "translateY(" + pos * 14 + "px) scale(" + (1 - pos * 0.05) + ") rotate(" + tilt + "deg)";
        card.style.zIndex = String(cards.length - pos);
        card.style.opacity = pos < 3 ? "1" : "0";
        card.style.pointerEvents = pos === 0 ? "auto" : "none";
      });
    }

    function next() {
      order.push(order.shift());
      layout();
    }

    cards.forEach(function (card, i) {
      card.addEventListener("click", function () {
        if (order[0] === i) next();
      });
    });

    layout();
  });
})();
