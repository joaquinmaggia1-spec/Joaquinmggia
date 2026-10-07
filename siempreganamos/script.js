(function () {
  var C = window.CONFIG || {};
  var waUrl = "https://wa.me/" + C.numero + "?text=" + encodeURIComponent(C.mensaje || "");

  // Textos configurables
  document.querySelectorAll("[data-marca]").forEach(function (el) { el.textContent = C.marca; });
  document.querySelectorAll("[data-bono]").forEach(function (el) { el.textContent = C.bono; });
  document.getElementById("year").textContent = new Date().getFullYear();

  // Eventos de Meta Pixel
  function track(name, params, eventID) {
    if (typeof window.fbq === "function") {
      window.fbq("track", name, params || {}, eventID ? { eventID: eventID } : undefined);
    }
  }

  // Botones de WhatsApp: registran Contact + Lead y después redirigen.
  // Se navega en la misma pestaña tras una pausa corta para que el pixel
  // alcance a enviar el evento (funciona en el navegador interno de Instagram/Facebook).
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = waUrl;
    a.rel = "noopener";
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var id = "wa_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
      var params = { content_name: "WhatsApp CTA", content_category: a.dataset.cta || "cta" };
      track("Contact", params, id + "_c");
      track("Lead", params, id + "_l");
      setTimeout(function () { window.location.href = waUrl; }, 300);
    });
  });

  // ViewContent cuando el usuario llega a la sección del bono (señal de interés)
  var bono = document.getElementById("bono");
  if (bono && "IntersectionObserver" in window) {
    var vc = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { track("ViewContent", { content_name: "Bono bienvenida" }); vc.disconnect(); }
    }, { threshold: 0.4 });
    vc.observe(bono);
  }

  // Nav con fondo al scrollear
  var nav = document.getElementById("nav");
  var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 30); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Animaciones de entrada
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Fichas flotantes en el hero
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var host = document.getElementById("heroFx");
    var suits = ["♠", "♥", "♦", "♣"];
    var n = window.innerWidth < 720 ? 6 : 12;
    for (var i = 0; i < n; i++) {
      var c = document.createElement("span");
      var size = 40 + Math.random() * 60;
      c.className = "chip" + (i % 4 === 1 || i % 4 === 2 ? " red" : "");
      c.textContent = suits[i % 4];
      c.style.width = c.style.height = size + "px";
      c.style.fontSize = size * 0.42 + "px";
      c.style.left = Math.random() * 100 + "%";
      c.style.animationDuration = 14 + Math.random() * 14 + "s";
      c.style.animationDelay = -Math.random() * 20 + "s";
      host.appendChild(c);
    }
  }
})();
