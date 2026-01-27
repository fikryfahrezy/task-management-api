import { Injectable, OnModuleDestroy } from "@nestjs/common";
import postgres, { Sql } from "postgres";
import { ConfigService } from "../config/config.service";

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  readonly sql: Sql;

  constructor(private readonly configService: ConfigService) {
    this.sql = postgres({
      host: this.configService.env.POSTGRES_HOST,
      port: this.configService.env.POSTGRES_PORT,
      db: this.configService.env.POSTGRES_DB,
      user: this.configService.env.POSTGRES_USER,
      password: this.configService.env.POSTGRES_PASSWORD,
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.sql.end();
  }
}
