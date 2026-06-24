(function () {
  var LANGS = ["de", "fr", "it", "en"];
  var switchEl = document.querySelector(".lang-switch");
  if (!switchEl) return;

  var trigger = switchEl.querySelector(".lang-switch__current");
  var menu = switchEl.querySelector(".lang-switch__menu");

  trigger.addEventListener("click", function (e) {
    e.stopPropagation();
    var isOpen = switchEl.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.addEventListener("click", function () {
    switchEl.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  });

  menu.querySelectorAll("a[data-lang]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetLang = link.getAttribute("data-lang");
      if (LANGS.indexOf(targetLang) === -1) return;
      e.preventDefault();

      var parts = window.location.pathname.split("/").filter(Boolean);
      if (parts.length && LANGS.indexOf(parts[0]) !== -1) {
        parts[0] = targetLang;
      } else {
        parts.unshift(targetLang);
      }

      var newPath = "/" + parts.join("/") + "/";
      window.location.href = newPath + window.location.hash;
    });
  });
})();
