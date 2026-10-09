import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { appConfig } from "./utils/app-config";
import { errorMiddleware } from "./middleware/error-middleware";
import { userController } from "./controllers/user-controller";
import expressFileUpload from "express-fileupload";
import path from "path";
import { saver } from "smart-saver";
import { vacationController } from "./controllers/vacation-controller";
import { likeController } from "./controllers/like-controller";
import { aiController } from "./controllers/ai-controller";

// Builds the Express server and starts listening.
class App {
  // Order matters: CORS and body parsers first, then the controllers, then the two error handlers last.
  public start(): void {
    const server: Express = express();

    // Configure smart-saver - images path:
    saver.config(path.join(__dirname, "assets", "images"));

    server.use(cors());
    server.use(express.json());
    server.use(expressFileUpload());

    // Express 5 leaves the body undefined when a request has none; an empty one lets validation answer 422 instead of crashing.
    server.use((request: Request, response: Response, next: NextFunction) => {
      if (!request.body) request.body = {};
      next();
    });

    server.use(userController.router);
    server.use(vacationController.router);
    server.use(likeController.router);
    server.use(aiController.router);
    server.use(errorMiddleware.routeNotFound);
    server.use(errorMiddleware.catchAll);

    server.listen(appConfig.port, () =>
      console.log(`Listening on http://localhost:${appConfig.port}`),
    );
  }
}

const app = new App();
app.start();
