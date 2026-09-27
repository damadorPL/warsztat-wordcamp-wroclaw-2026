# Prompt 02: Generowanie Treści Blogowej (Wpis Gutenberg)

> **Zadanie 2 z README:**  
> _"Stwórz nowy wpis na blogu pod tytułem 'Witaj WordCamp Wrocław 2026', dodaj do niego 3 akapity o przyszłości AI w WordPressie i oznacz kategorią 'Konferencje'."_

---

## ⚡ Wariant 1: Szybki prompt (Zgodny z README)

Skopiuj poniższe polecenie:

```text
Stwórz nowy wpis na blogu pod tytułem 'Witaj WordCamp Wrocław 2026', dodaj do niego 3 akapity o przyszłości AI w WordPressie i oznacz kategorią 'Konferencje'.
```

---

## 🚀 Wariant 2: Zaawansowany prompt z blokami Gutenberga i metadanymi

Skopiuj poniższy prompt, aby wygenerować profesjonalny wpis z poprawną strukturą blokową edytora WordPressa:

```markdown
Wygeneruj i opublikuj nowy wpis na blogu w WordPressie za pośrednictwem serwera Novamira MCP, stosując poniższe wytyczne:

1. **Struktura taksonomii:**
   - Sprawdź, czy kategoria o nazwie "Konferencje" (slug: `konferencje`) już istnieje.
   - Jeśli nie istnieje, utwórz ją w WordPressie.
   - Dodaj również tagi: `WordCamp`, `AI`, `Novamira`, `Wrocław`.

2. **Treść wpisu (WordPress Gutenberg Blocks):**
   - **Tytuł:** `Witaj WordCamp Wrocław 2026`
   - **Lead (Wprowadzenie):** Akapit z większą czcionką (`<!-- wp:paragraph {"fontSize":"large"} -->`) witający uczestników warsztatu.
   - **Śródtytuł H2:** `Sztuczna Inteligencja w ekosystemie WordPressa`
   - **Treść merytoryczna:** 3 merytoryczne akapity omawiające:
     1. Rewolucję protokołu Model Context Protocol (MCP) i integrację agentów AI z WordPressem,
     2. Praktyczne zastosowania w automatyzacji tworzenia treści i testowania layoutów,
     3. Bezpieczeństwo pracy z agentami w środowiskach izolowanych (WordPress Playground / Sandbox).
   - **Cytat lub Wyróżnienie:** Blok `<!-- wp:quote -->` podsumowujący przyszłość CMS.
   - **Zakończenie:** Krótkie wezwanie do dyskusji z uczestnikami prelekcji.

3. **Parametry publikacji:**
   - Status: `publish` (opublikowany).
   - Format: Standardowy wpis (`post`).

4. **Raport końcowy:**
   - Podaj ID nowo utworzonego wpisu.
   - Podaj bezpośredni link (permalink) do wpisu w Playgroundzie.
   - Wyświetl podgląd wygenerowanego kodu blokowego Gutenberga.
```

---

## 🛠️ Jak agent AI realizuje to zadanie?

Agent może użyć jednego z mechanizmów:

### 1. Przez WP-CLI:
```bash
# Utworzenie kategorii:
wp term create category "Konferencje" --slug="konferencje"

# Utworzenie wpisu z blokami Gutenberga:
wp post create --post_type=post --post_title="Witaj WordCamp Wrocław 2026" --post_status=publish --post_category="Konferencje" --post_content="<!-- wp:paragraph -->...<!-- /wp:paragraph -->"
```

### 2. Przez PHP (`wp_insert_post`):
```php
$cat_id = wp_create_category('Konferencje');
$post_id = wp_insert_post([
    'post_title'    => 'Witaj WordCamp Wrocław 2026',
    'post_content'  => $gutenberg_blocks_html,
    'post_status'   => 'publish',
    'post_category' => [$cat_id],
]);
```

---

## ✅ Weryfikacja rezultatu

Po uruchomieniu promptu:
1. Przejdź w przeglądarce pod adres: `http://127.0.0.1:9400/wp-admin/edit.php`.
2. Kliknij **Edytuj** przy wpisie *Witaj WordCamp Wrocław 2026*.
3. Upewnij się, że edytor blokowy otwiera się bez błędów typu *Attempt Block Recovery*.
4. Sprawdź przypisanie do kategorii *Konferencje*.
