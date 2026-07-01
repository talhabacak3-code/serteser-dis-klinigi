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

  /* ---------- İş yeri slider (otomatik kayan slayt) ---------- */
  document.querySelectorAll(".slider").forEach(function (slider) {
    var track = slider.querySelector(".slider-track");
    var toplam = track.children.length;
    var noktaWrap = slider.querySelector(".slider-nokta");
    var i = 0, timer;
    if (toplam < 2) return;

    for (var d = 0; d < toplam; d++) {
      var s = document.createElement("span");
      if (d === 0) s.className = "aktif";
      (function (idx) { s.addEventListener("click", function () { gecis(idx); }); })(d);
      noktaWrap.appendChild(s);
    }
    var noktalar = noktaWrap.children;

    function gecis(n) {
      i = (n + toplam) % toplam;
      track.style.transform = "translateX(" + (-i * 100) + "%)";
      for (var k = 0; k < noktalar.length; k++) noktalar[k].className = (k === i ? "aktif" : "");
      baslat();
    }
    function sonraki() { gecis(i + 1); }
    function onceki() { gecis(i - 1); }
    function baslat() { clearInterval(timer); timer = setInterval(sonraki, 4000); }

    slider.querySelector(".sag").addEventListener("click", sonraki);
    slider.querySelector(".sol").addEventListener("click", onceki);
    slider.addEventListener("mouseenter", function () { clearInterval(timer); });
    slider.addEventListener("mouseleave", baslat);
    baslat();
  });

  /* ---------- Logo: tam logo (images/logo.png) yüklenince yazıyı gizle ----------
     Gerçek logo (yazıyı içeren) eklenmişse yanındaki yazı tekrarını gizleriz.
     Dosya yoksa svg ikonuna düşer ve yazı görünür kalır. */
  function logoYaziGizle() {
    document.querySelectorAll(".logo .logo-yazi").forEach(function (e) { e.style.display = "none"; });
  }
  document.querySelectorAll(".logo img").forEach(function (img) {
    function kontrol() {
      if (img.naturalWidth > 0 && /logo\.png(\?|$)/.test(img.currentSrc || img.src)) logoYaziGizle();
    }
    if (img.complete) kontrol();
    img.addEventListener("load", kontrol);
  });

})();
