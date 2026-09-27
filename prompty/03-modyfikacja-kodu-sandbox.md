# Prompt 03: Modyfikacja Kodu i Praca w Sandboxie (Mini-Wtyczka)

> **Zadanie 3 z README:**  
> _"Napisz mini-wtyczkę w katalogu novamira-sandbox, która dodaje powitanie w panelu administracyjnym i przetestuj jej działanie."_

---

## ⚡ Wariant 1: Szybki prompt (Zgodny z README)

Skopiuj poniższe polecenie:

```text
Napisz mini-wtyczkę w katalogu novamira-sandbox, która dodaje powitanie w panelu administracyjnym i przetestuj jej działanie.
```

---

## 🚀 Wariant 2: Rozszerzony prompt deweloperski (Bezpieczny kod z walidacją)

Skopiuj poniższy prompt dla zachowania pełnych standardów deweloperskich WordPressa:

```markdown
Stwórz i przetestuj mini-wtyczkę do WordPressa w izolowanym katalogu sandbox (`wp-content/novamira-sandbox/` lub jako wtyczkę w `wp-content/plugins/`):

1. **Wymagania dla pliku wtyczki (`wordcamp-wroclaw-welcome.php`):**
   - Poprawny nagłówek wtyczki WordPress (Plugin Name: "WordCamp Wrocław 2026 Welcome Banner", Description, Version: 1.0.0, Author: Twój Agent AI).
   - Zabezpieczenie przed bezpośrednim wywołaniem (`if (!defined('ABSPATH')) exit;`).
   - Rejestracja hooka `admin_notices` wyświetlającego powiadomienie dla zalogowanych administratorów.
   - Treść powiadomienia:
     - Wygląd: standardowy alert WordPress `<div class="notice notice-success is-dismissible">`.
     - Treść: "🎉 Witaj na WordCamp Wrocław 2026! Środowisko WordPress Playground pomyślnie połączone z Novamira MCP."
     - Przycisk lub link zamykający (`is-dismissible`).

2. **Walidacja i bezpieczeństwo:**
   - Przed uruchomieniem sprawdź poprawność składniową kodu PHP (lint / syntax check), aby uniknąć błędów krytycznych (White Screen of Death).
   - Aktywuj wtyczkę lub załaduj kod w środowisku WordPress.

3. **Weryfikacja:**
   - Zweryfikuj, czy hook `admin_notices` jest poprawnie zarejestrowany.
   - Sprawdź, czy funkcja `has_action('admin_notices', ...)` zwraca prawdę.
   - Poinformuj, pod jakim adresem URL w panelu (`/wp-admin/`) powiadomienie jest widoczne.
```

---

## 🧩 Wzorzec kodu wtyczki

Oto wzorzec kodu PHP, który agent powinien zaimplementować:

```php
<?php
/**
 * Plugin Name: WordCamp Wrocław 2026 Welcome Banner
 * Description: Wyświetla powitalny baner w panelu administracyjnym WordPress Playground.
 * Version: 1.0.0
 * Author: Novamira AI Workshop
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_notices', function() {
    $screen = get_current_screen();
    ?>
    <div class="notice notice-success is-dismissible">
        <p>
            <strong>🎉 Witaj na WordCamp Wrocław 2026!</strong>
            Twoje środowisko WordPress Playground działa stabilnie i współpracuje z serwerem <strong>Novamira MCP</strong>.
        </p>
    </div>
    <?php
});
```

---

## 🛠️ Jak agent AI realizuje to zadanie?

1. **Tworzy plik:** Używa narzędzia zapisu plików Novamira (`write_file` lub sandbox API).
2. **Sprawdza błędy:** Wykonuje test interpretera PHP (np. polecenie `php -l`).
3. **Aktywuje:** Jeśli plik został zapisany w `wp-content/plugins/wordcamp-welcome/wordcamp-welcome.php`, aktywuje go poleceniem:
   ```bash
   wp plugin activate wordcamp-welcome
   ```
   (Jeśli umieszczono w `wp-content/mu-plugins/`, ładuje się automatycznie jako Must-Use Plugin).

---

## ✅ Weryfikacja rezultatu

1. Odśwież kokpit WordPressa: `http://127.0.0.1:9400/wp-admin/`.
2. Na samej górze panelu powinien pojawić się zielony alert powitalny z ikoną i możliwością zamknięcia krzyżykiem.
