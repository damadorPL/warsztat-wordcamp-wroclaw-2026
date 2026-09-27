# Instalacja i Konfiguracja Serwerów MCP w Aplikacjach Desktopowych i Lokalnych Interfejsach AI

Niniejszy przewodnik opisuje konfigurację serwerów **Model Context Protocol (MCP)** w aplikacjach desktopowych oraz graficznych interfejsach webowych dla modeli AI:
- **Claude Desktop (Anthropic)**
- **Goose (Block / Square)**
- **LibreChat**
- **LM Studio**
- **Open WebUI**
- **Chatbox**

---

## 1. Claude Desktop (Anthropic)

Claude Desktop jest oficjalnym referencyjnym klientem protokołu MCP firmy Anthropic. Obsługuje przede wszystkim procesy lokalne (`stdio`).

### 1.1. Ścieżki do plików konfiguracyjnych
Plik konfiguracyjny nosi nazwę **`claude_desktop_config.json`**:

* **Windows:**
  ```text
  %APPDATA%\Claude\claude_desktop_config.json
  # Pełna ścieżka:
  C:\Users\<Użytkownik>\AppData\Roaming\Claude\claude_desktop_config.json
  ```
* **macOS:**
  ```text
  ~/Library/Application Support/Claude/claude_desktop_config.json
  ```
* **Linux:**
  ```text
  ~/.config/Claude/claude_desktop_config.json
  ```

> [!TIP]
> W Claude Desktop możesz otworzyć ten plik bezpośrednio z menu:  
> **Settings -> Developer -> Edit Config**.

### 1.2. Format konfiguracji (JSON)

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
    "sqlite": {
      "command": "uvx",
      "args": [
        "mcp-server-sqlite",
        "--db-path",
        "C:\\Bazy\\dane.db"
      ]
    }
  }
}
```

### 1.3. Procedura uruchomienia i weryfikacja
1. Edytuj plik `claude_desktop_config.json` i zapisz zmiany.
2. **Całkowicie zrestartuj Claude Desktop** (w Windows upewnij się, że ikona zniknęła z zasobnika systemowego, na macOS wybierz `Cmd + Q`).
3. W oknie czatu po prawej stronie paska wiadomości powinna pojawić się **ikona młotka / wtyczki**.
4. Kliknięcie ikony wyświetli listę wykrytych narzędzi.
5. Logi diagnostyczne można sprawdzić w:
   - Windows: `%APPDATA%\Claude\logs\`
   - macOS: `~/Library/Logs/Claude/`

---

## 2. Goose (Block / Square / Agentic AI Foundation)

Goose to autonomiczny agent deweloperski, w którym każda funkcja zewnętrzna jest traktowana jako rozszerzenie MCP.

### 2.1. Ścieżki do plików konfiguracyjnych
Główny plik konfiguracyjny to **`config.yaml`**:
* **Windows:** `%APPDATA%\Block\goose\config\config.yaml`  
  *(lub `%USERPROFILE%\.config\goose\config.yaml`)*
* **macOS / Linux:** `~/.config/goose/config.yaml`

### 2.2. Konfiguracja CLI (`goose configure`)
Najwygodniejszym sposobem rejestracji jest wbudowany kreator terminalowy:
```bash
goose configure
```
W menu wybierz **Add Extension**, a następnie wskaż typ (`stdio` lub `remote/http`) i podaj parametry.

### 2.3. Konfiguracja przez plik `config.yaml`
```yaml
GOOSE_PROVIDER: anthropic
GOOSE_MODEL: claude-3-7-sonnet-latest

extensions:
  novamira-playground:
    type: stdio
    command: npx
    args:
      - -y
      - "@automattic/mcp-wordpress-remote"
    env:
      WP_API_URL: "http://127.0.0.1:9400/wp-json/mcp/novamira"
      WP_API_USERNAME: "admin"
      WP_API_PASSWORD: "<TWOJE_HASLO_APLIKACJI>"
    enabled: true
    timeout: 300

  filesystem:
    type: stdio
    command: npx
    args:
      - -y
      - "@modelcontextprotocol/server-filesystem"
      - "C:/Users/damador/Documents/Code"
    enabled: true
```

*Weryfikacja:* Wykonaj `goose info --extensions` lub uruchom sesję `goose session` i wpisz polecenie `/tools`.

---

## 3. LibreChat

LibreChat to zaawansowany interfejs webowy AI typu multi-model. Posiada natywną obsługę protokołu MCP zarówno w modelu `stdio`, jak i sieciowym `sse`.

### 3.1. Ścieżka do pliku konfiguracyjnego
Plik **`librechat.yaml`** znajduje się w katalogu głównym projektu LibreChat. W środowisku Docker musi być zamontowany w kontenerze `api`:
```yaml
services:
  api:
    volumes:
      - ./librechat.yaml:/app/librechat.yaml
