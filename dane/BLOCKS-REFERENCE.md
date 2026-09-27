# Baza Referencyjna Bloków WordPress Core & WooCommerce dla Agenta AI

> **Katalog roboczy:** `./dane/`  
> **Przeznaczenie:** Zbiór schematów, reguł hierarchii i walidatora layoutu dla modeli i agentów AI generujących treść w formacie WordPress Gutenberg / Block Editor.

---

## 📁 Zawartość katalogu `dane/`

| Plik | Opis |
|---|---|
| [`core-blocks.json`](./core-blocks.json) | Pełna baza **116 bloków WordPress Core** (Gutenberg) wyodrębniona z oficjalnego pakietu `@wordpress/block-library` (atrybuty, reguły, supports, przykładowy markup). |
| [`woocommerce-blocks.json`](./woocommerce-blocks.json) | Pełna baza **174 bloków WooCommerce** (wersja 11.1.2) wyodrębniona z oficjalnego wydania WooCommerce (kolekcje produktów, szablony, koszyk, kasa, filtry). |
| [`blocks-reference.json`](./blocks-reference.json) | Zunifikowany indeks wyszukiwania i szybkiego dostępu (z podziałem na bloki layoutu i e-commerce). |
| [`validate-layout.js`](./validate-layout.js) | Gotowy skrypt Node.js weryfikujący poprawność składni, nazw bloków i relacji rodzic-dziecko przy użyciu oficjalnego parsera `@wordpress/block-serialization-default-parser`. |

---

## ⚡ Złote Zasady Generowania Markup'u Gutenberga dla AI

Modele językowe często generują kod, który w edytorze WordPressa wyświetla żółty komunikat **„Ten blok zawiera nieprawidłową lub nieobsługiwaną treść” (Attempt Block Recovery)**. Aby temu zapobiec, stosuj poniższe reguły:

### 1. Składnia Delimiterów (Komentarzy)
* **Bloki statyczne (posiadające zapisany kod HTML w bazie):**
  Wymagają tagu otwierającego z opcjonalnym JSON-em atrybutów, ciała HTML zgodnego z funkcją zapisu bloku oraz tagu zamykającego:
  ```html
  <!-- wp:paragraph {"fontSize":"large"} -->
  <p class="has-large-font-size">Treść akapitu</p>
  <!-- /wp:paragraph -->
  ```
* **Bloki dynamiczne (renderowane w locie przez PHP / Store API):**
  Zawsze używają formatu samozamykającego `<!-- wp:... /-->` i **NIE MOGĄ** zawierać wewnętrznego kodu HTML:
  ```html
  <!-- wp:woocommerce/product-price /-->
  <!-- wp:latest-posts {"postsToShow":5} /-->
  ```
* **Atrybuty JSON:**
  * Klucze i ciągi znaków muszą być w **podwójnych cudzysłowach** `"` (np. `{"level":2}`, nie `{'level':2}`).
  * Brak przecinka po ostatniej parze klucz-wartość.

---

### 2. Standardowe Klasy CSS i Tokeny Projektowe

* **Główna klasa bloku:**
  Każdy element HTML powinien mieć klasę bazową `wp-block-{nazwa-bez-core}`, np.:
  * `core/paragraph` -> `<p class="wp-block-paragraph">` (dla prostych elementów znacznikowych klasa bywa opcjonalna, ale zalecana dla spójności stylów)
  * `core/heading` -> `<h2 class="wp-block-heading">`
  * `core/group` -> `<div class="wp-block-group">`
  * `core/columns` -> `<div class="wp-block-columns">`
  * `core/column` -> `<div class="wp-block-column">`

* **Kolory tła i tekstu (klasy presetów):**
  Gdy ustawiasz atrybut `textColor` lub `backgroundColor`, WordPress generuje klasy:
  ```json
  {"textColor":"primary", "backgroundColor":"white"}
  ```
  Odp. w HTML:
  ```html
  class="... has-primary-color has-white-background-color has-text-color has-background"
  ```
  > ⚠️ **Nigdy nie twórz klas typu `has-#ff0000-color`!** Jeśli używasz dowolnego koloru HEX, trafia on do obiektu `style`:
  > `{"style":{"color":{"text":"#e11d48"}}}` -> w HTML: `style="color:#e11d48"`

