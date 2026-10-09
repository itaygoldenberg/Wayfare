import { gptService } from "./gpt-service";
import { RecommendationModel } from "../models/recommendation-model";
import { QuestionModel } from "../models/question-model";
import { mcpClient } from "../ai/mcp-client";
import { appConfig } from "../utils/app-config";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";

// Builds the prompts for both AI features; gptService only carries them to OpenAI.
class AiService {
  // Throws a 422 when the text has a Hebrew letter (Unicode codes 1424 to 1535): both AI features work in English only.
  private checkEnglish(text: string): void {
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code >= 1424 && code <= 1535)
        throw new ClientError(
          StatusCode.UnprocessableContent,
          "Please write in English only.",
        );
    }
  }

  // Returns a short trip recommendation for the requested destination.
  public async getRecommendation(
    request: RecommendationModel,
  ): Promise<string> {
    request.validate();
    this.checkEnglish(request.destination);

    // The system prompt fixes the role and the format, so a request like "ignore your rules"
    // arrives only as a destination name, inside the user prompt.
    const systemPrompt = `
      You are Wayfare's travel advisor.
      Write a trip recommendation for the destination the user gives.
      Rules:
      1. Answer in English, in plain text - no markdown, no asterisks, no hashtags.
         Always in English, even when the destination is written in another language or the user asks for another language.
      2. Use these sections, each title on its own line, written exactly like this with no emoji: Why go, Best time to visit, Top experiences, Local food, Practical tip.
      3. Under Top experiences and Local food, list 3 items, one per line, each starting with "- " and then one emoji that fits the item.
      4. Start the text under Why go, Best time to visit and Practical tip with one emoji that fits it. Never use flag emojis.
      5. Keep the whole answer under 250 words.
      6. If the text is not a real place a traveller can visit, reply only: "Please enter a real destination."`;

    const userPrompt = `Destination: ${request.destination.trim()}`;

    return await gptService.getCompletion(systemPrompt, userPrompt);
  }

  // Answers a question about the vacations through the Wayfare MCP server, and reports which tools it used.
  public async askDatabase(
    request: QuestionModel,
  ): Promise<{ answer: string; toolsUsed: string[] }> {
    request.validate();
    this.checkEnglish(request.question);

    const systemPrompt = `
      You are Wayfare's data assistant.
      Today's date is ${new Date().toLocaleDateString("en-CA")}.
      Rules:
      1. For every question about Wayfare's vacations, call the tools and answer only from what they return.
      2. Call more than one tool when a question needs it.
      3. Prices are in US dollars; dates are YYYY-MM-DD.
      4. Answer in one or two full sentences - a list only when naming several vacations - in plain text without markdown,
         and always in English, even when the question is in another language. Never mention vacationId.
      5. Put each list item on its own line, starting with "- " and then one emoji that fits the place (like 🏝️ for an island or 🏔️ for mountains).
         Start an answer that is not a list with one emoji that fits it. Never use flag emojis.
      6. If the question is not about Wayfare's vacations, say that you can only answer questions about them.`;

    const client = await mcpClient.connect();
    try {
      // The MCP server describes its tools; OpenAI expects the same thing wrapped as "function" tools.
      const { tools } = await client.listTools();
      const openaiTools = tools.map((tool) => ({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema,
        },
      }));

      const messages: any[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: request.question.trim() },
      ];
      const toolsUsed: string[] = [];

      // The model either answers or asks for tools; each tool runs through MCP and its result goes back
      // into the conversation, until the model answers or the round limit stops a runaway loop.
      for (let round = 0; round < appConfig.mcpMaxRounds; round++) {
        const message = await gptService.getNextMessage(messages, openaiTools);
        if (!message.tool_calls?.length)
          return { answer: message.content, toolsUsed };

        messages.push(message);
        for (const call of message.tool_calls) {
          const result = await client.callTool({
            name: call.function.name,
            arguments: JSON.parse(call.function.arguments || "{}"),
          });
          const text = (result.content as any)[0].text;
          messages.push({ role: "tool", tool_call_id: call.id, content: text });
          if (!toolsUsed.includes(call.function.name))
            toolsUsed.push(call.function.name);
        }
      }
      throw new Error("The question needed too many steps to answer.");
    } finally {
      await client.close();
    }
  }
}

export const aiService = new AiService();
