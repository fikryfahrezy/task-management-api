import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "./config/config.module";
import { validateEnv } from "./config/env";
import { CoreModule } from "./core/core.module";
import { RequestLoggerMiddleware } from "./middleware/request-logger.middleware";
import { TasksModule } from "./tasks/tasks.module";

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ConfigModule,
    CoreModule,
    AuthModule,
    TasksModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes("*");
  }
}
