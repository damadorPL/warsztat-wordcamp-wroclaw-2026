# Kompendium Konfiguracji Serwerów MCP (Model Context Protocol)

Katalog ten zawiera kompletną, zweryfikowaną dokumentację oraz gotowe szablony konfiguracji serwerów **Model Context Protocol (MCP)** w najpopularniejszych środowiskach i harnessach agentowych.

Materiały zostały przygotowane na warsztat **WordCamp Wrocław 2026** w celu szybkiego spięcia dowolnego klienta AI z lokalnym środowiskiem **WordPress Playground** i wtyczką **Novamira MCP**.

---

## 📚 Spis Treści Dokumentacji

1. **[01. Edytory Kodu i IDE](./01-edytory-i-ide.md)**
   - **Cursor IDE** (ustawienia globalne `~/.cursor/mcp.json` vs projektowe `.cursor/mcp.json`)
   - **Windsurf (Codeium)** (`~/.codeium/windsurf/mcp_config.json`)
   - **Visual Studio Code**:
     - Natywne wsparcie VS Code (`.vscode/mcp.json` – klucz `"servers"`)
     - Rozszerzenie **Cline** (`cline_mcp_settings.json`)
     - Rozszerzenie **Roo Code** (`.roo/mcp.json` oraz `mcp_settings.json`)
     - Rozszerzenie **Continue.dev** (format YAML `config.yaml` / `.continue/mcpServers/`)
   - **Zed Editor** (`settings.json` – klucz `"context_servers"`)

2. **[02. Aplikacje Desktopowe i Web GUI](./02-aplikacje-desktopowe.md)**
   - **Claude Desktop** (Anthropic referencyjny host: `%APPDATA%\Claude\claude_desktop_config.json`)
   - **Goose (Block / Square)** (CLI `goose configure` oraz `~/.config/goose/config.yaml`)
   - **LibreChat** (`librechat.yaml` w środowisku Docker i Bare-metal)
   - **LM Studio** (Host MCP dla modeli lokalnych: `%USERPROFILE%\.lmstudio\mcp.json`)
   - **Open WebUI** (Integracja Streamable HTTP oraz kontener proxy MCPO)
   - **Chatbox** (Konfiguracja w GUI w trybie *Work Mode*)

3. **[03. Frameworki Agentowe i Narzędzia CLI](./03-frameworki-i-cli-harnesses.md)**
   - **Claude Code CLI** (Anthropic terminal agent: polecenia `claude mcp add/list/remove`, `.mcp.json`)
   - **LangChain & LangGraph (TypeScript / JS)** (integracja z `@langchain/mcp-adapters`)
   - **CrewAI & Microsoft AutoGen** (moduły `crewai.mcp` oraz `autogen-ext[mcp]`)
   - **OpenHands (dawniej OpenDevin)** (konfiguracja `config.toml` `[mcp]`)
   - **Google Antigravity (`agy`)** (polecenia `agy mcp add/list` oraz `~/.gemini/config/mcp_config.json`)
   - **Aider & AiderDesk** (mostki MCP)
   - **Diagnostyka z oficjalnym MCP Inspector** (`npx @modelcontextprotocol/inspector`)

4. **[04. Gotowe Szablony Konfiguracji (Katalog `04-szablony/`)](./04-szablony/)**
   - [`claude_desktop_config.json`](./04-szablony/claude_desktop_config.json) – dla Claude Desktop
   - [`cursor_mcp.json`](./04-szablony/cursor_mcp.json) – do wklejenia w `.cursor/mcp.json`
   - [`windsurf_mcp_config.json`](./04-szablony/windsurf_mcp_config.json) – dla Cascade w Windsurf
   - [`vscode_mcp.json`](./04-szablony/vscode_mcp.json) – dla natywnego VS Code (`.vscode/mcp.json`)
   - [`cline_mcp_settings.json`](./04-szablony/cline_mcp_settings.json) – dla rozszerzenia Cline
   - [`roo_mcp.json`](./04-szablony/roo_mcp.json) – dla rozszerzenia Roo Code
   - [`zed_settings.json`](./04-szablony/zed_settings.json) – dla edytora Zed
   - [`goose_config.yaml`](./04-szablony/goose_config.yaml) – dla agenta Goose
   - [`librechat.yaml`](./04-szablony/librechat.yaml) – dla LibreChat
   - [`openhands_config.toml`](./04-szablony/openhands_config.toml) – dla OpenHands
   - [`claude_code_mcp.json`](./04-szablony/claude_code_mcp.json) – plik `.mcp.json` dla Claude Code
   - [`langgraph-agent.ts`](./04-szablony/langgraph-agent.ts) – gotowy skrypt w TypeScript uruchamiający agenta LangGraph z narzędziami MCP

---

## 📊 Wielka Tabela Porównawcza Środowisk

