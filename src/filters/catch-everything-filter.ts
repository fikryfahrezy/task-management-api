import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AbstractHttpAdapter } from "@nestjs/core";

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapter: AbstractHttpAdapter) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const errorName =
      exception instanceof Error ? exception.name : "UnknownError";

    const errorMessage =
      exception instanceof Error
        ? exception.message
        : "This error is unknown or unhandled";

    let errors: string[] = [];
    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === "object") {
        const message = (
          exceptionResponse as unknown as Record<string, unknown>
        )["message"];

        if (Array.isArray(message)) {
          errors = message as string[];
        }
      }
    }

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      name: errorName,
      message: errorMessage,
      errors,
    };

    this.httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
