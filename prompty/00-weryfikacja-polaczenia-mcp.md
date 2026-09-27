# Prompt 00: Weryfikacja Połączenia i Narzędzi MCP (Rozgrzewka)

> **Cel:** Upewnienie się, że Twój klient AI (Claude Desktop, Cursor, Windsurf, Google Antigravity, VS Code) poprawnie komunikuje się z serwerem **Novamira MCP** w środowisku **WordPress Playground**.

---

## ⚡ Wariant 1: Szybki prompt (Jednozdaniowy)

```text
Sprawdź połączenie z serwerem MCP Novamira: wylistuj dostępne narzędzia (tools/abilities), potwierdź czy WordPress odpowiada i podaj aktualną wersję WordPressa oraz PHP.
```

---

## 🚀 Wariant 2: Rozszerzony prompt diagnostyczny (Zalecany)

Skopiuj poniższy prompt i wklej go do okna czatu ze swoim agentem AI:

```markdown
Jesteś połączony z lokalnym środowiskiem WordPress Playground za pośrednictwem serwera Novamira MCP.

Proszę wykonaj test diagnostyczny połączenia i przygotuj krótki raport:
1. Wylistuj wszystkie dostępne narzędzia i akcje udostępniane przez serwer Novamira MCP (np. wykonywanie PHP, poleceń WP-CLI, edycja plików, obsługa bazy danych).
2. Sprawdź i wyświetl:
   - Wersję WordPressa,
   - Wersję interpretera PHP,
   - Nazwę aktywnego motywu,
   - Adres URL witryny (`home_url()`).
3. Wykonaj prosty test wykonania kodu PHP (np. zwrócenie aktualnego znacznika czasu i wartości stałej `WP_ENVIRONMENT_TYPE`).
4. Przedstaw wyniki w czytelnej tabeli Markdown z podsumowaniem statusu połączenia (🟢 Połączono / 🔴 Błąd).
```

---

## 🔍 Czego oczekiwać w odpowiedzi?

Agent AI powinien:
1. Użyć narzędzi MCP Novamira (np. `eval_php`, `wp_cli` lub dedykowanych abilities).
2. Zwrócić podsumowanie podobne do:

| Parametr | Wartość |
|---|---|
| **Status połączenia** | 🟢 Aktywne (Novamira MCP) |
| **Wersja WordPress** | Najnowsza (np. 6.7+) |
| **Wersja PHP** | 8.3.x (WebAssembly) |
| **Środowisko (`WP_ENVIRONMENT_TYPE`)** | `local` |
| **Aktywny motyw** | Twenty Twenty-Four / Twenty Twenty-Five |
| **URL instalacji** | `http://127.0.0.1:9400` lub link Playground |

---

## 💡 Wskazówka techniczna

Jeśli agent zgłasza błąd braku połączenia z serwerem MCP:
1. Upewnij się, że serwer Playground działa (`npm run start` lub uruchomiony Blueprint w przeglądarce).
2. Sprawdź, czy w pliku konfiguracyjnym MCP (`claude_desktop_config.json`, `.cursor/mcp.json` itp.) podany jest właściwy port (`9400`) i token/hasło aplikacji.
