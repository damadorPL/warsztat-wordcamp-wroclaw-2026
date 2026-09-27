# Prompt 01: Audyt Środowiska WordPress

> **Zadanie 1 z README:**  
> _"Sprawdź jakie wtyczki i motywy są aktywne w tym WordPressie i wyświetl podstawowe informacje o konfiguracji bazy danych."_

---

## ⚡ Wariant 1: Szybki prompt (Zgodny z README)

Skopiuj poniższe polecenie:

```text
Sprawdź jakie wtyczki i motywy są aktywne w tym WordPressie i wyświetl podstawowe informacje o konfiguracji bazy danych.
```

---

## 🚀 Wariant 2: Rozszerzony prompt raportujący (Profesjonalny audyt)

Skopiuj poniższy prompt, aby otrzymać ustrukturyzowany, wyczerpujący raport techniczny:

```markdown
Wykonaj szczegółowy audyt techniczny środowiska WordPress z wykorzystaniem serwera Novamira MCP:

1. **Wtyczki (Plugins):**
   - Wylistuj wszystkie zainstalowane wtyczki (aktywne oraz nieaktywne),
   - Podaj ich wersje oraz informację, czy posiadają dostępne aktualizacje,
   - Wskaż wtyczkę Novamira i potwierdź jej status działania.

2. **Motywy (Themes):**
   - Wskaż aktywny motyw (nazwa, wersja, autor, typ: blokowy FSE czy klasyczny),
   - Wylistuj zainstalowane, ale nieaktywne motywy zapasowe.

3. **Baza Danych:**
   - Podaj typ silnika bazy (MySQL / MariaDB / SQLite Playground),
   - Wyświetl prefiks tabel (`$wpdb->prefix`),
   - Wylistuj nazwy wszystkich istniejących tabel w bazie wraz z liczbą wierszy,
   - Sprawdź kodowanie znaków i collate (np. `utf8mb4_unicode_ci`).

4. **Konfiguracja serwera i PHP:**
   - Wersja PHP,
   - Wartości parametrów: `memory_limit`, `max_execution_time`, `upload_max_filesize`.

Sformatuj wszystkie zebrane dane w czytelnych tabelach Markdown z krótkim podsumowaniem stanu zdrowia witryny (Site Health).
```

---

## 🛠️ Jak agent AI realizuje to zadanie?

Agent pod maską może użyć:
* **WP-CLI (przez Novamira):**
  ```bash
  wp plugin list --format=table
  wp theme list --format=table
  wp db check
  ```
* **Kodu PHP (eval-php):**
  ```php
  global $wpdb;
  $plugins = get_plugins();
  $active_plugins = get_option('active_plugins');
  $theme = wp_get_theme();
  $tables = $wpdb->get_results("SHOW TABLE STATUS", ARRAY_A);
  ```

---

## 📋 Przykładowy format wyniku

Po wykonaniu promptu powinieneś otrzymać zestawienie:

### 1. Wtyczki
| Nazwa | Wersja | Status | Ścieżka |
|---|---|---|---|
| **Novamira** | 1.12.5 | 🟢 Aktywna | `novamira/novamira.php` |
| **WooCommerce** *(jeśli zainstalowana)* | 11.x | ⚪ Nieaktywna / Aktywna | `woocommerce/woocommerce.php` |

### 2. Aktywny motyw
* **Nazwa:** Twenty Twenty-Four / Twenty Twenty-Five
* **Typ:** Block Theme (Full Site Editing)

### 3. Baza danych
* **Prefiks:** `wp_`
* **Liczba tabel:** np. 12 głównych tabel WordPressa (`wp_posts`, `wp_options`, `wp_users`, ...)
