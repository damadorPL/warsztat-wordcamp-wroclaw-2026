# 📑 Zestaw Gotowych Promptów Warsztatowych – WordCamp Wrocław 2026

W tym katalogu znajdują się gotowe, przetestowane prompty przygotowane do realizacji zadań ze scenariusza warsztatowego opisanego w głównym pliku [README.md](../README.md).

Prompty zostały opracowane w dwóch wariantach:
1. **Wariant szybki (One-Click):** Dokładne polecenia w języku naturalnym z README – idealne do szybkiego przetestowania agenta.
2. **Wariant rozszerzony (Zalecany):** Precyzyjne prompty techniczne zawierające wytyczne architektoniczne, wymagania dotyczące struktury blokowej Gutenberga, obsługę błędów oraz instrukcje automatycznej walidacji.

---

## 🗂️ Spis Treści i Dostępne Zadania

| Plik | Zadanie z README | Opis i Cel |
|---|---|---|
| 🏁 [`00-weryfikacja-polaczenia-mcp.md`](./00-weryfikacja-polaczenia-mcp.md) | **Krok 0: Rozgrzewka** | Test komunikacji klienta AI z serwerem Novamira MCP, sprawdzenie dostępnych narzędzi (*abilities*) i wersji oprogramowania. |
| 🔍 [`01-audyt-srodowiska.md`](./01-audyt-srodowiska.md) | **Zadanie 1: Audyt środowiska** | Pobranie listy aktywnych i nieaktywnych wtyczek, analiza motywu oraz diagnostyka bazy danych. |
| ✍️ [`02-generowanie-tresci.md`](./02-generowanie-tresci.md) | **Zadanie 2: Generowanie treści** | Utworzenie wpisu *„Witaj WordCamp Wrocław 2026”*, automatyczne utworzenie taksonomii (kategoria *Konferencje*) i publikacja z blokami Gutenberga. |
| 💻 [`03-modyfikacja-kodu-sandbox.md`](./03-modyfikacja-kodu-sandbox.md) | **Zadanie 3: Modyfikacja kodu / Sandbox** | Utworzenie mini-wtyczki w bezpiecznym sandboxie `wp-content/novamira-sandbox`, rejestracja hooka `admin_notices` i weryfikacja działania w kokpicie. |
| 🗄️ [`04-diagnostyka-bazy-danych.md`](./04-diagnostyka-bazy-danych.md) | **Zadanie 4: Diagnostyka bazy danych** | Wykonanie bezpośrednich zapytań SQL do tabeli `wp_posts` przez Novamira MCP (`$wpdb`) i zestawienie ostatnich 5 wpisów w tabeli. |
| 🛒 [`05-tworzenie-i-walidacja-layoutu.md`](./05-tworzenie-i-walidacja-layoutu.md) | **Zadanie 5: Layout z WooCommerce** | Pełny cykl: analiza schematów z `dane/BLOCKS-REFERENCE.md`, generowanie sekcji Hero + Kolumny + Kolekcja Produktów, walidacja przez `npm run validate:layout` i publikacja strony. |
| 🤖 [`system-prompt-wordpress-agent.md`](./system-prompt-wordpress-agent.md) | **Instrukcja Systemowa (System Prompt)** | Gotowa reguła do wklejenia w konfigurację klienta AI (Cursor `.cursorrules`, Claude Desktop, Windsurf, Antigravity) eliminująca halucynacje blokowe. |

---

## 🚀 Jak korzystać z promptów podczas warsztatu?

### 1. Przygotuj instrukcję systemową (Opcjonalnie, ale zalecane)
Jeśli Twój klient AI obsługuje instrukcje systemowe (np. pole *System Prompt* w Claude Desktop lub plik `.cursorrules` / `.windsurfrules` w edytorze kodu), wklej na początku zawartość pliku [`system-prompt-wordpress-agent.md`](./system-prompt-wordpress-agent.md). Dzięki temu model natychmiast pozna specyfikę Novamira MCP oraz bazę schematów w folderze `dane/`.

### 2. Wybierz zadanie
Otwórz odpowiedni plik (np. `01-audyt-srodowiska.md`), skopiuj treść **Wariantu 1** (szybki test) lub **Wariantu 2** (pełen raport profesjonalny) i wklej do okna czatu z agentem.

### 3. Obserwuj działania agenta
Podczas wykonywania promptu agent AI:
- Wywoła odpowiednie narzędzia MCP udostępniane przez Novamira (np. `eval_php`, `wp_cli`, `query_db`).
- W przypadku Zadania 5 uruchomi skrypt walidacji `npm run validate:layout`, aby upewnić się, że kod nie wywoła żółtego komunikatu błędu *„Ten blok zawiera nieprawidłową lub nieobsługiwaną treść”*.

### 4. Weryfikuj efekty w przeglądarce
Każde zadanie możesz natychmiast obejrzeć na żywo w swojej instancji WordPress Playground:
- **Kokpit admina:** `http://127.0.0.1:9400/wp-admin/`
- **Wpisy:** `http://127.0.0.1:9400/wp-admin/edit.php`
- **Strony:** `http://127.0.0.1:9400/wp-admin/edit.php?post_type=page`
- **Wtyczki:** `http://127.0.0.1:9400/wp-admin/plugins.php`
