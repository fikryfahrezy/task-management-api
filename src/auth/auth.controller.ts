import { Body, Controller, HttpCode, Post, Res } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";

@ApiTags("auth")
@Controller("login")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): { token?: string; message?: string } {
    const isValid = this.authService.validate(
      loginDto.email,
      loginDto.password,
    );

    if (!isValid) {
      res.status(401);
      return { message: "Invalid credentials" };
    }

    return { token: this.authService.getToken() };
  }
}
