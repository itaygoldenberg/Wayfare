import dotenv from "dotenv";

dotenv.config();

// Reads every setting from .env once, so no other file touches process.env.
class AppConfig {
  public readonly environment = process.env.ENVIRONMENT!;
  public readonly isDevelopment = this.environment === "development";
  public readonly port = parseInt(process.env.PORT!);
  public readonly mysqlHost = process.env.MYSQL_HOST!;
  public readonly mysqlUser = process.env.MYSQL_USER!;
  public readonly mysqlPassword = process.env.MYSQL_PASSWORD!;
  public readonly mysqlDatabase = process.env.MYSQL_DATABASE!;
  public readonly hashSalt = process.env.HASH_SALT!;
  public readonly jwtSecret = process.env.JWT_SECRET!;
  public readonly openaiApiKey = process.env.OPENAI_API_KEY!;
  public readonly openaiModel = "gpt-5";
  public readonly openaiUrl = "https://api.openai.com/v1/chat/completions";
  public readonly mcpMaxRounds = 5;
}

export const appConfig = new AppConfig();
