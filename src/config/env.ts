const EnvironmentVariables = {
  POSTGRES_HOST: "",
  POSTGRES_PORT: 0,
  POSTGRES_DB: "",
  POSTGRES_USER: "",
  POSTGRES_PASSWORD: "",
  AUTH_TOKEN: "",
  PORT: 0,
};

export type EnvironmentVariables = {
  env: typeof EnvironmentVariables;
};

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const errors: string[] = [];
  const env: Record<string, unknown> = {};

  for (const [key, defaultValue] of Object.entries(EnvironmentVariables)) {
    const raw = config[key];
    if (typeof raw === "undefined" || raw === null || raw === "") {
      errors.push(`Environment variable ${key}`);
      continue;
    }

    if (
      typeof raw !== "string" &&
      typeof raw !== "number" &&
      typeof raw !== "boolean"
    ) {
      errors.push(`Environment variable ${key} must be a primitive`);
      continue;
    }

    switch (typeof defaultValue) {
      case "string":
        if (typeof raw === "string") {
          env[key] = raw;
        } else {
          env[key] = String(raw);
        }
        break;
      case "number": {
        const n = Number(raw);
        if (Number.isNaN(n)) {
          errors.push(`Environment variable ${key} must be a number`);
        } else {
          env[key] = n;
        }
        break;
      }
      default:
        env[key] = raw;
    }
  }

  if (errors.length !== 0) {
    throw new Error(errors.join(", "));
  }

  return { env: env as EnvironmentVariables["env"] };
}
