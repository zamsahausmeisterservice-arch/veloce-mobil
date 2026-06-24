/* Nachbau von 21st.dev/ruixenui "arc-preloader-hero": Woerter cyclen
   nacheinander ein/aus, danach faehrt eine Flaeche mit geschwungener
   Kante (das SVG .preloader__panel) nach oben weg. Nur einmal pro
   Browser-Session (sessionStorage), reines Eintritts-Erlebnis. */
(function () {
  var pre = document.querySelector("[data-preloader]");
  if (!pre) return;

  if (sessionStorage.getItem("vmPreloaderShown")) {
    pre.remove();
    return;
  }
  sessionStorage.setItem("vmPreloaderShown", "1");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    pre.remove();
    return;
  }

  var wordEl = pre.querySelector("[data-preloader-word]");
  var words = JSON.parse(pre.getAttribute("data-words") || "[]");
  var html = document.documentElement;
  var i = 0;

  html.style.overflow = "hidden";

  function showWord() {
    wordEl.textContent = words[i];
    requestAnimationFrame(function () {
      wordEl.classList.add("is-visible");
    });
    i++;
    if (i < words.length) {
      setTimeout(function () {
        wordEl.classList.remove("is-visible");
        setTimeout(showWord, 200);
      }, 480);
    } else {
      setTimeout(leave, 480);
    }
  }

  function leave() {
    wordEl.classList.remove("is-visible");
    pre.classList.add("is-leaving");
    html.style.overflow = "";
    setTimeout(function () {
      pre.remove();
    }, 1000);
  }

  if (!words.length) {
    leave();
    return;
  }
  showWord();
})();
