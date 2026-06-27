/* ===========================================================
   Dt. Murat Serteser Diş Kliniği — main.js
   Mobil menü, video facade (tıkla-oynat), galeri lightbox, scroll animasyon
   =========================================================== */
(function () {
  "use strict";

  /* ---------- Mobil menü ---------- */
  var hamburger = document.querySelector(".hamburger");
  var menu = document.querySelector(".nav-menu");
  if (hamburger && menu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("acik");
      menu.classList.toggle("acik");
      var acik = menu.classList.contains("acik");
      hamburger.setAttribute("aria-expanded", acik ? "true" : "false");
    });
    // Menü linkine tıklayınca kapat
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        hamburger.classList.remove("acik");
        menu.classList.remove("acik");
      });
    });
  }

  /* ---------- Video facade: tıkla → YouTube iframe yükle ----------
     Kullanım:
     <div class="video-cerceve" data-video="YOUTUBE_ID">
       <img src="thumbnail.jpg" alt="...">
       <div class="oynat-tus"><span></span></div>
     </div>
  ------------------------------------------------------------------ */
  document.querySelectorAll(".video-cerceve").forEach(function (cerceve) {
    cerceve.addEventListener("click", function () {
      var id = cerceve.getAttribute("data-video");
      if (!id || cerceve.querySelector("iframe")) return;
      var iframe = document.createElement("iframe");
      iframe.setAttribute(
        "src",
        "https://www.youtube.com/embed/" + id + "?autoplay=1&rel=0"
      );
      iframe.setAttribute("title", cerceve.getAttribute("data-baslik") || "Tanıtım videosu");
      iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
      iframe.setAttribute("allowfullscreen", "");
      cerceve.appendChild(iframe);
    });
    // Klavye erişilebilirliği
    cerceve.setAttribute("tabindex", "0");
    cerceve.setAttribute("role", "button");
    cerceve.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cerceve.click(); }
    });
  });

  /* ---------- Galeri Lightbox ---------- */
  var galeriResimler = document.querySelectorAll(".galeri-grid img");
  if (galeriResimler.length) {
    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = '<span class="kapat" aria-label="Kapat">&times;</span><img src="" alt="Galeri görseli">';
    document.body.appendChild(lightbox);
    var buyukResim = lightbox.querySelector("img");

    galeriResimler.forEach(function (img) {
      img.parentElement.addEventListener("click", function () {
        buyukResim.src = img.getAttribute("data-buyuk") || img.src;
        buyukResim.alt = img.alt;
        lightbox.classList.add("acik");
      });
    });
    function kapat() { lightbox.classList.remove("acik"); }
    lightbox.querySelector(".kapat").addEventListener("click", kapat);
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) kapat(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") kapat(); });
  }

  /* ---------- Scroll ile görünüm animasyonu ---------- */
  var gizliler = document.querySelectorAll(".gizli");
  if (gizliler.length && "IntersectionObserver" in window) {
    var gozlemci = new IntersectionObserver(function (girisler) {
      girisler.forEach(function (giris) {
        if (giris.isIntersecting) {
          giris.target.classList.add("gorundu");
          gozlemci.unobserve(giris.target);
        }
      });
    }, { threshold: 0.12 });
    gizliler.forEach(function (el) { gozlemci.observe(el); });
  } else {
    gizliler.forEach(function (el) { el.classList.add("gorundu"); });
  }

  /* ---------- Aktif menü linki (sayfaya göre) ---------- */
  var simdiki = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-menu a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === simdiki) a.classList.add("aktif");
  });
})();
