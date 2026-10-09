import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mcpTools } from "./mcp-tools";

// Registers each tool under a unique name; the description is the only thing the model reads
// to decide whether a tool fits the question, so it names every field the tool returns.
class McpRegister {
  // get_all_vacations
  public registerGetAllVacationsTool(mcpServer: McpServer): void {
    const config = {
      description:
        "Get every Wayfare vacation: vacationId, destination (city and country), description, " +
        "startDate and endDate (YYYY-MM-DD), price in US dollars, and likesCount (how many users liked it).",
    };
    mcpServer.registerTool(
      "get_all_vacations",
      config,
      mcpTools.getAllVacationsTool,
    );
  }

  // get_active_vacations
  public registerGetActiveVacationsTool(mcpServer: McpServer): void {
    const config = {
      description:
        "Get the Wayfare vacations happening right now - started on or before today and ending on or after today - " +
        "with the same fields as get_all_vacations.",
    };
    mcpServer.registerTool(
      "get_active_vacations",
      config,
      mcpTools.getActiveVacationsTool,
    );
  }

  // get_future_vacations
  public registerGetFutureVacationsTool(mcpServer: McpServer): void {
    const config = {
      description:
        "Get the Wayfare vacations that have not started yet (start date after today), " +
        "with the same fields as get_all_vacations.",
    };
    mcpServer.registerTool(
      "get_future_vacations",
      config,
      mcpTools.getFutureVacationsTool,
    );
  }

  // get_vacation_statistics
  public registerGetStatisticsTool(mcpServer: McpServer): void {
    const config = {
      description:
        "Get totals across all Wayfare vacations: vacationsCount, averagePrice, lowestPrice and highestPrice " +
        "(US dollars), and totalLikes.",
    };
    mcpServer.registerTool(
      "get_vacation_statistics",
      config,
      mcpTools.getStatisticsTool,
    );
  }
}

export const mcpRegister = new McpRegister();
