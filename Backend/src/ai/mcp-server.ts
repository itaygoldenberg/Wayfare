import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mcpRegister } from "./mcp-register";

// The Wayfare MCP server: a named server that exposes the vacation tools.
class WayfareMcpServer {
  // Creates a server with every tool registered; a new one per connection, since a server serves one client at a time.
  public create(): McpServer {
    const mcpServer = new McpServer({
      name: "wayfare-mcp-server",
      version: "1.0.0",
    });

    mcpRegister.registerGetAllVacationsTool(mcpServer);
    mcpRegister.registerGetActiveVacationsTool(mcpServer);
    mcpRegister.registerGetFutureVacationsTool(mcpServer);
    mcpRegister.registerGetStatisticsTool(mcpServer);

    return mcpServer;
  }
}

export const wayfareMcpServer = new WayfareMcpServer();
