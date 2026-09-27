/**
 * Przykładowy skrypt w TypeScript integrujący serwer MCP Novamira (WordPress Playground)
 * z agentem ReAct w LangGraph za pomocą biblioteki @langchain/mcp-adapters.
 *
 * Uruchomienie:
 *   npm install @langchain/mcp-adapters @langchain/langgraph @langchain/core @langchain/openai tsx
 *   npx tsx langgraph-agent.ts
 */

import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

async function runWordCampAgent() {
  console.log("=== [1/4] Inicjalizacja połączenia MCP ===");

  const mcpClient = new MultiServerMCPClient({
    throwOnLoadError: true,
    prefixToolNameWithServerName: true,
    mcpServers: {
      novamira: {
        transport: "stdio",
        command: "npx",
        args: ["-y", "@automattic/mcp-wordpress-remote"],
        env: {
          WP_API_URL: process.env.WP_API_URL || "http://127.0.0.1:9400/wp-json/mcp/novamira",
          WP_API_USERNAME: process.env.WP_API_USERNAME || "admin",
          WP_API_PASSWORD: process.env.WP_API_PASSWORD || "password",
        },
      },
    },
  });

  console.log("=== [2/4] Pobieranie narzędzi z serwera Novamira MCP ===");
  const tools = await mcpClient.getTools();
  console.log(`Pomyślnie załadowano ${tools.length} narzędzi MCP:`);
  for (const t of tools) {
    console.log(` - ${t.name}: ${t.description.slice(0, 80)}...`);
  }

  console.log("=== [3/4] Konfiguracja Agenta LangGraph ===");
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
  });

  const agent = createReactAgent({
    llm,
    tools,
  });

  console.log("=== [4/4] Wykonanie zadania warsztatowego ===");
  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: "Sprawdź stan WordPressa, wylistuj aktywne wtyczki i wykonaj proste zapytanie PHP sprawdzające WP_ENVIRONMENT_TYPE.",
      },
    ],
  });

  const lastMessage = result.messages[result.messages.length - 1];
  console.log("\n--- Odpowiedź Agenta ---");
  console.log(lastMessage.content);

  await mcpClient.close();
}

runWordCampAgent().catch((err) => {
  console.error("Błąd wykonania:", err);
  process.exit(1);
});