* **Wyrównanie tekstu:**
  Atrybut `{"align":"center"}` w tekście generuje klasę `has-text-align-center` na elemencie wrapper.

---

## 🧱 Kluczowe Bloki Układu (Layout Containers)

### 1. `core/group` – Uniwersalny Kontener / Sekcja
Blok `group` to podstawa sekcji. Obsługuje 3 tryby layoutu:
* `constrained` – ograniczona szerokość wg motywu (standardowy kontener sekcji)
* `flex` – poziomy lub pionowy układ flexbox (paski narzędzi, badge, tagi)
* `grid` – automatyczna siatka elementów

**Przykład Sekcji Ograniczonej z Odstępem:**
```html
<!-- wp:group {"layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"}}}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50)">
  <!-- wp:heading {"textAlign":"center","level":2} -->
  <h2 class="wp-block-heading has-text-align-center">Tytuł Sekcji</h2>
  <!-- /wp:heading -->
  <!-- wp:paragraph {"align":"center"} -->
  <p class="has-text-align-center">Krótki opis wprowadzający do oferty.</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
```

---

### 2. `core/columns` + `core/column` – Kolumny
* **ŻELAZNA REGUŁA:** Blok `core/column` **ZAWSZE** musi być bezpośrednim dzieckiem `core/columns`. Umieszczenie `core/column` poza `core/columns` natychmiastowo psuje edytor!

**Przykład Układu 2-Kolumnowego (50% / 50%):**
```html
<!-- wp:columns -->
<div class="wp-block-columns">
  <!-- wp:column {"width":"50%"} -->
  <div class="wp-block-column" style="flex-basis:50%">
    <!-- wp:heading {"level":3} -->
    <h3 class="wp-block-heading">Lewa Kolumna</h3>
    <!-- /wp:heading -->
    <!-- wp:paragraph -->
    <p>Treść tekstowa po lewej stronie.</p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column {"width":"50%"} -->
  <div class="wp-block-column" style="flex-basis:50%">
    <!-- wp:image {"sizeSlug":"large"} -->
    <figure class="wp-block-image size-large"><img src="https://picsum.photos/600/400" alt="Prezentacja"/></figure>
    <!-- /wp:image -->
  </div>
  <!-- /wp:column -->
</div>
<!-- /wp:columns -->
```

---

### 3. `core/buttons` + `core/button` – Przyciski Wezwania do Działania (CTA)
* **ŻELAZNA REGUŁA:** Blok `core/button` **ZAWSZE** musi być umieszczony wewnątrz kontenera `core/buttons`.

```html
<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons">
  <!-- wp:button {"className":"is-style-fill"} -->
  <div class="wp-block-button is-style-fill"><a class="wp-block-button__link wp-element-button" href="/kontakt">Skontaktuj się</a></div>
  <!-- /wp:button -->
  <!-- wp:button {"className":"is-style-outline"} -->
  <div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="/oferta">Zobacz ofertę</a></div>
  <!-- /wp:button -->
</div>
<!-- /wp:buttons -->
```

---

### 4. `core/cover` – Sekcja Hero z Tłem i Przyciemnieniem
```html
<!-- wp:cover {"dimRatio":60,"overlayColor":"black","minHeight":450,"minHeightUnit":"px","layout":{"type":"constrained"}} -->
<div class="wp-block-cover" style="min-height:450px"><span aria-hidden="true" class="wp-block-cover__background has-black-background-color has-background-dim-60 has-background-dim"></span><div class="wp-block-cover__inner-container">
  <!-- wp:heading {"textAlign":"center","level":1} -->
  <h1 class="wp-block-heading has-text-align-center">Nowoczesne Rozwiązania E-Commerce</h1>
  <!-- /wp:heading -->
  <!-- wp:paragraph {"align":"center","fontSize":"large"} -->
  <p class="has-text-align-center has-large-font-size">Wdrażamy sklepy WooCommerce zintegrowane ze sztuczną inteligencją.</p>
  <!-- /wp:paragraph -->
</div></div>
<!-- /wp:cover -->
```

