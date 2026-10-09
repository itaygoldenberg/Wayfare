import axios from "axios";
import { AnswerModel } from "../models/answer-model";
import { appConfig } from "../utils/app-config";

// Asks the server for AI answers; the OpenAI key never leaves the server.
class AiService {
  // The message shown when Hebrew is typed or sent: the AI pages and the vacation forms work in English only.
  public readonly englishOnly = "Please write in English only.";

  // True when the text has a Hebrew letter; in Unicode, Hebrew letters are the codes 1424 to 1535.
  public hasHebrew(text: string): boolean {
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code >= 1424 && code <= 1535) return true;
    }
    return false;
  }

  // Returns a trip recommendation for a destination.
  public async getRecommendation(destination: string): Promise<string> {
    if (this.hasHebrew(destination)) throw new Error(this.englishOnly);
    const response = await axios.post<{ recommendation: string }>(
      appConfig.recommendationUrl,
      { destination },
    );
    return response.data.recommendation;
  }

  // Asks a question about the vacations; the server answers it through its MCP server.
  public async askDatabase(question: string): Promise<AnswerModel> {
    if (this.hasHebrew(question)) throw new Error(this.englishOnly);
    const response = await axios.post<AnswerModel>(appConfig.askUrl, {
      question,
    });
    return response.data;
  }
}

export const aiService = new AiService();
