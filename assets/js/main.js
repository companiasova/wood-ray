(function () {
  "use strict";

  /* --- sticky header state --- */
  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    header.classList.toggle("is-stuck", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* --- mobile navigation --- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("primaryNav");

  var closeNav = function () {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Меню");
  };

  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Меню");
  });

  nav.addEventListener("click", function (event) {
    if (event.target.tagName === "A") closeNav();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeNav();
  });

  document.addEventListener("click", function (event) {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target) || burger.contains(event.target)) return;
    closeNav();
  });

  /* --- horizontal carousels --- */
  var scrollers = document.querySelectorAll("[data-scroll]");
  scrollers.forEach(function (button) {
    button.addEventListener("click", function () {
      var target = document.getElementById(button.getAttribute("data-scroll"));
      if (!target) return;
      var card = target.querySelector(":scope > *");
      var step = card ? card.getBoundingClientRect().width + 12 : 300;
      target.scrollBy({ left: step * Number(button.getAttribute("data-dir")), behavior: "smooth" });
    });
  });

  /* --- product finish swatches --- */
  document.querySelectorAll(".swatches").forEach(function (group) {
    group.addEventListener("click", function (event) {
      var swatch = event.target.closest(".swatch");
      if (!swatch) return;
      group.querySelectorAll(".swatch").forEach(function (item) {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });
      swatch.classList.add("is-active");
      swatch.setAttribute("aria-pressed", "true");
    });
  });

  /* --- request form ---
     Обработчик формы вынесен в assets/js/form.js —
     он делает реальную отправку на сервер. */

  /* --- series banner --- */
  var banner = document.getElementById("seriesBanner");
  if (banner) {
    var series = [
      {
        title: "Серия К-40: сорок футов",
        text: "36 м³ за цикл, двери с торца, площадка 12 метров. Приезжает на трале целиком — кран не нужен.",
        img: "assets/img/banner.jpg",
        alt: "Ряд контейнерных сушильных камер с изолированными дверями на бетонной площадке, штабели доски"
      },
      {
        title: "Серия К-20: двадцать футов",
        text: "18 м³ за цикл, площадка 6 × 3 метра. Самая частая первая камера на небольшом производстве.",
        img: "assets/img/cat-20.jpg",
        alt: "Двадцатифутовый контейнер-камера на щебёночной площадке лесопильного цеха"
      },
      {
        title: "Сдвоенный блок К-2×40",
        text: "72 м³ за цикл: два контейнера на общей раме и одной автоматике. Дешевле, чем строить камеру на такой объём.",
        img: "assets/img/cat-double.jpg",
        alt: "Сдвоенный блок из двух контейнеров-камер на площадке у цеха"
      }
    ];

    var titleEl = banner.querySelector("[data-series-title]");
    var textEl = banner.querySelector("[data-series-text]");
    var imgEl = banner.querySelector("[data-series-img]");
    var countEl = banner.querySelector("[data-series-count]");
    var index = 0;
    var timer = null;

    var render = function () {
      var item = series[index];
      banner.classList.add("is-fading");
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        titleEl.textContent = item.title;
        textEl.textContent = item.text;
        imgEl.src = item.img;
        imgEl.alt = item.alt;
        if (countEl) countEl.textContent = index + 1 + " / " + series.length;
        banner.classList.remove("is-fading");
      }, 220);
    };

    banner.querySelectorAll("[data-series-dir]").forEach(function (button) {
      button.addEventListener("click", function () {
        var dir = Number(button.getAttribute("data-series-dir"));
        index = (index + dir + series.length) % series.length;
        render();
      });
    });
  }

  /* --- chat shortcut --- */
  var chatBtn = document.getElementById("chatBtn");
  if (chatBtn) {
    chatBtn.addEventListener("click", function () {
      document.getElementById("request").scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(function () {
        if (input) input.focus({ preventScroll: true });
      }, 500);
    });
  }

  /* --- gentle reveal on scroll --- */
  var targets = document.querySelectorAll(
    ".card, .panel, .banner, .why-item, .quote, .subscribe, .strip-item"
  );

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  targets.forEach(function (element) {
    element.classList.add("reveal");
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var index = Array.prototype.indexOf.call(
          entry.target.parentElement.children,
          entry.target
        );
        entry.target.style.transitionDelay = Math.min(index, 4) * 55 + "ms";
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.15 }
  );

  targets.forEach(function (element) {
    observer.observe(element);
  });

  /* --- year --- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
