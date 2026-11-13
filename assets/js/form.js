/* WoodRay — форма заявки: реальная отправка на серверный endpoint.
   Заменяет блок «request form» в оболочке «СУХОВЕЙ». */

(function () {
  "use strict";

  var form = document.getElementById("subscribeForm");
  if (!form) return;

  var errorEl = document.getElementById("emailError");
  var okEl = document.getElementById("emailOk");
  var nameEl = document.getElementById("name");
  var phoneEl = document.getElementById("phone");
  var emailEl = document.getElementById("email");
  var submitBtn = form.querySelector('button[type="submit"]');

  var ENDPOINT = form.getAttribute("data-endpoint") || "/api/lead";

  function showError(message, field) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    form.classList.add("has-error");
    if (field) field.setAttribute("aria-invalid", "true");
  }

  function clearError() {
    errorEl.hidden = true;
    form.classList.remove("has-error");
    [nameEl, phoneEl, emailEl].forEach(function (el) {
      if (el) el.removeAttribute("aria-invalid");
    });
  }

  function fail(message) {
    showError(message, null);
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Отправить";
    }
  }

  function success(message) {
    clearError();
    form.reset();
    okEl.textContent = message || "Спасибо, заявка принята. Свяжемся с вами в рабочее время.";
    okEl.hidden = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Отправить";
    }
  }

  function validate() {
    var name = (nameEl.value || "").trim();
    var phone = (phoneEl.value || "").trim();
    var email = (emailEl.value || "").trim();

    if (!name) return ["Укажите имя.", nameEl];
    if (!phone) return ["Укажите телефон — по нему быстрее ответить.", phoneEl];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return ["Проверьте e-mail: нужен вид name@company.ru.", emailEl];
    }
    return null;
  }

  [nameEl, phoneEl, emailEl].forEach(function (el) {
    if (el) el.addEventListener("input", clearError);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    okEl.hidden = true;

    var bad = validate();
    if (bad) {
      showError(bad[0], bad[1]);
      bad[1].focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Отправляем…";
    }

    var payload = new FormData();
    payload.append("name", nameEl.value.trim());
    payload.append("phone", phoneEl.value.trim());
    payload.append("email", emailEl.value.trim());
    // honeypot — скрытое поле, которое заполнит только бот
    payload.append("website", "");

    fetch(ENDPOINT, {
      method: "POST",
      body: payload,
      headers: { Accept: "application/json" },
    })
      .then(function (response) {
        return response
          .json()
          .catch(function () {
            return {};
          })
          .then(function (body) {
            if (response.ok) {
              success(body.message);
            } else {
              fail(body.message || "Не удалось отправить заявку. Позвоните нам, пожалуйста.");
            }
          });
      })
      .catch(function () {
        fail("Сеть недоступна. Позвоните нам или напишите на почту — контакты в подвале.");
      });
  });
})();
