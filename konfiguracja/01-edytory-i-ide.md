# Instalacja i Konfiguracja Serwerów MCP w Edytorach Kodu i IDE

Niniejszy przewodnik opisuje krok po kroku instalację, konfigurację i weryfikację działania serwerów **Model Context Protocol (MCP)** w najpopularniejszych edytorach kodu i środowiskach programistycznych:
- **Cursor**
- **Windsurf (Codeium)**
- **VS Code (Natywne wsparcie oraz wtyczki Cline, Roo Code, Continue.dev)**
- **Zed Editor**

---

## 1. Cursor IDE

Cursor oferuje pełne natywne wsparcie dla protokołu MCP na poziomie globalnym (dla całego systemu użytkownika) oraz na poziomie konkretnego projektu (workspace).

### 1.1. Ścieżki plików konfiguracyjnych

* **Konfiguracja globalna (User):**
  * **Windows:** `%USERPROFILE%\.cursor\mcp.json`  
    *(np. `C:\Users\<Użytkownik>\.cursor\mcp.json`)*
  * **macOS:** `~/.cursor/mcp.json`
  * **Linux:** `~/.cursor/mcp.json`
* **Konfiguracja projektowa (Workspace):**
  * `<katalog_projektu>/.cursor/mcp.json`
  * *Zasada pierwszeństwa:* Jeśli serwer o tej samej nazwie istnieje w konfiguracji projektowej, nadpisuje on konfigurację globalną.

### 1.2. Format i składnia (JSON)

Głównym węzłem konfiguracji jest obiekt `"mcpServers"`.

```json
{
  "mcpServers": {
    "novamira-playground": {
      "command": "npx",
      "args": [
        "-y",
        "@automattic/mcp-wordpress-remote"
      ],
      "env": {
        "WP_API_URL": "http://127.0.0.1:9400/wp-json/mcp/novamira",
        "WP_API_USERNAME": "admin",
        "WP_API_PASSWORD": "<TWOJE_HASLO_APLIKACJI>"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\damador\\Documents\\Code\\warsztat-wordcamp-wroclaw-2026"
      ]
    },
    "remote-sse-service": {
      "type": "sse",
      "url": "http://127.0.0.1:8080/sse",
      "headers": {
        "Authorization": "Bearer tajny-token"
      }
    }
  }
}
```

### 1.3. Instrukcja dodawania

#### Sposób A: Przez interfejs graficzny (UI)
1. Otwórz ustawienia skrótem `Ctrl + Shift + J` (Windows/Linux) lub `Cmd + Shift + J` (macOS), ewentualnie przejdź do: **Cursor Settings -> Features -> MCP**.
2. Kliknij przycisk **+ Add New MCP Server**.
3. Uzupełnij pola formularza:
   - **Name:** Unikalna nazwa serwera (np. `novamira-playground`).
   - **Type:** Wybierz `stdio` lub `sse`.
   - **Command:** Wprowadź pełne polecenie wraz z argumentami (dla `stdio`) lub URL (dla `sse`).
4. Kliknij **Add**. Cursor zaktualizuje konfigurację i uruchomi handshake protokołu.

#### Sposób B: Przez plik projektu `.cursor/mcp.json`
1. W katalogu głównym projektu utwórz folder `.cursor` i umieść w nim plik `mcp.json`.
2. Wklej powyższą definicję serwerów.
3. W ustawieniach Cursora (**Features -> MCP**) kliknij ikonę odświeżenia (**Reload**).

### 1.4. Weryfikacja i rozwiązywanie problemów
- **Wskaźnik statusu:** Obok nazwy serwera powinna świecić się **zielona kontrolka** wraz z listą wykrytych narzędzi (*Tools*).
- **Czerwona kontrolka:** Sprawdź czy polecenie `npx` lub `node` jest dostępne w zmiennej systemowej `PATH`.
- **Zawsze dodawaj `-y` do `npx`:** Bez tego proces zawiesi się w ukrytym terminalu, czekając na potwierdzenie `y/n`.

---

## 2. Windsurf (Codeium Cascade)

Windsurf integruje MCP w ramach asystenta **Cascade**, wykorzystując scentralizowany plik konfiguracyjny dla profilu użytkownika.

### 2.1. Ścieżki plików konfiguracyjnych

Windsurf używa wyłącznie globalnego pliku konfiguracyjnego:
* **Windows:** `%USERPROFILE%\.codeium\windsurf\mcp_config.json`  
  *(np. `C:\Users\<Użytkownik>\.codeium\windsurf\mcp_config.json`)*
