import { plainToInstance } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class EnvConfig {
  // JWT
  @IsString()
  JWT_SECRET: string;

  // POSTGRES
  @IsString()
  POSTGRES_HOST: string;

  @IsNumber()
  POSTGRES_PORT: number;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DB: string;

  // BACKBLAZE
  @IsString()
  BACKBLAZE_APP_KEY_ID: string;

  @IsString()
  BACKBLAZE_APP_KEY: string;

  @IsString()
  BUCKET_ID: string;

  // REDIS
  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  @IsOptional()
  REDIS_PORT = 6379;
}

// Функция преобразует и валидирует переменные окружения
export function validateConfig(config: Record<string, unknown>): EnvConfig {
  const validatedConfig = plainToInstance(EnvConfig, config, {
    enableImplicitConversion: true, // Автоматическое приведение типов
  });

  // Вручную проверяем валидность
  const errors = [];
  for (const key in validatedConfig) {
    if (validatedConfig[key] === undefined) {
      errors.push(`Missing environment variable: ${key}`);
    }
  }

  if (errors.length) {
    throw new Error(`Invalid environment variables:\n${errors.join('\n')}`);
  }

  return validatedConfig;
}
