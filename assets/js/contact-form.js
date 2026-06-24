/* Sendet das Formular per E-Mail-Weiterleitung ueber FormSubmit.co
   (https://formsubmit.co/ajax/<email>) - kein Account-Signup noetig,
   nur die Ziel-E-Mail-Adresse im data-endpoint der <form> muss stimmen.
   Beim allerersten Absenden schickt FormSubmit eine Bestaetigungsmail
   an diese Adresse, die einmalig bestaetigt werden muss. */
(function () {
  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var status = form.querySelector(".form-status");
  var endpoint = form.getAttribute("data-endpoint");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!endpoint || endpoint.indexOf("REPLACE_WITH") !== -1) {
      status.dataset.state = "error";
      status.textContent = status.getAttribute("data-msg-noendpoint") || "Formular noch nicht aktiv.";
      return;
    }

    var submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;

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
        } else {
          throw new Error("Request failed");
        }
      })
      .catch(function () {
        status.dataset.state = "error";
        status.textContent = status.getAttribute("data-msg-error") || "Etwas ist schiefgelaufen.";
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
})();
