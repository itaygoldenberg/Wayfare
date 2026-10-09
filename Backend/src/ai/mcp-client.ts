import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { wayfareMcpServer } from "./mcp-server";

// The backend's own MCP client. It talks to the Wayfare MCP server over the full MCP protocol
// (initialize, tools/list, tools/call) through an in-memory pipe - no network, no ngrok tunnel.
class McpClient {
  // Creates a fresh server and a client connected to it; the caller closes the client when done.
  public async connect(): Promise<Client> {
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await wayfareMcpServer.create().connect(serverTransport);

    const client = new Client({ name: "wayfare-backend", version: "1.0.0" });
    await client.connect(clientTransport);
    return client;
  }
}

export const mcpClient = new McpClient();
