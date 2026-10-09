import mysql from "mysql2/promise";
import { appConfig } from "./app-config";

// Data access layer - the only place that talks to MySQL.
class Dal {
  private readonly pool = mysql.createPool({
    host: appConfig.mysqlHost,
    user: appConfig.mysqlUser,
    password: appConfig.mysqlPassword,
    database: appConfig.mysqlDatabase,
    // Keep DATE columns as "YYYY-MM-DD" text; Date objects shift them by the timezone offset.
    dateStrings: true,
    // Return DECIMAL prices as numbers; by default they arrive as strings like "1890.00".
    decimalNumbers: true,
  });

  // Runs a query; values fill the ? placeholders separately, so they can never run as SQL.
  public async execute(sql: string, values?: any[]): Promise<any> {
    const [result] = await this.pool.execute(sql, values);
    return result;
  }
}

export const dal = new Dal();
