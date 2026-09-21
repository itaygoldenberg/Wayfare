import mysql from "mysql2/promise";
import { appConfig } from "./app-config";

class Dal {
  private readonly pool = mysql.createPool({
    host: appConfig.mysqlHost,
    user: appConfig.mysqlUser,
    password: appConfig.mysqlPassword,
    database: appConfig.mysqlDatabase,
  });

  public async execute(sql: string, values?: any[]): Promise<any> {
    const [result] = await this.pool.execute(sql, values);
    return result;
  }
}

export const dal = new Dal();
