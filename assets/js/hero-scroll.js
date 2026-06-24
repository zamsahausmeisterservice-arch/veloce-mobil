/* Beim Herunterscrollen fährt das Auto im Hero von rechts nach links,
   proportional dazu wie weit der Hero-Bereich schon durchgescrollt ist. */
(function () {
  var hero = document.querySelector(".hero");
  var car = document.querySelector(".hero__car-img");
  if (!hero || !car) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var maxShiftVw = 70;
  var ticking = false;

  function update() {
    var heroHeight = hero.offsetHeight;
    var progress = -hero.getBoundingClientRect().top / heroHeight;
    progress = Math.min(Math.max(progress, 0), 1);
    car.style.transform = "translateX(-" + (progress * maxShiftVw) + "vw)";
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
