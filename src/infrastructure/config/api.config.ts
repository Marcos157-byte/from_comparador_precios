import { env } from './env';

export const apiConfig = {
  baseURL: env.apiUrl,
  timeoutMs: 15_000,
  publicPaths: [
    '/auth/login',
    '/auth/register',
    '/auth/token/refresh',
    '/auth/password-reset',
  ],
} as const;
