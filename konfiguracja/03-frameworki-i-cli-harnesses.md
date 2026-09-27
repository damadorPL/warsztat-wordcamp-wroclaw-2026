# Integracja Serwerów MCP we Frameworkach Agentowych i Narzędziach CLI

Niniejszy przewodnik opisuje programistyczną i konsolową integrację protokołu **Model Context Protocol (MCP)** w środowiskach autonomicznych agentów oraz narzędziach CLI:
- **Claude Code CLI (Anthropic)**
- **LangChain & LangGraph (JavaScript / TypeScript)**
- **CrewAI & Microsoft AutoGen**
- **OpenHands (dawniej OpenDevin)**
- **Google Antigravity (`agy`)**
- **Aider (AiderDesk)**
- **Narzędzia diagnostyczne: Oficjalny MCP Inspector**

---

## 1. Claude Code (Oficjalny CLI od Anthropic)

Claude Code to terminalowy agent programistyczny z natywnym menedżerem pakietów MCP w CLI.

### 1.1. Zarządzanie z wiersza poleceń

```bash
# 1. Dodanie serwera stdio (WordPress Playground z proxy Automattic)
claude mcp add --transport stdio novamira-playground -- npx -y @automattic/mcp-wordpress-remote

# 2. Dodanie serwera z przekazaniem zmiennych środowiskowych
claude mcp add --transport stdio novamira-playground \
  -e WP_API_URL=http://127.0.0.1:9400/wp-json/mcp/novamira \
  -e WP_API_USERNAME=admin \
  -e WP_API_PASSWORD=<HASLO_APLIKACJI> \
  -- npx -y @automattic/mcp-wordpress-remote

# 3. Dodanie zdalnego serwera Streamable HTTP / SSE
claude mcp add --transport http remote-mcp https://api.example.com/mcp --header "Authorization: Bearer <TOKEN>"

# 4. Wyświetlenie statusu wszystkich podłączonych serwerów
claude mcp list

# 5. Szczegółowe inspekcje narzędzi danego serwera
claude mcp get novamira-playground

# 6. Usunięcie serwera
claude mcp remove novamira-playground
```

### 1.2. Plik konfiguracyjny projektu (`.mcp.json`)
Aby współdzielić konfigurację serwerów MCP w repozytorium Git ze współpracownikami, utwórz plik `.mcp.json` w katalogu głównym projektu:

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

---

## 2. LangChain & LangGraph (Implementacja w TypeScript / JavaScript)

Oficjalny pakiet **`@langchain/mcp-adapters`** pozwala łączyć dowolne serwery MCP i bezpośrednio zasilać narzędziami agentów zbudowanych w oparciu o **LangGraph**.

### 2.1. Instalacja zależności

```bash
npm install @langchain/mcp-adapters @langchain/langgraph @langchain/core @langchain/openai
npm install -D typescript @types/node tsx
```

### 2.2. Kompletny skrypt Agenta w TypeScript (`agent-mcp.ts`)

```typescript
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

async function main() {
  console.log("🚀 Inicjalizacja klienta MultiServerMCPClient...");

  // 1. Definicja połączeń z serwerami MCP
  const mcpClient = new MultiServerMCPClient({
    throwOnLoadError: true,
    prefixToolNameWithServerName: true, // Zapobiega kolizji nazw narzędzi (np. novamira__eval_php)
    mcpServers: {
      // Serwer WordPress Playground (stdio przez proxy)
      novamira: {
        transport: "stdio",
        command: "npx",
        args: ["-y", "@automattic/mcp-wordpress-remote"],
        env: {
          WP_API_URL: "http://127.0.0.1:9400/wp-json/mcp/novamira",
          WP_API_USERNAME: "admin",
          WP_API_PASSWORD: process.env.WP_APP_PASSWORD || "admin",
        },
      },
      // Serwer plików
      filesystem: {
        transport: "stdio",
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-filesystem", process.cwd()],
      },
    },
  });

  // 2. Pobranie i automatyczna konwersja narzędzi na StructuredTool
  const tools = await mcpClient.getTools();
  console.log(`✅ Zarejestrowano ${tools.length} narzędzi z serwerów MCP.`);

  // 3. Konfiguracja modelu językowego
  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
  });

  // 4. Utworzenie reaktywnego Agenta (LangGraph ReAct)
  const agent = createReactAgent({
    llm: model,
    tools: tools,
  });

  // 5. Wykonanie zapytania
  console.log("🤖 Uruchamianie zapytania do Agenta...");
  const response = await agent.invoke({
    messages: [
      {
        role: "user",
        content: "Sprawdź połączenie z WordPressem za pomocą narzędzi Novamira i podaj wersję WordPressa oraz PHP.",
      },
    ],
  });

  const lastMessage = response.messages[response.messages.length - 1];
  console.log("\nOdpowiedź Agenta:\n", lastMessage.content);

  // 6. Bezpieczne zamknięcie połączeń procesowych
  await mcpClient.close();
}

main().catch(console.error);
```

