import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { vacationService } from "../services/vacation-service";

// What each MCP tool actually does: run a query and hand the rows back as JSON text.
class McpTools {
  // Every vacation with its like count.
  public async getAllVacationsTool(): Promise<CallToolResult> {
    console.log("Using tool: get_all_vacations");
    const vacations = await vacationService.getVacationsForAi();
    return { content: [{ type: "text", text: JSON.stringify(vacations) }] };
  }

  // Vacations happening today.
  public async getActiveVacationsTool(): Promise<CallToolResult> {
    console.log("Using tool: get_active_vacations");
    const vacations = await vacationService.getActiveVacationsForAi();
    return { content: [{ type: "text", text: JSON.stringify(vacations) }] };
  }

  // Vacations that have not started yet.
  public async getFutureVacationsTool(): Promise<CallToolResult> {
    console.log("Using tool: get_future_vacations");
    const vacations = await vacationService.getFutureVacationsForAi();
    return { content: [{ type: "text", text: JSON.stringify(vacations) }] };
  }

  // Count, average, lowest and highest price, and total likes.
  public async getStatisticsTool(): Promise<CallToolResult> {
    console.log("Using tool: get_vacation_statistics");
    const statistics = await vacationService.getStatistics();
    return { content: [{ type: "text", text: JSON.stringify(statistics) }] };
  }
}

export const mcpTools = new McpTools();
