# Warsztat WordCamp Wrocław 2026 – WordPress Playground + Novamira (MCP Server)

[![WordPress Playground](https://img.shields.io/badge/WordPress-Playground-3858e9?logo=wordpress&logoColor=white)](https://developer.wordpress.org/playground/)
[![Novamira MCP](https://img.shields.io/badge/Plugin-Novamira_v1.12.6-blue?logo=anthropic)](https://github.com/use-novamira/novamira)
[![WooCommerce Latest](https://img.shields.io/badge/WooCommerce-Latest-96588a?logo=woocommerce&logoColor=white)](https://woocommerce.com/)
[![PHP 8.3](https://img.shields.io/badge/PHP-8.3-777bb4?logo=php&logoColor=white)](https://www.php.net/)
[![WordPress Latest](https://img.shields.io/badge/WordPress-Latest-21759b?logo=wordpress)](https://wordpress.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

> Gotowe środowisko **WordPress Playground** z automatycznie zainstalowaną i skonfigurowaną wtyczką **[Novamira](https://github.com/use-novamira/novamira)** (serwer MCP) oraz najnowszą wersją **WooCommerce** z zaimportowanymi przykładowymi produktami i mediami. Przygotowane z myślą o uczestnikach warsztatów na **WordCamp Wrocław 2026**.

---

## ⚡ Szybki start (One-Click Launch)

Kliknij poniższy przycisk, aby uruchomić w pełni funkcjonalny WordPress z wtyczką Novamira oraz sklepem WooCommerce bezpośrednio w Twojej przeglądarce (WebAssembly – bez instalacji serwerów, Dockera czy MySQL):

[![Try it in Playground](https://raw.githubusercontent.com/WordPress/blueprints/trunk/playground-preview-button.svg)](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/damadorPL/warsztat-wordcamp-wroclaw-2026/main/blueprint.json)

> [!TIP]
> **Otwórz w nowej karcie:** Przytrzymaj **Ctrl** (lub **Cmd** na macOS) albo kliknij przycisk **środkowym przyciskiem myszy (kółkiem)**, aby WordPress Playground otworzył się w nowej karcie i nie zamykał tej instrukcji warsztatowej.

> 🔗 **Bezpośredni link do uruchomienia:**  
> [Uruchom Blueprint w przeglądarce](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/damadorPL/warsztat-wordcamp-wroclaw-2026/main/blueprint.json)

---

## 📖 Czym jest ten projekt?

Ten projekt zawiera definicję **WordPress Playground Blueprint** ([`blueprint.json`](./blueprint.json)), która automatyzuje proces konfiguracji środowiska WordPress z wtyczką **Novamira**.

### Co to jest Novamira?

[Novamira](https://github.com/use-novamira/novamira) to otwartoźródłowa wtyczka do WordPressa pełniąca rolę serwera **Model Context Protocol (MCP)**. Pozwala asystentom i agentom AI (np. **Claude Desktop**, **Cursor**, **Windsurf**, **VS Code**, **Google Antigravity**) na bezpośrednią komunikację ze środowiskiem WordPress:

- 🛠️ **Wykonywanie kodu PHP** w kontekście WordPressa z dostępem do `$wpdb`, wbudowanych funkcji i załadowanych wtyczek.
- 💻 **Wykonywanie poleceń WP-CLI** (w tym w tle).
- 📁 **Inspekcję i edycję plików motywów i wtyczek** oraz pracę w bezpiecznym sandboxie (`wp-content/novamira-sandbox`).
- 📊 **Zarządzanie treściami, wpisami i blokami Gutenberga** w czasie rzeczywistym.

---

## 📦 Wymagania wstępne i instalacja (Node.js & mcp-wordpress-remote)

Do pracy ze środowiskiem warsztatowym na własnym komputerze (lokalny serwer Playground oraz integracja z agentami AI poprzez MCP) zalecane jest środowisko **Node.js** oraz pakiet **`@automattic/mcp-wordpress-remote`**.

### 1. Instalacja środowiska Node.js

Wymagana wersja: **Node.js LTS (v20+ lub nowszy)**.

- **Windows (PowerShell / winget):**
  ```powershell
  winget install OpenJS.NodeJS.LTS
  ```
  _(lub pobierz instalator `.msi` z oficjalnej strony [nodejs.org](https://nodejs.org))_
- **macOS (Homebrew):**
  ```bash
  brew install node
  ```
- **Linux (Ubuntu/Debian):**
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```
- **Weryfikacja instalacji:**
  ```bash
  node -v   # np. v22.x lub v24.x
  npm -v    # np. 10.x lub 12.x
  ```

---

### 2. Instalacja zależności w tym katalogu (`package.json`)

W tym repozytorium znajduje się skonfigurowany plik [`package.json`](./package.json). Aby zainstalować wszystkie wymagane pakiety lokalnie, przejdź do katalogu projektu i wykonaj:

```bash
npm install
```

W katalogu `node_modules` zostaną zainstalowane:

- **`@automattic/mcp-wordpress-remote`** – oficjalny serwer proxy MCP firmy Automattic (polecenie `mcp-wordpress-remote`), łączący klienty AI ze zdalnymi i lokalnymi instancjami WordPressa z wtyczką Novamira.
- **`@wordpress/block-serialization-default-parser`** – oficjalny parser bloków Gutenberga używany przez silnik walidacji layoutu.
- **`@wp-playground/cli`** – oficjalne narzędzie WP Playground CLI do uruchamiania WordPressa lokalnie w Node.js (WebAssembly) bez Dockera czy MySQL.

#### Dostępne skrypty npm:

- `npm run start` (lub `npm run playground`) – uruchamia lokalny serwer WordPress Playground z naszym blueprintem na porcie `9400`:
  ```bash
  npm run start
  ```
- `npm run test:blueprint` – uruchamia blueprint weryfikacyjnie w trybie headless:
  ```bash
  npm run test:blueprint
  ```
- `npm run test:layout` – uruchamia walidator na przykładowym layoucie strony lądowania:
  ```bash
  npm run test:layout
  ```
- `npm run validate:layout -- <plik>` – waliduje dowolny kod bloków lub plik HTML pod kątem poprawności składni i hierarchii:
  ```bash
  npm run validate:layout -- dane/przykladowy-layout.html
  ```
- `npm run mcp` – uruchamia lokalne proxy MCP `mcp-wordpress-remote`.

---

### 3. Instalacja globalna `mcp-wordpress-remote` (opcjonalnie)

Możesz również zainstalować proxy globalnie w systemie, aby polecenie `mcp-wordpress-remote` było dostępne w dowolnej ścieżce:

```bash
npm install -g @automattic/mcp-wordpress-remote
```

---

## 🛠️ Sposoby uruchomienia Blueprintu

### 1. Bezpośrednio w przeglądarce (WordPress Playground)

Wystarczy wejść pod link:
👉 **[Uruchom WordPress + Novamira + WooCommerce (z repozytorium GitHub)](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/damadorPL/warsztat-wordcamp-wroclaw-2026/main/blueprint.json)**

Alternatywnie (bezpośrednio z zakodowanego hasha):
👉 **[Uruchom przez Data Hash](https://playground.wordpress.net/#eyIkc2NoZW1hIjoiaHR0cHM6Ly9wbGF5Z3JvdW5kLndvcmRwcmVzcy5uZXQvYmx1ZXByaW50LXNjaGVtYS5qc29uIiwibWV0YSI6eyJ0aXRsZSI6IldvcmRQcmVzcyArIE5vdmFtaXJhIE1DUCBTZXJ2ZXIgKyBXb29Db21tZXJjZSIsImRlc2NyaXB0aW9uIjoixZpyb2Rvd2lza28gV29yZFByZXNzIFBsYXlncm91bmQgeiB6YWluc3RhbG93YW7EhSB3dHljemvEhSBOb3ZhbWlyYSAoc2Vyd2VyIE1vZGVsIENvbnRleHQgUHJvdG9jb2wpIG9yYXogV29vQ29tbWVyY2UgeiBwcnp5a8WCYWRvd3ltaSBwcm9kdWt0YW1pLiBVbW/FvGxpd2lhIGFnZW50b20gQUkgYmV6cG/Fm3JlZG5pxIUgaW50ZWdyYWNqxJkgemUgc2tsZXBlbSBpIGVrb3N5c3RlbWVtIFdvcmRQcmVzcy4iLCJhdXRob3IiOiJLcnp5c3p0b2YgUmFkemlrb3dza2kgLyBXb3JkQ2FtcCBXcm9jxYJhdyAyMDI2IiwiY2F0ZWdvcmllcyI6WyJBSSIsIk1DUCIsIldvb0NvbW1lcmNlIiwiRS1Db21tZXJjZSIsIkRldmVsb3BlciBUb29scyIsIldvcmRDYW1wIl19LCJsYW5kaW5nUGFnZSI6Ii93cC1hZG1pbi9hZG1pbi5waHA/cGFnZT1ub3ZhbWlyYS1jb25uZWN0IiwicHJlZmVycmVkVmVyc2lvbnMiOnsicGhwIjoiOC4zIiwid3AiOiJsYXRlc3QifSwiZmVhdHVyZXMiOnsibmV0d29ya2luZyI6dHJ1ZX0sInNpdGVPcHRpb25zIjp7ImJsb2duYW1lIjoiV2Fyc3p0YXQgV29yZENhbXAgV3JvY8WCYXcgMjAyNiDigJMgTm92YW1pcmEgTUNQICYgV29vQ29tbWVyY2UifSwibG9naW4iOnRydWUsInN0ZXBzIjpbeyJzdGVwIjoiZGVmaW5lV3BDb25maWdDb25zdHMiLCJjb25zdHMiOnsiV1BfRU5WSVJPTk1FTlRfVFlQRSI6ImxvY2FsIn19LHsic3RlcCI6Imluc3RhbGxQbHVnaW4iLCJwbHVnaW5EYXRhIjp7InJlc291cmNlIjoidXJsIiwidXJsIjoiaHR0cHM6Ly9naXRodWIuY29tL3VzZS1ub3ZhbWlyYS9ub3ZhbWlyYS9yZWxlYXNlcy9kb3dubG9hZC92MS4xMi42L25vdmFtaXJhLTEuMTIuNi56aXAifSwib3B0aW9ucyI6eyJhY3RpdmF0ZSI6dHJ1ZX19LHsic3RlcCI6Imluc3RhbGxQbHVnaW4iLCJwbHVnaW5EYXRhIjp7InJlc291cmNlIjoid29yZHByZXNzLm9yZy9wbHVnaW5zIiwic2x1ZyI6Indvb2NvbW1lcmNlIn0sIm9wdGlvbnMiOnsiYWN0aXZhdGUiOnRydWV9fSx7InN0ZXAiOiJzZXRTaXRlT3B0aW9ucyIsIm9wdGlvbnMiOnsicGVybWFsaW5rX3N0cnVjdHVyZSI6Ii8lcG9zdG5hbWUlLyJ9fSx7InN0ZXAiOiJ1bnppcCIsInppcEZpbGUiOnsicmVzb3VyY2UiOiJ1cmwiLCJ1cmwiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vZGFtYWRvclBML3dhcnN6dGF0LXdvcmRjYW1wLXdyb2NsYXctMjAyNi9tYWluL2RhbmUvc2FtcGxlLWRhdGEvc2FtcGxlLW1lZGlhLnppcCJ9LCJleHRyYWN0VG9QYXRoIjoiL3dvcmRwcmVzcy93cC1jb250ZW50L3VwbG9hZHMifSx7InN0ZXAiOiJpbXBvcnRXeHIiLCJmaWxlIjp7InJlc291cmNlIjoidmZzIiwicGF0aCI6Ii93b3JkcHJlc3Mvd3AtY29udGVudC9wbHVnaW5zL3dvb2NvbW1lcmNlL3NhbXBsZS1kYXRhL3NhbXBsZV9wcm9kdWN0cy54bWwifSwiZmV0Y2hBdHRhY2htZW50cyI6ZmFsc2V9LHsic3RlcCI6InJ1blBIUCIsImNvZGUiOiI8P3BocCByZXF1aXJlICcvd29yZHByZXNzL3dwLWxvYWQucGhwJzsgdXBkYXRlX29wdGlvbignbm92YW1pcmFfYWlfYWJpbGl0aWVzX2VuYWJsZWQnLCAnMScpOyB1cGRhdGVfb3B0aW9uKCdub3ZhbWlyYV9haV9hYmlsaXRpZXNfZG9tYWluJywgKHN0cmluZykgd3BfcGFyc2VfdXJsKGhvbWVfdXJsKCksIFBIUF9VUkxfSE9TVCkpOyBkZWxldGVfdHJhbnNpZW50KCdfd2NfYWN0aXZhdGlvbl9yZWRpcmVjdCcpOyB1cGRhdGVfb3B0aW9uKCd3b29jb21tZXJjZV90YXNrX2xpc3RfaGlkZGVuJywgJ3llcycpOyB1cGRhdGVfb3B0aW9uKCd3b29jb21tZXJjZV9vbmJvYXJkaW5nX3Byb2ZpbGUnLCBhcnJheSgnY29tcGxldGVkJyA9PiB0cnVlKSk7IHVwZGF0ZV9vcHRpb24oJ3dvb2NvbW1lcmNlX2NvbWluZ19zb29uJywgJ25vJyk7IHVwZGF0ZV9vcHRpb24oJ3dvb2NvbW1lcmNlX3N0b3JlX2FkZHJlc3MnLCAnUnluZWsgMScpOyB1cGRhdGVfb3B0aW9uKCd3b29jb21tZXJjZV9zdG9yZV9jaXR5JywgJ1dyb2NsYXcnKTsgdXBkYXRlX29wdGlvbignd29vY29tbWVyY2VfZGVmYXVsdF9jb3VudHJ5JywgJ1BMOlBMLURTJyk7IHVwZGF0ZV9vcHRpb24oJ3dvb2NvbW1lcmNlX2N1cnJlbmN5JywgJ1BMTicpOyBpZiAoY2xhc3NfZXhpc3RzKCdXQ19JbnN0YWxsJykpIHsgV0NfSW5zdGFsbDo6Y3JlYXRlX3BhZ2VzKCk7IH0gJHVwbG9hZF9kaXIgPSB3cF91cGxvYWRfZGlyKCk7ICRpbWFnZXMgPSBhcnJheSgndi1uZWNrLXQtc2hpcnQnID0+ICcyMDE3LzEyL3ZuZWNrLXRlZS0yLmpwZycsICdob29kaWUnID0+ICcyMDE3LzEyL2hvb2RpZS0yLmpwZycsICdob29kaWUtd2l0aC1sb2dvJyA9PiAnMjAxNy8xMi9ob29kaWUtd2l0aC1sb2dvLTIuanBnJywgJ3Qtc2hpcnQnID0+ICcyMDE3LzEyL3RzaGlydC0yLmpwZycsICdiZWFuaWUnID0+ICcyMDE3LzEyL2JlYW5pZS0yLmpwZycsICdiZWx0JyA9PiAnMjAxNy8xMi9iZWx0LTIuanBnJywgJ2NhcCcgPT4gJzIwMTcvMTIvY2FwLTIuanBnJywgJ3N1bmdsYXNzZXMnID0+ICcyMDE3LzEyL3N1bmdsYXNzZXMtMi5qcGcnLCAnaG9vZGllLXdpdGgtcG9ja2V0JyA9PiAnMjAxNy8xMi9ob29kaWUtd2l0aC1wb2NrZXQtMi5qcGcnLCAnaG9vZGllLXdpdGgtemlwcGVyJyA9PiAnMjAxNy8xMi9ob29kaWUtd2l0aC16aXBwZXItMi5qcGcnLCAnbG9uZy1zbGVldmUtdGVlJyA9PiAnMjAxNy8xMi9sb25nLXNsZWV2ZS10ZWUtMi5qcGcnLCAncG9sbycgPT4gJzIwMTcvMTIvcG9sby0yLmpwZycsICdhbGJ1bScgPT4gJzIwMTcvMTIvYWxidW0tMS5qcGcnLCAnc2luZ2xlJyA9PiAnMjAxNy8xMi9zaW5nbGUtMS5qcGcnLCAndC1zaGlydC13aXRoLWxvZ28nID0+ICcyMDE3LzEyL3Qtc2hpcnQtd2l0aC1sb2dvLTEuanBnJywgJ2JlYW5pZS13aXRoLWxvZ28nID0+ICcyMDE3LzEyL2JlYW5pZS13aXRoLWxvZ28tMS5qcGcnLCAnbG9nby1jb2xsZWN0aW9uJyA9PiAnMjAxNy8xMi9sb2dvLTEuanBnJywgJ3dvcmRwcmVzcy1wZW5uYW50JyA9PiAnMjAxNy8xMi9wZW5uYW50LTEuanBnJyk7ICRhbGxfZmlsZXMgPSBhcnJheV91bmlxdWUoYXJyYXlfbWVyZ2UoYXJyYXlfdmFsdWVzKCRpbWFnZXMpLCBhcnJheSgnMjAxNy8xMi92bmVjaC10ZWUtZ3JlZW4tMS5qcGcnLCAnMjAxNy8xMi92bmVjaC10ZWUtYmx1ZS0xLmpwZycsICdob29kaWUtYmx1ZS0xLmpwZycsICdob29kaWUtZ3JlZW4tMS5qcGcnKSkpOyAkYXR0YWNoX21hcCA9IGFycmF5KCk7IGZvcmVhY2ggKCRhbGxfZmlsZXMgYXMgJHJlbF9wYXRoKSB7ICRmaWxlbmFtZSA9IGJhc2VuYW1lKCRyZWxfcGF0aCk7ICRhaWQgPSB3cF9pbnNlcnRfcG9zdChhcnJheSgncG9zdF90aXRsZScgPT4gcHJlZ19yZXBsYWNlKCcvXFwuW14uXStkLycsICcnLCAkZmlsZW5hbWUpLCAncG9zdF9uYW1lJyA9PiBzYW5pdGl6ZV90aXRsZSgkZmlsZW5hbWUpLCAncG9zdF9zdGF0dXMnID0+ICdpbmhlcml0JywgJ3Bvc3RfdHlwZScgPT4gJ2F0dGFjaG1lbnQnLCAncG9zdF9taW1lX3R5cGUnID0+ICdpbWFnZS9qcGVnJywgJ2d1aWQnID0+ICR1cGxvYWRfZGlyWydiYXNldXJsJ10gLiAnLycgLiAkcmVsX3BhdGgpKTsgaWYgKCRhaWQgJiYgIWlzX3dwX2Vycm9yKCRhaWQpKSB7IHVwZGF0ZV9wb3N0X21ldGEoJGFpZCwgJ193cF9hdHRhY2hlZF9maWxlJywgJHJlbF9wYXRoKTsgJGF0dGFjaF9tYXBbJHJlbF9wYXRoXSA9ICRhaWQ7IH0gfSBpZiAoZnVuY3Rpb25fZXhpc3RzKCd3Y19nZXRfcHJvZHVjdHMnKSkgeyBmb3JlYWNoICh3Y19nZXRfcHJvZHVjdHMoYXJyYXkoJ2xpbWl0JyA9PiAtMSkpIGFzICRwKSB7ICRzbHVnID0gJHAtPmdldF9zbHVnKCk7IGlmIChpc3NldCgkaW1hZ2VzWyRzbHVnXSkgJiYgaXNzZXQoJGF0dGFjaF9tYXBbJGltYWdlc1skc2x1Z11dKSkgeyBzZXRfcG9zdF90aHVtYm5haWwoJHAtPmdldF9pZCgpLCAkYXR0YWNoX21hcFskaW1hZ2VzWyRzbHVnXV0pOyB9IH0gfSJ9XX0=)**

Link bezpośredni z parametrem URL:

```text
https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/damadorPL/warsztat-wordcamp-wroclaw-2026/main/blueprint.json
```

---

### 2. Lokalnie przez oficjalne CLI (`@wp-playground/cli`)

Możesz uruchomić lokalny serwer WordPress Playground bezpośrednio jednym poleceniem `npx` (bez konieczności wcześniejszego instalowania zależności czy klonowania dodatkowych narzędzi):

```bash
# Szybkie uruchomienie lokalnego serwera z plikiem blueprint.json na porcie 9400
npx -y @wp-playground/cli server --blueprint=blueprint.json --port=9400
```

Jeśli masz sklonowane repozytorium i zainstalowane zależności lokalnie (`npm install`), możesz użyć skróconego skryptu npm:

```bash
npm run start
```

> [!TIP]
> **Automatyczne Hasło Aplikacji (Zero Configuration):**  
> Plik `blueprint.json` automatycznie konfiguruje i przypisuje hasło aplikacji WordPress dla użytkownika `admin`:  
> `novamira-secret-pass-2026`  
> Dzięki temu po starcie serwera lokalnego **nie musisz wchodzić do Kokpitu WordPressa i ręcznie generować hasła aplikacji** – Twoje narzędzia AI i serwer MCP połączą się natychmiast!

Po uruchomieniu serwera przejdź w przeglądarce pod adres:

```text
http://127.0.0.1:9400/wp-admin/admin.php?page=novamira-connect
```
- **Login:** `admin`
- **Hasło:** `password`
- **Hasło Aplikacji dla MCP:** `novamira-secret-pass-2026`

Możesz też zweryfikować poprawność wykonania blueprintu bez uruchamiania serwera www:

```bash
npm run test:blueprint
# lub: npx -y @wp-playground/cli run-blueprint --blueprint=blueprint.json
```

---

### 3. W WordPress Studio (Automattic)

1. Pobierz lub otwórz [WordPress Studio](https://developer.wordpress.com/studio/).
2. Utwórz nową witrynę lub wybierz opcję importu Blueprintu.
3. Wskaż plik [`blueprint.json`](./blueprint.json).
4. Kliknij **Create Site**.

---

## 🧱 Baza referencyjna bloków i walidacja layoutu (WordPress Core & WooCommerce)

Podczas generowania stron przez agentów AI najczęstszym problemem są **halucynacje znaczników blokowych Gutenberga** (niepoprawne nazwy atrybutów, błędna hierarchia zagnieżdżania lub wstawianie statycznego HTML do bloków dynamicznych). W edytorze WordPress skutkuje to żółtym ostrzeżeniem **„Ten blok zawiera nieprawidłową lub nieobsługiwaną treść” (Attempt Block Recovery)**.

W katalogu [`dane/`](./dane/) przygotowano kompletną bazę wiedzy i narzędzia walidacyjne oparte na oficjalnym kodzie źródłowym WordPressa i WooCommerce:

### 📁 Zasoby w katalogu `dane/`:

- **[`dane/core-blocks.json`](./dane/core-blocks.json)** – pełne schematy **116 oficjalnych bloków WordPress Core** (typy, atrybuty, wspierane funkcje `supports`, reguły zagnieżdżania `parent`/`ancestor`, gotowe przykłady markup'u).
- **[`dane/woocommerce-blocks.json`](./dane/woocommerce-blocks.json)** – schematy **174 bloków WooCommerce v11.1.2** (kolekcje produktów `product-collection`, szablony `product-template`, koszyk `cart`, kasa `checkout`, filtry).
- **[`dane/blocks-reference.json`](./dane/blocks-reference.json)** – zunifikowany skorowidz z wyodrębnionymi zestawami bloków układu i e-commerce.
- **[`dane/BLOCKS-REFERENCE.md`](./dane/BLOCKS-REFERENCE.md)** – kompendium wiedzy dla promptów systemowych agenta AI (reguły delimiterów, klasy CSS, layouty `constrained`/`flex`/`grid`, tokeny kolorów i odstępów, gotowe wzorce).
- **[`dane/validate-layout.js`](./dane/validate-layout.js)** – silnik walidacji w Node.js wykorzystujący oficjalny parser `@wordpress/block-serialization-default-parser`.
- **[`dane/przykladowy-layout.html`](./dane/przykladowy-layout.html)** – w 100% zweryfikowany szablon landing page łączący sekcję Hero, 3 kolumny korzyści oraz kolekcję produktów WooCommerce.

### 🧪 Jak uruchomić walidację layoutu:

```bash
# 1. Przetestowanie przykładowego layoutu:
npm run test:layout

# 2. Walidacja dowolnego pliku HTML z blokami:
npm run validate:layout -- dane/przykladowy-layout.html

# 3. Walidacja bezpośrednio z przekazanego ciągu znaków:
node dane/validate-layout.js "<!-- wp:columns -->...<!-- /wp:columns -->"
```

### 🤖 Wykorzystanie przez Agenta AI w workflow:

1. **Analiza schematu:** Agent odczytuje definicję bloku z `dane/core-blocks.json` lub `dane/woocommerce-blocks.json`.
2. **Generowanie kodu:** Tworzy markup Gutenberga zgodnie z regułami opisanymi w `dane/BLOCKS-REFERENCE.md`.
3. **Automatyczna weryfikacja:** Uruchamia `validate-layout.js` w celu eliminacji błędów hierarchii i atrybutów.
4. **Publikacja:** Bezpiecznie publikuje wpis/stronę w WordPressie za pośrednictwem serwera Novamira MCP lub REST API.

---

## 🎓 Scenariusz warsztatowy – WordCamp Wrocław 2026

Podczas warsztatu przechodzimy przez następujące etapy:

### Krok 1: Otwarcie Playgroundu

Uczestnicy klikają [link do Playgroundu](https://playground.wordpress.net/#eyIkc2NoZW1hIjoiaHR0cHM6Ly9wbGF5Z3JvdW5kLndvcmRwcmVzcy5uZXQvYmx1ZXByaW50LXNjaGVtYS5qc29uIiwibWV0YSI6eyJ0aXRsZSI6IldvcmRQcmVzcyArIE5vdmFtaXJhIE1DUCBTZXJ2ZXIiLCJkZXNjcmlwdGlvbiI6IsWacm9kb3dpc2tvIFdvcmRQcmVzcyBQbGF5Z3JvdW5kIHogemFpbnN0YWxvd2FuxIUgd3R5Y3prxIUgTm92YW1pcmEgKHNlcndlciBNb2RlbCBDb250ZXh0IFByb3RvY29sKS4gVW1vxbxsaXdpYSBhZ2VudG9tIEFJIGJlenBvxZtyZWRuacSFIGludGVncmFjasSZIHogaW5zdGFuY2rEhSBXb3JkUHJlc3MuIiwiYXV0aG9yIjoiV29yZENhbXAgV3JvY8WCYXcgMjAyNiIsImNhdGVnb3JpZXMiOlsiQUkiLCJNQ1AiLCJEZXZlbG9wZXIgVG9vbHMiLCJXb3JkQ2FtcCJdfSwibGFuZGluZ1BhZ2UiOiIvd3AtYWRtaW4vYWRtaW4ucGhwP3BhZ2U9bm92YW1pcmEtY29ubmVjdCIsInByZWZlcnJlZFZlcnNpb25zIjp7InBocCI6IjguMyIsIndwIjoibGF0ZXN0In0sImZlYXR1cmVzIjp7Im5ldHdvcmtpbmciOnRydWV9LCJzaXRlT3B0aW9ucyI6eyJibG9nbmFtZSI6IldhcnN6dGF0IFdvcmRDYW1wIFdyb2PFgmF3IDIwMjYg4oCTIE5vdmFtaXJhIE1DUCJ9LCJsb2dpbiI6dHJ1ZSwic3RlcHMiOlt7InN0ZXAiOiJkZWZpbmVXcENvbmZpZ0NvbnN0cyIsImNvbnN0cyI6eyJXUF9FTlZJUk9OTUVOVF9UWVBFIjoibG9jYWwifX0seyJzdGVwIjoiaW5zdGFsbFBsdWdpbiIsInBsdWdpbkRhdGEiOnsicmVzb3VyY2UiOiJ1cmwiLCJ1cmwiOiJodHRwczovL2dpdGh1Yi5jb20vdXNlLW5vdmFtaXJhL25vdmFtaXJhL3JlbGVhc2VzL2Rvd25sb2FkL3YxLjEyLjUvbm92YW1pcmEtMS4xMi41LnppcCJ9LCJvcHRpb25zIjp7ImFjdGl2YXRlIjp0cnVlfX0seyJzdGVwIjoic2V0U2l0ZU9wdGlvbnMiLCJvcHRpb25zIjp7InBlcm1hbGlua19zdHJ1Y3R1cmUiOiIvJXBvc3RuYW1lJS8ifX0seyJzdGVwIjoicnVuUEhQIiwiY29kZSI6Ijw/cGhwIHJlcXVpcmUgJy93b3JkcHJlc3Mvd3AtbG9hZC5waHAnOyB1cGRhdGVfb3B0aW9uKCdub3ZhbWlyYV9haV9hYmlsaXRpZXNfZW5hYmxlZCcsICcxJyk7IHVwZGF0ZV9vcHRpb24oJ25vdmFtaXJhX2FpX2FiaWxpdGllc19kb21haW4nLCAoc3RyaW5nKSB3cF9wYXJzZV91cmwoaG9tZV91cmwoKSwgUEhQX1VSTF9IT1NUKSk7In1dfQ==) lub uruchamiają CLI lokalnie (`npm run start`). Po załadowaniu przeglądarka automatycznie otwiera panel **Novamira → Connect**.

### Krok 2: Konfiguracja połączenia w agencie AI

Do połączenia agenta AI z WordPressem używamy serwera proxy **`mcp-wordpress-remote`** (z pakietu `@automattic/mcp-wordpress-remote`).

#### Opcja A: Zainstalowana komenda `mcp-wordpress-remote`

W pliku konfiguracyjnym MCP Twojego agenta (np. `mcp_config.json`, `claude_desktop_config.json` lub Cursor/Windsurf):

```json
{
  "mcpServers": {
    "novamira-playground": {
      "command": "mcp-wordpress-remote",
      "args": [],
      "env": {
        "WP_API_URL": "http://127.0.0.1:9400/wp-json/mcp/novamira",
        "WP_API_USERNAME": "admin",
        "WP_API_PASSWORD": "novamira-secret-pass-2026"
      }
    }
  }
}
```

#### Opcja B: Wywołanie przez `npx` (bez instalacji globalnej)

```json
{
  "mcpServers": {
    "novamira-playground": {
      "command": "npx",
      "args": ["-y", "@automattic/mcp-wordpress-remote"],
      "env": {
        "WP_API_URL": "http://127.0.0.1:9400/wp-json/mcp/novamira",
        "WP_API_USERNAME": "admin",
        "WP_API_PASSWORD": "novamira-secret-pass-2026"
      }
    }
  }
}
```

> 📖 **Kompletne instrukcje i szablony konfiguracji dla wszystkich środowisk AI:**  
> Szczegółowe przewodniki konfiguracji MCP w edytorach (Cursor, Windsurf, VS Code, Zed), aplikacjach desktopowych (Claude Desktop, Goose, LibreChat, LM Studio) oraz frameworkach (Claude Code CLI, LangChain, LangGraph, Aider i wiele innych) znajdziesz w katalogu [`konfiguracja/`](./konfiguracja/README.md).

### Krok 3: Przykładowe zadania warsztatowe

> 💡 **Gotowe prompty warsztatowe:** Kompletne szablony promptów (zarówno w wersji jednozdaniowej, jak i rozszerzonej technicznej) oraz gotowy System Prompt znajdziesz w katalogu [`prompty/`](./prompty/README.md).

Po sparowaniu klienta AI z Playgroundem możemy wydawać agentowi polecenia w języku naturalnym:

1. **Audyt środowiska:** ([`prompty/01-audyt-srodowiska.md`](./prompty/01-audyt-srodowiska.md))
   > _"Sprawdź jakie wtyczki i motywy są aktywne w tym WordPressie i wyświetl podstawowe informacje o konfiguracji bazy danych."_
2. **Generowanie treści:** ([`prompty/02-generowanie-tresci.md`](./prompty/02-generowanie-tresci.md))
   > _"Stwórz nowy wpis na blogu pod tytułem 'Witaj WordCamp Wrocław 2026', dodaj do niego 3 akapity o przyszłości AI w WordPressie i oznacz kategorią 'Konferencje'."_
3. **Modyfikacja kodu / Sandbox:** ([`prompty/03-modyfikacja-kodu-sandbox.md`](./prompty/03-modyfikacja-kodu-sandbox.md))
   > _"Napisz mini-wtyczkę w katalogu novamira-sandbox, która dodaje powitanie w panelu administracyjnym i przetestuj jej działanie."_
4. **Diagnostyka bazy:** ([`prompty/04-diagnostyka-bazy-danych.md`](./prompty/04-diagnostyka-bazy-danych.md))
   > _"Wylistuj ostatnie 5 wpisów bezpośrednio z bazy danych za pomocą zapytania SQL przez mechanizm novamira."_
5. **Tworzenie i walidacja layoutu z blokami WooCommerce:** ([`prompty/05-tworzenie-i-walidacja-layoutu.md`](./prompty/05-tworzenie-i-walidacja-layoutu.md))
   > _"Na podstawie dokumentacji w pliku dane/BLOCKS-REFERENCE.md wygeneruj stronę główną z sekcją Hero, dwoma kolumnami i kolekcją produktów WooCommerce, a następnie zweryfikuj jej poprawność poprzez walidację layoutu."_

---

## 🔒 Bezpieczeństwo

- Wtyczka Novamira daje agentowi AI **pełne uprawnienia** do wykonywania kodu PHP, bazy danych oraz edycji plików.
- **WordPress Playground to środowisko izolowane (Sandbox):** Wszystkie operacje wykonywane są lokalnie w przeglądarce lub w kontenerze CLI i nie zagrażają danym produkcyjnym.
- Nigdy nie używaj takich uprawnień na serwerach produkcyjnych bez restrykcyjnego uwierzytelniania i bieżących kopii zapasowych!

---

## 📚 Przydatne źródła

- [Repozytorium wtyczki Novamira na GitHubie](https://github.com/use-novamira/novamira) – wtyczka serwera MCP dla WordPressa.
- [Dokumentacja oficjalna Novamira.ai](https://novamira.ai) – oficjalna dokumentacja projektu Novamira.
- [wp-blockmarkup-mcp (Pluginslab)](https://github.com/pluginslab/wp-blockmarkup-mcp) – dedykowany serwer MCP udostępniający agentom AI bazę schematów bloków Gutenberga (Core i WooCommerce).
- [Oficjalna strona WordCamp Wrocław 2026](https://wroclaw.wordcamp.org/) – strona konferencji.

---

## 📱 Kod QR repozytorium

Zeskanuj poniższy kod QR, aby przejść bezpośrednio do tego repozytorium na GitHubie:

<p align="center">
  <a href="https://github.com/damadorPL/warsztat-wordcamp-wroclaw-2026">
    <img src="./qrcode.png" alt="QR Code - Warsztat WordCamp Wrocław 2026" width="220" />
  </a>
  <br />
  <sub><a href="https://github.com/damadorPL/warsztat-wordcamp-wroclaw-2026">https://github.com/damadorPL/warsztat-wordcamp-wroclaw-2026</a></sub>
</p>
