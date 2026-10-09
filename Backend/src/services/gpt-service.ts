import axios from "axios";
import { appConfig } from "../utils/app-config";

// Sends prompts to OpenAI; the API key stays on the server and never reaches the browser.
class GptService {
  // Returns the model's answer to a system prompt (the rules) and a user prompt (the request).
  public async getCompletion(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<string> {
    const message = await this.send({
      model: appConfig.openaiModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    return message.content;
  }

  // Sends a whole conversation plus the tools the model may call, and returns the model's next message:
  // either a final answer in content, or a request to run tools in tool_calls.
  public async getNextMessage(messages: any[], tools: any[]): Promise<any> {
    return await this.send({ model: appConfig.openaiModel, messages, tools });
  }

  // Posts to OpenAI; its own error text can quote part of the key, so only the status code is passed on.
  private async send(body: object): Promise<any> {
    const options = {
      headers: { authorization: "Bearer " + appConfig.openaiApiKey },
    };
    try {
      const response = await axios.post(appConfig.openaiUrl, body, options);
      return response.data.choices[0].message;
    } catch (err: any) {
      const status = err.response?.status ?? "no response";
      throw new Error(
        `The AI service failed (${status}). Check OPENAI_API_KEY in Backend/.env.`,
      );
    }
  }
}

export const gptService = new GptService();
