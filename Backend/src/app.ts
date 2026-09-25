import express, { Express } from "express";
import cors from "cors";
import { appConfig } from "./utils/app-config";
import { errorMiddleware } from "./middleware/error-middleware";
import { userController } from "./controllers/user-controller";
import expressFileUpload from "express-fileupload";
import { vacationController } from "./controllers/vacation-controller";
import { likeController } from "./controllers/like-controller";

// Builds the Express server and starts listening.
class App {
  // Order matters: CORS and body parsers first, then the controllers, then the two error handlers last.
  public start(): void {
    const server: Express = express();
    server.use(cors());
    server.use(express.json());
    server.use(expressFileUpload());
    server.use(userController.router);
    server.use(vacationController.router);
    server.use(likeController.router);
    server.use(errorMiddleware.routeNotFound);
    server.use(errorMiddleware.catchAll);

    server.listen(appConfig.port, () =>
      console.log(`Listening on http://localhost:${appConfig.port}`),
    );
  }
}

const app = new App();
app.start();
