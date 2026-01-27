import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "./env";

@Injectable()
export class ConfigService {
  env: EnvironmentVariables["env"];

  constructor(configService: NestConfigService<EnvironmentVariables>) {
    this.env = configService.get("env", { infer: true })!;
  }
}
