# Prompt 04: Diagnostyka Bazy Danych (Zapytania SQL przez Novamira)

> **Zadanie 4 z README:**  
> _"Wylistuj ostatnie 5 wpisów bezpośrednio z bazy danych za pomocą zapytania SQL przez mechanizm novamira."_

---

## ⚡ Wariant 1: Szybki prompt (Zgodny z README)

Skopiuj poniższe polecenie:

```text
Wylistuj ostatnie 5 wpisów bezpośrednio z bazy danych za pomocą zapytania SQL przez mechanizm novamira.
```

---

## 🚀 Wariant 2: Rozszerzony prompt analityczny (Diagnostyka bazy i relacji)

Skopiuj poniższy prompt, aby wykonać bezpieczne zapytanie z uwzględnieniem struktury tabel WordPressa:

```markdown
Wykonaj bezpośrednie zapytanie SQL do bazy danych WordPressa przy użyciu mechanizmu Novamira MCP (obiekt $wpdb w PHP lub WP-CLI db query):

1. **Wymagania dla zapytania SQL:**
   - Użyj dynamicznego prefiksu tabel WordPressa (`$wpdb->prefix . 'posts'`), aby zapytanie działało niezależnie od konfiguracji instalacji.
   - Pobierz dokładnie 5 ostatnich rekordów według daty utworzenia (`ORDER BY post_date DESC LIMIT 5`).
   - Uwzględnij kluczowe kolumny:
     - `ID` (identyfikator wpisu),
     - `post_title` (tytuł),
     - `post_type` (typ wpisu: post, page, revision, nav_menu_item itp.),
     - `post_status` (status: publish, draft, inherit, trash),
     - `post_date` (data utworzenia),
     - `comment_count` (liczba komentarzy).

2. **Dodatkowa metryka bazy:**
   - Sprawdź łączną liczbę rekordów w tabeli `posts` z podziałem na statusy (np. ile opublikowanych wpisów, ile rewizji, ile załączników).

3. **Format odpowiedzi:**
   - Wyświetl dokładną treść zapytania SQL, które zostało wykonane.
   - Zaprezentuj wyniki w czytelnej tabeli Markdown.
   - Dodaj krótką interpretację wyników (np. czy widoczny jest wpis utworzony w zadaniu 2).
```

---

## 🧩 Zapytanie SQL i kod PHP wykonywany przez Novamira

Przykładowy kod PHP wykorzystujący globalną instancję `$wpdb`:

```php
global $wpdb;

$table_name = $wpdb->prefix . 'posts';

// Pobranie ostatnich 5 rekordów
$results = $wpdb->get_results("
    SELECT ID, post_title, post_type, post_status, post_date, comment_count
    FROM {$table_name}
    WHERE post_type NOT IN ('revision', 'auto-draft')
    ORDER BY post_date DESC
    LIMIT 5
", ARRAY_A);

// Podsumowanie wg typów i statusów
$counts = $wpdb->get_results("
    SELECT post_type, post_status, COUNT(*) as total
    FROM {$table_name}
    GROUP BY post_type, post_status
    ORDER BY total DESC
", ARRAY_A);

echo json_encode(['posts' => $results, 'stats' => $counts], JSON_PRETTY_PRINT);
```

---

## 🛠️ Alternatywa przez WP-CLI

Agent może również wykonać zapytanie poprzez narzędzie WP-CLI:

```bash
wp db query "SELECT ID, post_title, post_type, post_status, post_date FROM wp_posts ORDER BY post_date DESC LIMIT 5;"
```

---

## 📋 Przykładowy format wyniku

| ID | Tytuł | Typ (`post_type`) | Status | Data utworzenia | Komentarze |
|---|---|---|---|---|---|
| **4** | Witaj WordCamp Wrocław 2026 | `post` | `publish` | 2026-09-27 13:42:00 | 0 |
| **3** | Przykładowa strona | `page` | `publish` | 2026-09-27 10:00:00 | 0 |
| **2** | Polityka prywatności | `page` | `draft` | 2026-09-27 10:00:00 | 0 |
| **1** | Witaj, świecie! | `post` | `publish` | 2026-09-27 10:00:00 | 1 |

---

## 🔒 Uwaga dotycząca bezpieczeństwa

Pamiętaj, że środowisko warsztatowe w Playgroundzie jest izolowane w pamięci podręcznej przeglądarki lub WebAssembly. Na serwerach produkcyjnych zawsze używaj metody `$wpdb->prepare()` dla zapytań z parametrami zewnętrznymi, aby chronić bazę przed atakami typu SQL Injection.
