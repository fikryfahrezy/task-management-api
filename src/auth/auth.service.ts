import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { LoginReqDto, LoginResDto } from "./dto/login.dto";

const HARD_CODED_EMAIL = "admin@example.com";
const HARD_CODED_PASSWORD = "password123";

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  validate(email: string, password: string): boolean {
    return email === HARD_CODED_EMAIL && password === HARD_CODED_PASSWORD;
  }

  getToken(): string {
    return this.configService.env.AUTH_TOKEN;
  }

  login(loginReqDto: LoginReqDto): LoginResDto {
    if (!this.validate(loginReqDto.email, loginReqDto.password)) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return new LoginResDto({ token: this.getToken() });
  }
}
