# Prompt 05: Tworzenie i Walidacja Layoutu z Blokami WooCommerce

> **Zadanie 5 z README:**  
> _"Na podstawie dokumentacji w pliku dane/BLOCKS-REFERENCE.md wygeneruj stronę główną z sekcją Hero, dwoma kolumnami i kolekcją produktów WooCommerce, a następnie zweryfikuj jej poprawność za pomocą `npm run validate:layout` przed publikacją."_

---

## ⚡ Wariant 1: Szybki prompt (Zgodny z README)

Skopiuj poniższe polecenie:

```text
Na podstawie dokumentacji w pliku dane/BLOCKS-REFERENCE.md wygeneruj stronę główną z sekcją Hero, dwoma kolumnami i kolekcją produktów WooCommerce, a następnie zweryfikuj jej poprawność za pomocą npm run validate:layout przed publikacją.
```

---

## 🚀 Wariant 2: Wieloetapowy profesjonalny prompt produkcyjny (Zalecany)

Skopiuj poniższy prompt, aby agent wykonał pełen cykl projektowo-wdrożeniowy z automatyczną walidacją i eliminacją halucynacji znaczników:

```markdown
Działasz jako zaawansowany architekt motywów blokowych WordPress i WooCommerce (Full Site Editing). 

Twoim celem jest przygotowanie, zwalidowanie i opublikowanie kompletnej strony lądowej (Landing Page) w WordPressie za pośrednictwem serwera Novamira MCP.

### KROK 1: Analiza reguł i schematów blokowych
Zapoznaj się z plikiem referencyjnym `dane/BLOCKS-REFERENCE.md` oraz schematami w `dane/core-blocks.json` i `dane/woocommerce-blocks.json`.
Zwróć szczególną uwagę na:
- Poprawność składni delimiterów (`<!-- wp:nazwa-bloku {atrybuty} -->` vs `<!-- wp:nazwa-bloku /-->`),
- Żelazną regułę: `core/column` ZAWSZE wewnątrz `core/columns`,
- Żelazną regułę: `core/button` ZAWSZE wewnątrz `core/buttons`,
- Żelazną regułę: bloki produktowe WooCommerce (`product-image`, `product-title`, `product-price`, `product-button`) ZAWSZE wewnątrz kontenerów `woocommerce/product-collection` -> `woocommerce/product-template`.

### KROK 2: Wygenerowanie markup'u strony
Przygotuj kod HTML zawierający 3 kluczowe sekcje:
1. **Sekcja Hero (`core/cover`):**
   - Przyciemnienie tła (`dimRatio`: 60, `overlayColor`: "black"),
   - Min. wysokość 450px,
   - Tytuł H1: "Oficjalny Sklep WordCamp Wrocław 2026",
   - Podtytuł zachęcający do zapoznania się z limitowaną kolekcją konferencyjną,
   - Dwa przyciski CTA (`core/buttons`): "Przeglądaj ofertę" oraz "O konferencji".
2. **Sekcja Informacyjna – 2 Kolumny (`core/columns` 50% / 50%):**
   - Lewa kolumna: Nagłówek H3, akapit tekstu opisujący inicjatywę społeczności WordPressa oraz punktowana lista atutów.
   - Prawa kolumna: Estetyczny obrazek (`core/image`) lub ramka z cytatem/wyróżnieniem (`core/quote`).
3. **Katalog Produktów (`woocommerce/product-collection`):**
   - Sekcja z nagłówkiem H2: "Polecane gadżety konferencyjne",
   - Siatka produktów pobierająca 4 elementy (`perPage: 4`),
   - Szablon produktu (`woocommerce/product-template`) zawierający: zdjęcie produktu ze znacznikiem promocji (`showSaleBadge: true`), tytuł, cenę i przycisk zakupu wyśrodkowany.

### KROK 3: Walidacja layoutu silnikiem Node.js
Przed wysłaniem kodu do WordPressa:
1. Zapisz wygenerowany markup w pliku roboczym, np. `dane/wygenerowany-layout.html`.
2. Uruchom skrypt walidacji:
   ```bash
   npm run validate:layout -- dane/wygenerowany-layout.html
   ```
3. Jeśli walidator wykaże jakiekolwiek błędy hierarchii lub nierozpoznane bloki, skoryguj kod i powtórz walidację, aż uzyskasz wynik: `Layout jest w 100% poprawny!`

### KROK 4: Publikacja w WordPressie
Po pomyślnej walidacji:
1. Utwórz nową stronę w WordPressie (`wp_insert_post` lub `wp post create` przez Novamira):
   - Tytuł: `Strona Główna – Sklep WordCamp Wrocław 2026`,
   - Typ wpisu: `page`,
   - Status: `publish`,
   - Treść: Zweryfikowany kod blokowy Gutenberga.
2. (Opcjonalnie) Ustaw nowo utworzoną stronę jako statyczną stronę główną witryny (`show_on_front = page` oraz `page_on_front = <ID_STRONY>`).
3. Zwróć bezpośredni adres URL do podglądu strony w Playgroundzie.
```