| Harness / Klient AI | Format pliku | Ścieżka konfiguracji (Windows) | Główny klucz | Transporty |
|:---|:---|:---|:---|:---|
| **Claude Desktop** | JSON | `%APPDATA%\Claude\claude_desktop_config.json` | `"mcpServers"` | `stdio` |
| **Cursor** | JSON | `%USERPROFILE%\.cursor\mcp.json` lub `.cursor/mcp.json` | `"mcpServers"` | `stdio`, `sse`, `http` |
| **Windsurf** | JSON | `%USERPROFILE%\.codeium\windsurf\mcp_config.json` | `"mcpServers"` | `stdio`, `sse` |
| **VS Code (Natywny)** | JSON | `%APPDATA%\Code\User\mcp.json` lub `.vscode/mcp.json` | `"servers"` | `stdio`, `http`, `sse` |
| **Cline (VS Code)** | JSON | `globalStorage/saoudrizwan.claude-dev/.../cline_mcp_settings.json` | `"mcpServers"` | `stdio`, `streamableHttp` |
| **Roo Code (VS Code)** | JSON | `.roo/mcp.json` lub `globalStorage/.../mcp_settings.json` | `"mcpServers"` | `stdio`, `streamable-http` |
| **Continue.dev** | YAML | `%USERPROFILE%\.continue\config.yaml` | `mcpServers:` | `stdio` |
| **Zed Editor** | JSON | `%APPDATA%\Zed\settings.json` | `"context_servers"` | `stdio`, `remote` |
| **Claude Code CLI** | CLI / JSON | `~/.claude.json` lub `.mcp.json` w projekcie | `"mcpServers"` | `stdio`, `http` |
| **Goose** | YAML | `%APPDATA%\Block\goose\config\config.yaml` | `extensions:` | `stdio`, `sse`, `http` |
| **LibreChat** | YAML | `./librechat.yaml` | `mcpServers:` | `stdio`, `sse` |
| **LM Studio** | JSON | `%USERPROFILE%\.lmstudio\mcp.json` | `"mcpServers"` | `stdio` |
| **OpenHands** | TOML | `./config.toml` | `[mcp]` | `shttp`, `sse`, `stdio` |
| **Google Antigravity**| CLI / JSON | `%USERPROFILE%\.gemini\config\mcp_config.json` | `"mcpServers"` | `stdio`, `http` |

---

## ⚡ Szybki Start na Warsztatach (Konfiguracja Novamira MCP)

Do połączenia dowolnego z powyższych agentów z lokalną instancją **WordPress Playground** działającą na porcie `9400` (`npm run start`):

1. **Uruchom serwer WordPress Playground:**
   ```bash
   npm run start
   ```
2. **Skopiuj szablon:** Wybierz odpowiedni plik z podkatalogu [`04-szablony/`](./04-szablony/) i wklej do konfiguracji swojego programu.
3. **Podstaw dane logowania:** Uzupełnij `WP_API_PASSWORD` wygenerowanym hasłem aplikacji (Application Password) z panelu WordPressa (`Użytkownicy -> Profil -> Hasła aplikacji`).
4. **Przetestuj połączenie:** Wyślij prompt weryfikacyjny z pliku [`prompty/00-weryfikacja-polaczenia-mcp.md`](../prompty/00-weryfikacja-polaczenia-mcp.md).

---

## 🛠️ Złota Lista Dobrych Praktyk i Rozwiązywania Problemów

1. **Flaga `-y` przy wywołaniach `npx`:**
   Zawsze dodawaj `-y` (np. `"args": ["-y", "@automattic/mcp-wordpress-remote"]`). W przeciwnym razie proces zatrzyma się w tle na pytaniu o zgodę na instalację pakietu.
2. **Ścieżki na systemie Windows:**
   W plikach `.json` separatory ścieżek Windows muszą być podwojone: `"C:\\Katalog\\Projekt"` lub zapisane w notacji uniksowej `"C:/Katalog/Projekt"`.
3. **Zmienne środowiskowe `PATH`:**
   Aplikacje okienkowe (np. Claude Desktop, Windsurf, Zed) uruchamiane ze skrótów systemowych nie zawsze dziedziczą najświeższą wartość zmiennej `PATH`. Jeśli napotkasz błąd `ENOENT`, podaj pełną bezwzględną ścieżkę do `node.exe` lub `npx.cmd`.
4. **Izolacja strumieni `STDOUT` vs `STDERR`:**
   Komunikacja MCP opiera się na JSON-RPC 2.0 przesyłanym przez `STDOUT`. Jakikolwiek zwykły komunikat tekstowy (np. `console.log` czy `echo`) skierowany na `STDOUT` zepsuje parser protokołu. Wszystkie logi deweloperskie muszą trafiać do strumienia błędów `STDERR`.
5. **Narzędzie diagnostyczne:**
   Przetestuj dowolny serwer przed podpięciem do agenta za pomocą:
   ```bash
   npx -y @modelcontextprotocol/inspector npx -y @automattic/mcp-wordpress-remote
   ```
