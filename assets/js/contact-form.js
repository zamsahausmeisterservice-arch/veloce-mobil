/* Slide-to-Send-Button (siehe assets/css/slide-submit.css): der
   Griff wird gezogen statt einen normalen Button zu klicken. Ab 85%
   Weg wird die Anfrage per FormSubmit.co (kein Account-Signup
   noetig, nur die Ziel-E-Mail-Adresse im data-endpoint der <form>
   muss stimmen) abgeschickt. Beim allerersten Absenden schickt
   FormSubmit eine Bestaetigungsmail an diese Adresse, die einmalig
   bestaetigt werden muss. */
(function () {
  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var status = form.querySelector(".form-status");
  var endpoint = form.getAttribute("data-endpoint");
  var slider = form.querySelector("[data-slide-submit]");
  var handle = form.querySelector("[data-slide-handle]");
  var fill = form.querySelector("[data-slide-fill]");
  if (!slider || !handle || !fill) return;

  var dragging = false;
  var startX = 0;
  var handleX = 0;
  var maxX = 0;
  var locked = false;
  var threshold = 0.85;

  function trackWidth() {
    return slider.clientWidth - handle.offsetWidth - 6;
  }

  function setHandle(x) {
    handleX = Math.max(0, Math.min(x, maxX));
    handle.style.transform = "translateX(" + handleX + "px)";
    fill.style.width = (handleX + handle.offsetWidth / 2) + "px";
  }

  function reset() {
    maxX = trackWidth();
    setHandle(0);
  }

  function onPointerDown(e) {
    if (locked) return;
    maxX = trackWidth();
    dragging = true;
    startX = e.clientX - handleX;
    handle.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    setHandle(e.clientX - startX);
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    if (maxX > 0 && handleX >= maxX * threshold) {
      submit();
    } else {
      setHandle(0);
    }
  }

  handle.addEventListener("pointerdown", onPointerDown);
  handle.addEventListener("pointermove", onPointerMove);
  handle.addEventListener("pointerup", onPointerUp);
  handle.addEventListener("pointercancel", onPointerUp);

  handle.addEventListener("keydown", function (e) {
    if (locked) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      submit();
    }
  });

  window.addEventListener("resize", function () {
    if (!locked) reset();
  });

  function submit() {
    if (!form.checkValidity()) {
      form.reportValidity();
      setHandle(0);
      return;
    }

    locked = true;
    maxX = trackWidth();
    setHandle(maxX);
    slider.classList.add("is-loading");

    if (!endpoint || endpoint.indexOf("REPLACE_WITH") !== -1) {
      status.dataset.state = "error";
      status.textContent = status.getAttribute("data-msg-noendpoint") || "Formular noch nicht aktiv.";
      finish(false);
      return;
    }

    fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form)
    })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          status.dataset.state = "success";
          status.textContent = status.getAttribute("data-msg-success") || "Danke, wir melden uns!";
          finish(true);
        } else {
          throw new Error("Request failed");
        }
      })
      .catch(function () {
        status.dataset.state = "error";
        status.textContent = status.getAttribute("data-msg-error") || "Etwas ist schiefgelaufen.";
        finish(false);
      });
  }

  function finish(success) {
    slider.classList.remove("is-loading");
    slider.classList.add(success ? "is-success" : "is-error");
    setTimeout(function () {
      slider.classList.remove("is-success", "is-error");
      locked = false;
      reset();
    }, 2200);
  }

  reset();
})();
