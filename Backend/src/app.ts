import express, { Express } from "express";
import { appConfig } from "./utils/app-config";

class App {
    public start(): void {
    const server: Express = express();
    server.use(express.json());   
    server.listen(appConfig.port, () => console.log(`Listening on http://localhost:${appConfig.port}`));

    }
}

const app = new App();
app.start();