import { UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigService } from "../config/config.service";
import { LoginReqDto } from "./dto/login.dto";

describe("AuthService", () => {
  const mockConfigService = {
    env: {
      AUTH_TOKEN: "secret-token-123",
    },
  } as ConfigService;

  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(mockConfigService);
  });

  it("should return token on valid credentials", () => {
    const dto: LoginReqDto = {
      email: "admin@example.com",
      password: "password123",
    };

    const result = authService.login(dto);
    expect(result.token).toBe("secret-token-123");
  });

  it("should throw on invalid credentials", () => {
    const dto: LoginReqDto = {
      email: "wrong@example.com",
      password: "invalid",
    };

    expect(() => authService.login(dto)).toThrow(UnauthorizedException);
  });
});
