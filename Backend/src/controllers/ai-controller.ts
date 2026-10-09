import express, { Request, Response, NextFunction, Router } from "express";
import { aiService } from "../services/ai-service";
import { RecommendationModel } from "../models/recommendation-model";
import { QuestionModel } from "../models/question-model";
import { securityMiddleware } from "../middleware/security-middleware";

// Routes for the AI features; all of them need a login.
class AiController {
  public router: Router = express.Router();

  // Registers the routes as soon as the controller is created.
  public constructor() {
    this.registerRoutes();
  }

  // Maps each URL to its handler.
  private registerRoutes(): void {
    this.router.post(
      "/api/ai/recommendation",
      securityMiddleware.verifyLoggedIn,
      this.getRecommendation,
    );
    this.router.post(
      "/api/ai/ask",
      securityMiddleware.verifyLoggedIn,
      this.askDatabase,
    );
  }

  // POST /api/ai/recommendation - returns { recommendation } for { destination }.
  private async getRecommendation(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const recommendationRequest = new RecommendationModel(request.body);
      const recommendation = await aiService.getRecommendation(
        recommendationRequest,
      );
      response.json({ recommendation });
    } catch (err: any) {
      next(err);
    }
  }

  // POST /api/ai/ask - answers { question } through the MCP server: returns { answer, toolsUsed }.
  private async askDatabase(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const question = new QuestionModel(request.body);
      const result = await aiService.askDatabase(question);
      response.json(result);
    } catch (err: any) {
      next(err);
    }
  }
}

export const aiController = new AiController();