---

## 🧪 Przykładowy zweryfikowany wzorzec kodu (Gutenberg Markup)

Poniższy fragment przedstawia sprawdzoną strukturę sekcji produktowej i Hero, zgodną z `dane/BLOCKS-REFERENCE.md`:

```html
<!-- wp:cover {"dimRatio":60,"overlayColor":"black","minHeight":420,"minHeightUnit":"px","layout":{"type":"constrained"}} -->
<div class="wp-block-cover" style="min-height:420px"><span aria-hidden="true" class="wp-block-cover__background has-black-background-color has-background-dim-60 has-background-dim"></span><div class="wp-block-cover__inner-container">
  <!-- wp:heading {"textAlign":"center","level":1} -->
  <h1 class="wp-block-heading has-text-align-center">WordCamp Wrocław 2026 – AI Store</h1>
  <!-- /wp:heading -->
  <!-- wp:paragraph {"align":"center","fontSize":"medium"} -->
  <p class="has-text-align-center has-medium-font-size">Odkryj innowacje w WordPressie zasilane protokołem MCP.</p>
  <!-- /wp:paragraph -->
  <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
  <div class="wp-block-buttons">
    <!-- wp:button {"className":"is-style-fill"} -->
    <div class="wp-block-button is-style-fill"><a class="wp-block-button__link wp-element-button" href="#oferta">Zobacz produkty</a></div>
    <!-- /wp:button -->
  </div>
  <!-- /wp:buttons -->
</div></div>
<!-- /wp:cover -->

<!-- wp:columns {"style":{"spacing":{"padding":{"top":"40px","bottom":"40px"}}}} -->
<div class="wp-block-columns" style="padding-top:40px;padding-bottom:40px">
  <!-- wp:column {"width":"50%"} -->
  <div class="wp-block-column" style="flex-basis:50%">
    <!-- wp:heading {"level":2} -->
    <h2 class="wp-block-heading">O warsztatach</h2>
    <!-- /wp:heading -->
    <!-- wp:paragraph -->
    <p>Podczas tegorocznej edycji uczymy się budować i wdrażać autonomiczne agenty AI wspierające procesy e-commerce.</p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column {"width":"50%"} -->
  <div class="wp-block-column" style="flex-basis:50%">
    <!-- wp:quote -->
    <blockquote class="wp-block-quote"><p>„Model Context Protocol redefiniuje sposób, w jaki programiści tworzą strony w WordPressie.”</p><cite>WordCamp Wrocław</cite></blockquote>
    <!-- /wp:quote -->
  </div>
  <!-- /wp:column -->
</div>
<!-- /wp:columns -->

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

---

## 🛠️ Jak zweryfikować poprawność w terminalu?

Przed publikacją możesz w dowolnym momencie sprawdzić swój plik poleceniem npm:

```bash
# Walidacja domyślnego pliku referencyjnego:
npm run test:layout

# Walidacja własnego pliku ze stroną:
npm run validate:layout -- dane/wygenerowany-layout.html
```

---

## ✅ Weryfikacja rezultatu w WordPressie

1. Przejdź do: `http://127.0.0.1:9400/wp-admin/edit.php?post_type=page`.
2. Kliknij **Edytuj** nowo dodanej strony.
3. Sprawdź, czy blok `core/cover`, kolumny oraz siatka produktów WooCommerce wyświetlają się w edytorze czysto, bez komunikatu **Ten blok zawiera nieprawidłową lub nieobsługiwaną treść** (*Attempt Block Recovery*).
4. Otwórz stronę w nowej karcie w trybie podglądu witryny.
