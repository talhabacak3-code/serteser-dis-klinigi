# Dt. Murat Serteser Diş Kliniği — Web Sitesi

Statik (HTML/CSS/JS) bir diş kliniği tanıtım sitesi. **Randevu sistemi yoktur**; hizmetler **videolu** olarak sunulur.

## 📂 Dosya Yapısı
```
index.html        → Ana Sayfa
hizmetler.html    → Videolu Hizmetler
hakkimizda.html   → Hakkımızda (Dt. Murat Serteser)
galeri.html       → Galeri (tıklayınca büyür)
blog.html         → Blog yazıları
iletisim.html     → İletişim + Google Maps haritası
css/style.css     → Tüm tasarım ve renkler
js/main.js        → Menü, video oynatma, galeri, animasyon
images/           → logo.png ve fotoğraflar buraya
```

## 🚀 Nasıl Çalıştırılır
`index.html` dosyasına çift tıklayın — tarayıcıda açılır. Yayına almak için tüm klasörü herhangi bir statik hostinge (Netlify, GitHub Pages, cPanel/normal hosting) yükleyin.

## ✏️ Doldurmanız / Güncellemeniz Gerekenler

### 1) Logo
- Paylaştığınız kırmızı SERTESER logosunu `images/logo.png` adıyla kaydedin.
- Dosya yoksa otomatik gizlenir, yazılı logo ("SERTESER / Dt. Murat Serteser") görünmeye devam eder.

### 2) Hizmet videoları (en önemlisi)
- `hizmetler.html` içinde her hizmette şu satır var:
  ```html
  <div class="video-cerceve" data-video="dQw4w9WgXcQ" ...>
  ```
- `data-video="..."` kısmındaki değeri **gerçek YouTube video kimliğiyle** değiştirin.
  Örnek: `https://www.youtube.com/watch?v=ABC123xyz` → `data-video="ABC123xyz"`
- İstersen video kapak (thumbnail) görselini de değiştirin: aynı bloktaki `<img src="...">`.

### 3) İletişim bilgileri
`iletisim.html` ve tüm sayfaların alt kısmında (footer):
- **Telefon:** `tel:+90` → `tel:+905XXXXXXXXX`, görünen metni de yazın.
- **E-posta:** `mailto:` → `mailto:ornek@klinik.com`.
- **Sosyal medya:** `href="#"` linklerini Instagram/Facebook/WhatsApp adreslerinizle değiştirin.
- **Çalışma saatleri:** `iletisim.html` içindeki saatleri kendinize göre düzenleyin.

### 4) Görseller (galeri, doktor, hero)
- Şu an `placehold.co` üzerinden örnek (placeholder) görseller kullanılıyor.
- Gerçek fotoğrafları `images/` klasörüne ekleyip ilgili `<img src="...">` bağlantılarını güncelleyin
  (`index.html` hero, `hakkimizda.html` doktor fotoğrafı, `galeri.html` görseller, `blog.html` kapaklar).

### 5) Metinler
- Hakkımızda yazısı, blog yazıları ve hasta yorumları örnek içeriklerdir; dilediğiniz gibi düzenleyin.

## 🎨 Renkler
`css/style.css` en üstteki `:root` bölümünden tek yerden değiştirilebilir
(`--kirmizi`, `--acik-mavi`, `--lacivert`).

## 📍 Adres
Dumlupınar, 2. Dumlupınar Cad. Acar Han, 03200 Afyonkarahisar Merkez / Afyonkarahisar
(Harita `iletisim.html` içinde gömülüdür.)