* **macOS:** `~/.codeium/windsurf/mcp_config.json`
* **Linux:** `~/.codeium/windsurf/mcp_config.json`

### 2.2. Format i składnia (JSON)

```json
{
  "mcpServers": {
    "novamira-playground": {
      "command": "npx",
      "args": [
        "-y",
        "@automattic/mcp-wordpress-remote"
      ],
      "env": {
        "WP_API_URL": "http://127.0.0.1:9400/wp-json/mcp/novamira",
        "WP_API_USERNAME": "admin",
        "WP_API_PASSWORD": "<TWOJE_HASLO_APLIKACJI>"
      }
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    },
    "remote-stream": {
      "url": "https://mcp.mojadomena.pl/mcp",
      "headers": {
        "Authorization": "Bearer token-123"
      }
    }
  }
}
```

### 2.3. Instrukcja dodawania
1. W Windsurf otwórz panel boczny **Cascade**.
2. Kliknij ikonę wtyczki / młotka (**MCP**).
3. Kliknij **Configure** lub przejdź do: **Settings (Ctrl+,) -> Cascade -> Plugins (MCP servers)**.
4. Kliknij **View raw config** – Windsurf natychmiast otworzy plik `mcp_config.json`.
5. Dokonaj edycji w węźle `"mcpServers"` i zapisz plik (`Ctrl + S`).
6. W panelu Cascade kliknij ikonę **Refresh** (odśwież).

> [!WARNING]
> **Nie nadpisuj całego pliku pustym obiektem:** Jeśli masz już skonfigurowane inne narzędzia w Windsurf, dopisz nową konfigurację jako kolejny klucz w istniejącym obiekcie `"mcpServers"`.

---

## 3. Visual Studio Code (VS Code)

W VS Code dostępne są dwie ścieżki: **natywne wsparcie MCP** oraz **popularne rozszerzenia asystentów autonomicznych**.

---

### 3.1. Natywne wsparcie VS Code (`mcp.json`)

Natywne wsparcie MCP w VS Code definiuje serwery na poziomie profilu lub folderu projektu.

#### Ścieżki plików:
* **Globalna (User):**
  * **Windows:** `%APPDATA%\Code\User\mcp.json`
  * **macOS:** `~/Library/Application Support/Code/User/mcp.json`
  * **Linux:** `~/.config/Code/User/mcp.json`
* **Projektowa (Workspace):**
  * `<katalog_projektu>/.vscode/mcp.json`

#### Składnia (`.vscode/mcp.json`):
> [!IMPORTANT]
> W plikach `.vscode/mcp.json` kluczem głównym jest **`"servers"`** (zamiast `"mcpServers"`).

```json
{
  "servers": {
    "wordpress-remote": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@automattic/mcp-wordpress-remote"],
      "env": {
        "WP_API_URL": "http://127.0.0.1:9400/wp-json/mcp/novamira",
        "WP_API_USERNAME": "admin",
        "WP_API_PASSWORD": "<TWOJE_HASLO_APLIKACJI>"
      }
    }
  }
}
```

*Dostęp z UI:* Wciśnij `Ctrl + Shift + P` -> **MCP: Open Workspace Folder MCP Configuration**.

---

### 3.2. Rozszerzenie Cline (dawniej Claude Dev)

Cline zarządza serwerami MCP w dedykowanym magazynie globalnym lub w projekcie.

