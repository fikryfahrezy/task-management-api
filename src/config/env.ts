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

  for (const [key, value] of Object.entries(EnvironmentVariables)) {
    if (!config[key]) {
      errors.push(`Environment variable ${key}`);
    } else {
      switch (typeof value) {
        case "string":
          env[key] = String(value);
          break;
        case "number":
          env[key] = Number(value);
          break;
      }
    }
  }

  if (errors.length !== 0) {
    throw new Error(errors.join(", "));
  }

  return { env: env as EnvironmentVariables["env"] };
}
