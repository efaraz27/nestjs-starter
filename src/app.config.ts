import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

export class AppConfig {
  @IsString()
  DATABASE_HOST: string;

  @IsString()
  DATABASE_PORT: string;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  JWT_SECRET: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(AppConfig, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync({ skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
};
