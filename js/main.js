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

  /* ---------- Sabit aksiyon butonları: Ara + Yukarı çık ---------- */
  var aks = document.createElement("div");
  aks.className = "aksiyon-butonlar";
  aks.innerHTML =
    '<a class="btn-ara" href="tel:+902722154436" aria-label="Bizi arayın" title="Ara">📞</a>' +
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
