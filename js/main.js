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

  /* ---------- Galeri Lightbox (ileri/geri geçişli) ---------- */
  var galeriResimler = document.querySelectorAll(".galeri-grid img");
  if (galeriResimler.length) {
    var galeriListe = Array.prototype.map.call(galeriResimler, function (img) {
      return { src: img.getAttribute("data-buyuk") || img.src, alt: img.alt };
    });
    var aktifIndex = 0;

    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML =
      '<span class="kapat" aria-label="Kapat">&times;</span>' +
      '<button class="lb-ok lb-onceki" type="button" aria-label="Önceki görsel">&#8249;</button>' +
      '<img src="" alt="Galeri görseli">' +
      '<button class="lb-ok lb-sonraki" type="button" aria-label="Sonraki görsel">&#8250;</button>';
    document.body.appendChild(lightbox);
    var buyukResim = lightbox.querySelector("img");

    function goster(index) {
      aktifIndex = (index + galeriListe.length) % galeriListe.length;
      buyukResim.src = galeriListe[aktifIndex].src;
      buyukResim.alt = galeriListe[aktifIndex].alt;
    }
    function ac(index) { goster(index); lightbox.classList.add("acik"); }
    function kapat() { lightbox.classList.remove("acik"); }
    function onceki() { goster(aktifIndex - 1); }
    function sonraki() { goster(aktifIndex + 1); }

    galeriResimler.forEach(function (img, i) {
      img.parentElement.addEventListener("click", function () { ac(i); });
    });
    lightbox.querySelector(".kapat").addEventListener("click", kapat);
    lightbox.querySelector(".lb-onceki").addEventListener("click", function (e) { e.stopPropagation(); onceki(); });
    lightbox.querySelector(".lb-sonraki").addEventListener("click", function (e) { e.stopPropagation(); sonraki(); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) kapat(); });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("acik")) return;
      if (e.key === "Escape") kapat();
      else if (e.key === "ArrowLeft") onceki();
      else if (e.key === "ArrowRight") sonraki();
    });

    // Mobil: parmakla kaydırarak geçiş
    var dokunX = null;
    lightbox.addEventListener("touchstart", function (e) { dokunX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener("touchend", function (e) {
      if (dokunX === null) return;
      var fark = e.changedTouches[0].clientX - dokunX;
      if (Math.abs(fark) > 45) { if (fark < 0) sonraki(); else onceki(); }
      dokunX = null;
    }, { passive: true });
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

  /* ---------- Sabit aksiyon butonları: Ara + Yukarı çık ---------- */
  var aks = document.createElement("div");
  aks.className = "aksiyon-butonlar";
  var wpSvg =
    '<svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">' +
    '<path d="M16.04 4C9.9 4 4.9 9 4.9 15.14c0 2.17.64 4.2 1.74 5.92L4.5 28l7.1-2.06a11.1 11.1 0 0 0 4.44.93h.01c6.14 0 11.14-5 11.14-11.14C27.19 9 22.18 4 16.04 4zm0 20.3h-.01c-1.4 0-2.77-.38-3.97-1.08l-.28-.17-4.22 1.22 1.13-4.1-.19-.3a9.2 9.2 0 0 1-1.42-4.93c0-5.08 4.14-9.22 9.23-9.22 2.46 0 4.78.96 6.52 2.7a9.17 9.17 0 0 1 2.7 6.53c0 5.08-4.14 9.22-9.22 9.22zm5.06-6.9c-.28-.14-1.64-.81-1.9-.9-.25-.1-.44-.14-.62.14-.18.28-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.38-.82-.73-1.38-1.64-1.54-1.92-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.49.14-.16.18-.28.28-.46.09-.18.05-.35-.02-.49-.07-.14-.62-1.5-.85-2.05-.22-.54-.45-.47-.62-.48l-.53-.01c-.18 0-.47.07-.72.35-.25.28-.95.93-.95 2.27 0 1.34.97 2.63 1.11 2.81.14.18 1.92 2.93 4.65 4.11.65.28 1.16.45 1.56.58.65.21 1.25.18 1.72.11.52-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg>';
  aks.innerHTML =
    '<a class="btn-wp" href="https://wa.me/905555997244?text=Merhaba%2C%20bilgi%20almak%20istiyorum." target="_blank" rel="noopener" aria-label="WhatsApp ile yazın" title="WhatsApp">' + wpSvg + '</a>' +
    '<a class="btn-ara" href="tel:+905555997244" aria-label="Bizi arayın" title="Ara">📞</a>' +
    '<button class="btn-yukari" type="button" aria-label="Yukarı çık" title="Yukarı çık">↑</button>';
  document.body.appendChild(aks);
  var yukariBtn = aks.querySelector(".btn-yukari");
  yukariBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) yukariBtn.classList.add("goster");
    else yukariBtn.classList.remove("goster");
  });

  var azalt = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll ilerleme çubuğu + header 'scrolled' durumu ---------- */
  var ilerleme = document.createElement("div");
  ilerleme.className = "scroll-ilerleme";
  document.body.appendChild(ilerleme);
  var header = document.querySelector(".site-header");
  var tick = false;
  function scrollGuncelle() {
    var st = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    ilerleme.style.width = (h > 0 ? (st / h) * 100 : 0) + "%";
    if (header) { if (st > 10) header.classList.add("scrolled"); else header.classList.remove("scrolled"); }
    tick = false;
  }
  window.addEventListener("scroll", function () {
    if (!tick) { window.requestAnimationFrame(scrollGuncelle); tick = true; }
  }, { passive: true });
  scrollGuncelle();

  /* ---------- Reveal stagger: grup içindeki kartlara kademeli gecikme ---------- */
  document.querySelectorAll(".kartlar, .ozellik-grid, .blog-grid").forEach(function (grup) {
    var i = 0;
    grup.querySelectorAll(".gizli").forEach(function (el) { el.style.transitionDelay = (i++ * 0.08) + "s"; });
  });

  /* ---------- İstatistik sayaç animasyonu (görünürken) ---------- */
  function sayacBaslat(el) {
    var m = el.textContent.trim().match(/([^\d]*)([\d.]+)(.*)/);
    if (!m) return;
    var onEk = m[1], son = m[3];
    var binli = m[2].indexOf(".") > -1;
    var hedef = parseInt(m[2].replace(/\./g, ""), 10);
    if (isNaN(hedef)) return;
    function fmt(n) { return binli ? n.toLocaleString("tr-TR") : String(n); }
    if (azalt) { el.textContent = onEk + fmt(hedef) + son; return; }
    var sure = 1400, bas = null;
    function adim(t) {
      if (!bas) bas = t;
      var p = Math.min((t - bas) / sure, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = onEk + fmt(Math.round(hedef * e)) + son;
      if (p < 1) requestAnimationFrame(adim);
      else el.textContent = onEk + fmt(hedef) + son;
    }
    requestAnimationFrame(adim);
  }
  var sayilar = document.querySelectorAll(".istatistik .sayi");
  if (sayilar.length && "IntersectionObserver" in window) {
    var sObs = new IntersectionObserver(function (girisler) {
      girisler.forEach(function (g) {
        if (g.isIntersecting) { sayacBaslat(g.target); sObs.unobserve(g.target); }
      });
    }, { threshold: 0.4 });
    sayilar.forEach(function (s) { sObs.observe(s); });
  }

  /* ---------- Manyetik butonlar (yalnızca hover'lı cihazlar) ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !azalt) {
    document.querySelectorAll(".btn-kirmizi, .btn-lacivert, .nav-cta").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + (x * 0.16) + "px," + (y * 0.26 - 3) + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  }

})();
