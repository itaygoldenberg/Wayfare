import express, { Express } from "express";
import { appConfig } from "./utils/app-config";
import { errorMiddleware } from "./middleware/error-middleware";
import { userController } from "./controllers/user-controller";

class App {
  public start(): void {
    const server: Express = express();
    server.use(express.json());
    server.use(errorMiddleware.routeNotFound);
    server.use(errorMiddleware.catchAll);
    server.use(userController.router);
    server.listen(appConfig.port, () =>
      console.log(`Listening on http://localhost:${appConfig.port}`),
    );
  }
}

const app = new App();
app.start();