#### Ścieżka konfiguracji:
* **Windows:** `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
* **macOS:** `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
* **Linux:** `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

#### Składnia (`cline_mcp_settings.json`):
```json
{
  "mcpServers": {
    "novamira": {
      "command": "npx",
      "args": ["-y", "@automattic/mcp-wordpress-remote"],
      "env": {
        "WP_API_URL": "http://127.0.0.1:9400/wp-json/mcp/novamira",
        "WP_API_USERNAME": "admin",
        "WP_API_PASSWORD": "<TWOJE_HASLO_APLIKACJI>"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

*Dodawanie z UI:* Otwórz panel Cline -> ikona **MCP** na pasku narzędzi -> **Configure MCP Servers**.

---

### 3.3. Rozszerzenie Roo Code (Roo Clinic)

Roo Code posiada pełne rozróżnienie na serwery globalne oraz lokalne w projekcie.

#### Ścieżki konfiguracji:
* **Globalna:** `%APPDATA%\Code\User\globalStorage\rooveterinaryinc.roo-cline\settings\mcp_settings.json`
* **Projektowa:** `<katalog_projektu>/.roo/mcp.json`

#### Składnia (`.roo/mcp.json`):
```json
{
  "mcpServers": {
    "novamira-playground": {
      "command": "npx",
      "args": ["-y", "@automattic/mcp-wordpress-remote"],
      "env": {
        "WP_API_URL": "http://127.0.0.1:9400/wp-json/mcp/novamira",
        "WP_API_USERNAME": "admin",
        "WP_API_PASSWORD": "<TWOJE_HASLO_APLIKACJI>"
      }
    }
  }
}
```

*Dodawanie z UI:* Panel Roo Code -> ikona **MCP** -> przyciski **Edit Global MCP** lub **Edit Project MCP**.

---

### 3.4. Rozszerzenie Continue.dev

Continue.dev stosuje format **YAML** oraz strukturę modularną w katalogu `.continue/`.

> [!NOTE]
> Serwery MCP w Continue działają wyłącznie w trybie agenta (**Agent Mode**).

#### Ścieżki konfiguracji:
* **Globalna:** `%USERPROFILE%\.continue\config.yaml` (Windows) / `~/.continue/config.yaml` (macOS/Linux)
* **Projektowa:** `<katalog_projektu>/.continue/config.yaml` lub modularnie: `<katalog_projektu>/.continue/mcpServers/*.yaml`

#### Składnia YAML (`config.yaml`):
```yaml
name: WordCamp Workshop Config
version: 0.0.1
schema: v1

mcpServers:
  - name: novamira-playground
    command: npx
    args:
      - "-y"
      - "@automattic/mcp-wordpress-remote"
    env:
      WP_API_URL: "http://127.0.0.1:9400/wp-json/mcp/novamira"
      WP_API_USERNAME: "admin"
      WP_API_PASSWORD: "<TWOJE_HASLO_APLIKACJI>"
```

---

## 4. Zed Editor

Zed zintegrował obsługę MCP bezpośrednio w panelu Assistant Panel.

> [!IMPORTANT]
> Zed używa klucza **`"context_servers"`** (zamiast `"mcpServers"`). Użycie `"mcpServers"` spowoduje zignorowanie konfiguracji!

### 4.1. Ścieżki plików konfiguracyjnych
* **Globalna:**
  * **Windows:** `%APPDATA%\Zed\settings.json`
  * **macOS / Linux:** `~/.config/zed/settings.json`
* **Projektowa:** `<katalog_projektu>/.zed/settings.json`

### 4.2. Składnia (`settings.json`)
```json
{
  "context_servers": {
    "novamira-playground": {
      "command": "npx",
      "args": ["-y", "@automattic/mcp-wordpress-remote"],
      "env": {
        "WP_API_URL": "http://127.0.0.1:9400/wp-json/mcp/novamira",
        "WP_API_USERNAME": "admin",
        "WP_API_PASSWORD": "<TWOJE_HASLO_APLIKACJI>"
      }
    }
  }
}
```

### 4.3. Instrukcja dodawania
1. Wciśnij `Ctrl + Shift + P` (lub `Cmd + Shift + P` na macOS).
2. Wpisz: **`zed: open settings`**.
3. Wklej blok `"context_servers"`.
4. Zapisz plik (`Ctrl + S`). Zed automatycznie uruchomi serwer i odświeży kontekst asystenta.

---

## 5. Tabela Podsumowująca dla IDE

| Środowisko | Klucz główny JSON/YAML | Ścieżka globalna (Windows) | Ścieżka projektowa | Typ transportu |
|:---|:---|:---|:---|:---|
| **Cursor** | `"mcpServers"` | `%USERPROFILE%\.cursor\mcp.json` | `.cursor/mcp.json` | `stdio`, `sse`, `http` |
| **Windsurf** | `"mcpServers"` | `%USERPROFILE%\.codeium\windsurf\mcp_config.json` | *Brak* (tylko global) | `stdio`, `sse` |
| **VS Code (Natywny)** | `"servers"` | `%APPDATA%\Code\User\mcp.json` | `.vscode/mcp.json` | `stdio`, `http`, `sse` |
| **Cline (VS Code)** | `"mcpServers"` | `globalStorage/saoudrizwan.claude-dev/...` | `.vscode/mcp.json` | `stdio`, `streamableHttp` |
| **Roo Code (VS Code)** | `"mcpServers"` | `globalStorage/rooveterinaryinc.roo-cline/...` | `.roo/mcp.json` | `stdio`, `streamableHttp` |
| **Continue.dev** | `mcpServers:` | `%USERPROFILE%\.continue\config.yaml` | `.continue/config.yaml` | `stdio` |
| **Zed Editor** | `"context_servers"` | `%APPDATA%\Zed\settings.json` | `.zed/settings.json` | `stdio`, `remote` |
