(function () {
  var C = window.CONFIG || {};
  var waUrl = "https://wa.me/" + C.numero + "?text=" + encodeURIComponent(C.mensaje || "");

  document.querySelectorAll("[data-bono]").forEach(function (el) { el.textContent = C.bono; });

  // Eventos de Meta Pixel
  function track(name, params, eventID) {
    if (typeof window.fbq === "function") {
      window.fbq("track", name, params || {}, eventID ? { eventID: eventID } : undefined);
    }
  }

  // La página es la oferta: se registra ViewContent al cargar
  track("ViewContent", { content_name: "Bono bienvenida" });

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
})();
