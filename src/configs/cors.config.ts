import { registerAs } from '@nestjs/config';

export const corsConfig = registerAs('cors', () => ({
  origin: process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()),
  credentials: process.env.CORS_CREDENTIALS === 'true',
}));
