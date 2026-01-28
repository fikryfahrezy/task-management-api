import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { LoginReqDto, LoginResDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";

@ApiTags("auth")
@Controller("login")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(200)
  @ApiBody({ type: LoginReqDto })
  @ApiOkResponse({ type: LoginResDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  login(@Body() loginDto: LoginReqDto): LoginResDto {
    return this.authService.login(loginDto);
  }
}