---

## 3. CrewAI & Microsoft AutoGen

### 3.1. CrewAI (Python)
W CrewAI wsparcie MCP zintegrowane jest w module `crewai.mcp`:

```python
from crewai import Agent, Task, Crew
from crewai.mcp import MCPServerStdio

# Konfiguracja serwera stdio
wordpress_mcp = MCPServerStdio(
    command="npx",
    args=["-y", "@automattic/mcp-wordpress-remote"],
    env={
        "WP_API_URL": "http://127.0.0.1:9400/wp-json/mcp/novamira",
        "WP_API_USERNAME": "admin",
        "WP_API_PASSWORD": "<HASLO>"
    }
)

# Przypisanie do agenta
wp_specialist = Agent(
    role="WordPress Administrator",
    goal="Zarządzanie środowiskiem WordPress i optymalizacja treści",
    backstory="Ekspert CMS z bezpośrednim dostępem do narzędzi WordPress MCP",
    mcps=[wordpress_mcp],
    verbose=True
)
```

---

### 3.2. Microsoft AutoGen (0.4+ / Microsoft Agent Framework)
W najnowszej wersji AutoGen narzędzia MCP ładuje się za pośrednictwem `autogen-ext[mcp]`:

```python
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.tools.mcp import StdioServerParams, mcp_server_tools
from autogen_ext.models.openai import OpenAIChatCompletionClient

async def main():
    server_params = StdioServerParams(
        command="npx",
        args=["-y", "@automattic/mcp-wordpress-remote"],
        env={"WP_API_URL": "http://127.0.0.1:9400/wp-json/mcp/novamira"}
    )
    tools = await mcp_server_tools(server_params)
    agent = AssistantAgent(
        name="wp_agent",
        model_client=OpenAIChatCompletionClient(model="gpt-4o"),
        tools=tools
    )
```

---

## 4. OpenHands (dawniej OpenDevin)

W OpenHands serwery definiuje się w pliku **`config.toml`** w katalogu roboczym projektu:

```toml
[mcp]
# 1. Zdalne serwery Streamable HTTP
shttp_servers = [
  { url = "http://localhost:9400/wp-json/mcp/novamira", api_key = "token" }
]

# 2. Lokalne procesy STDIO
[[mcp.stdio_servers]]
name = "novamira-playground"
command = "npx"
args = ["-y", "@automattic/mcp-wordpress-remote"]
env = { WP_API_URL = "http://127.0.0.1:9400/wp-json/mcp/novamira", WP_API_USERNAME = "admin", WP_API_PASSWORD = "<HASLO>" }
```

---

## 5. Google Antigravity (`agy`)

Środowisko **agy** posiada wbudowaną obsługę protokołu MCP w narzędziach CLI oraz runtime agenta:

### 5.1. Komendy CLI:
```bash
# Rejestracja serwera
agy mcp add novamira-playground npx -y @automattic/mcp-wordpress-remote

# Wyświetlenie listy serwerów
agy mcp list

# Wyłączenie / włączenie serwera w locie
agy mcp disable novamira-playground
agy mcp enable novamira-playground
```

### 5.2. Plik konfiguracyjny:
* Lokalizacja: `%USERPROFILE%\.gemini\config\mcp_config.json`
* Schematy narzędzi cachowane są w: `%USERPROFILE%\.gemini\antigravity\mcp\<Serwer>\*.json`

---

## 6. Aider & AiderDesk

- **Aider CLI:** Nie posiada wbudowanego natywnego klienta MCP, natomiast społeczność wykorzystuje mostek **`sengokudaikon/aider-mcp-server`**, aby to Aider działał jako serwer MCP wywoływany przez inne agenty.
- **AiderDesk:** Desktopowa nakładka na Aidera posiada pełne GUI wspierające podłączanie serwerów MCP w trybie *Agent Mode*.

---

## 7. Diagnostyka: Oficjalny MCP Inspector

Przed podłączeniem serwera MCP do dowolnego frameworka warto przetestować go przy użyciu oficjalnego narzędzia diagnostycznego:

```bash
# Test lokalnego serwera stdio:
npx -y @modelcontextprotocol/inspector npx -y @automattic/mcp-wordpress-remote

# Test zdalnego serwera HTTP / SSE:
npx -y @modelcontextprotocol/inspector --transport http http://127.0.0.1:9400/wp-json/mcp/novamira
```

> [!CAUTION]
> **Kluczowa reguła STDIN / STDOUT vs STDERR:**
> W serwerach MCP procesów lokalnych strumień `STDOUT` jest ściśle zarezerwowany dla komunikatów protokołu JSON-RPC. Wypisanie tekstu przez zwykłe `console.log()` lub `print()` natychmiast zepsuje komunikację klienta. Wszystkie logi deweloperskie muszą być kierowane do strumienia **`STDERR`** (`console.error`).