```

### 3.2. Składnia YAML (`librechat.yaml`)
```yaml
version: 1.1.5

mcpSettings:
  allowedDomains:
    - "localhost"
    - "127.0.0.1"
    - "host.docker.internal"

mcpServers:
  # Połączenie sieciowe SSE z lokalnym serwerem WordPress Playground
  novamira-playground:
    type: sse
    url: "http://host.docker.internal:9400/wp-json/mcp/novamira/sse"
    timeout: 60000
    headers:
      Authorization: "Basic <ZAKODOWANY_BASE64_USER_PASSWORD>"

  # Lokalny proces stdio w kontenerze LibreChat
  filesystem:
    type: stdio
    command: npx
    args:
      - -y
      - "@modelcontextprotocol/server-filesystem"
      - "/app/data"
```

> [!IMPORTANT]
> **Adresacja w Dockerze:** Jeżeli LibreChat działa w Dockerze, a WordPress Playground na Twoim komputerze hosta, użyj adresu `http://host.docker.internal:9400` zamiast `localhost`.

---

## 4. LM Studio

LM Studio (od wersji **0.3.17+ / 0.4.0+**) umożliwia modelom lokalnym (np. Qwen 2.5, Llama 3.3) korzystanie z serwerów MCP jako wbudowany MCP Host.

### 4.1. Ścieżka konfiguracji
* **Windows:** `%USERPROFILE%\.lmstudio\mcp.json`
* **macOS / Linux:** `~/.lmstudio/mcp.json`

### 4.2. Edycja w interfejsie LM Studio
1. Otwórz LM Studio.
2. W prawym panelu przejdź do zakładki **Program**.
3. Kliknij **Install** -> **Edit mcp.json**.
4. Wklej definicję serwerów:

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
5. W zakładce *Program* pojawi się status serwera (zielona ikona i lista narzędzi).

---

## 5. Open WebUI

Open WebUI integruje serwery MCP na dwa sposoby:

1. **Natywne wsparcie MCP (Streamable HTTP / SSE):**
   - Przejdź do: **Settings -> Admin Settings -> Integrations / Connections -> External Tool Servers**.
   - Dodaj serwer, wybierając typ **MCP (Streamable HTTP)** i podaj adres URL.
2. **Mostek MCPO (MCP-to-OpenAPI Proxy):**
   - Oficjalny kontener pośredniczący [`open-webui/mcpo`](https://github.com/open-webui/mcpo) uruchamia lokalne serwery stdio i wystawia ich narzędzia jako endpointy OpenAPI akceptowane przez Open WebUI.

---

## 6. Chatbox (Chatbox AI)

Desktopowa aplikacja Chatbox (Electron) wspiera serwery MCP bezpośrednio z poziomu interfejsu użytkownika:

1. Otwórz **Settings -> MCP (Model Context Protocol)**.
2. Kliknij **Add Server**.
3. Wprowadź:
   - **Name:** `novamira-playground`
   - **Command:** `npx`
   - **Arguments:** `-y @automattic/mcp-wordpress-remote`
   - **Environment Variables:**
     ```text
     WP_API_URL=http://127.0.0.1:9400/wp-json/mcp/novamira
     WP_API_USERNAME=admin
     WP_API_PASSWORD=<TWOJE_HASLO_APLIKACJI>
     ```
4. **Ważne:** W oknie czatu włącz tryb **Work Mode** (ikona robota), aby asystent wywoływał skonfigurowane narzędzia.

---

## 7. Matryca Podsumowująca Aplikacji Desktopowych

| Aplikacja | Format pliku | Główna lokalizacja (Windows) | Wspierane transporty | Sposób weryfikacji |
|:---|:---|:---|:---|:---|
| **Claude Desktop** | JSON | `%APPDATA%\Claude\claude_desktop_config.json` | `stdio` | Ikona młotka w oknie czatu |
| **Goose** | YAML | `%APPDATA%\Block\goose\config\config.yaml` | `stdio`, `sse`, `http` | Polecenie `goose info --extensions` |
| **LibreChat** | YAML | `./librechat.yaml` (w katalogu głównym) | `stdio`, `sse` | Logi kontenera API + panel Tools |
| **LM Studio** | JSON | `%USERPROFILE%\.lmstudio\mcp.json` | `stdio` | Zakładka Program |
| **Open WebUI** | Web UI / MCPO | Admin Settings -> Integrations | `http`, `sse` | Panel narzędzi czatu |
| **Chatbox** | Web UI | Settings -> MCP | `stdio` | Włączenie trybu "Work Mode" |