---

## 🛒 Kluczowe Bloki WooCommerce

W nowoczesnym WooCommerce nie używamy przestarzałych shortcode'ów `[products]`. Zamiast tego stosujemy **Gutenberg Block Hierarchy**:

### 1. `woocommerce/product-collection` – Siatka / Katalog Produktów
Hierarchia wymagana przez WooCommerce:
* `woocommerce/product-collection`
  * `woocommerce/product-template`
    * `woocommerce/product-image`
    * `woocommerce/product-title`
    * `woocommerce/product-price`
    * `woocommerce/product-button`

```html
<!-- wp:woocommerce/product-collection {"query":{"perPage":4,"pages":0,"offset":0,"postType":"product","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false}} -->
<div class="wp-block-woocommerce-product-collection">
  <!-- wp:woocommerce/product-template -->
  <!-- wp:woocommerce/product-image {"showSaleBadge":true} /-->
  <!-- wp:woocommerce/product-title {"textAlign":"center"} /-->
  <!-- wp:woocommerce/product-price {"textAlign":"center"} /-->
  <!-- wp:woocommerce/product-button {"textAlign":"center"} /-->
  <!-- /wp:woocommerce/product-template -->
</div>
<!-- /wp:woocommerce/product-collection -->
```

> ⚠️ **Błąd krytyczny AI:** Umieszczenie bloków takich jak `woocommerce/product-price` czy `woocommerce/product-image` bezpośrednio na zwykłej stronie bez nadrzędnego `product-template` lub `single-product` wywoła błąd walidacji!

---

### 2. Główne Bloki Sklepowe WooCommerce
* **Koszyk:** `<!-- wp:woocommerce/cart /-->`
* **Kasa / Zamówienie:** `<!-- wp:woocommerce/checkout /-->`
* **Mini Koszyk (nagłówek):** `<!-- wp:woocommerce/mini-cart /-->`
* **Pojedynczy Produkt:** `<!-- wp:woocommerce/single-product {"productId":123} /-->`

---

## 🛠️ Jak Używać Walidatora (`dane/validate-layout.js`)

Przed wysłaniem wygenerowanego kodu HTML do bazy danych WordPressa (np. przez wtyczkę Novamira MCP lub REST API), zwaliduj kod:

### 1. Z linii poleceń (CLI):
```bash
# Walidacja przekazanego ciągu znaków:
node dane/validate-layout.js "<!-- wp:paragraph -->...<!-- /wp:paragraph -->"

# Walidacja pliku z wygenerowanym layoutem:
node dane/validate-layout.js dane/przykladowy-layout.html
```

### 2. Programistycznie w kodzie JavaScript / TypeScript:
```javascript
const { validateLayout } = require('./dane/validate-layout.js');

const markup = `<!-- wp:columns -->...<!-- /wp:columns -->`;
const result = validateLayout(markup);

if (!result.valid) {
  console.error('Błędy w layoucie:', result.errors);
} else {
  console.log('Layout poprawny, można publikować do WordPressa!');
}
```

---

## 📋 Podsumowanie Bazy Schematów

* Baza zawiera **wszystkie 116 oficjalnych bloków WordPress Core** oraz **174 oficjalne bloki WooCommerce**.
* Schematy zawierają definicje typów, wartości domyślnych, dopuszczalnych wartości (`enum`) oraz reguł `parent` i `ancestor`.
* Pliki są sformatowane jako gotowy JSON, dzięki czemu agent AI może wczytać dowolny blok i sprawdzić jego atrybuty przed wygenerowaniem treści.
