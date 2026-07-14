export const AuthStatus = {
  Checking: 'checking',
  Authenticated: 'authenticated',
  Unauthenticated: 'unauthenticated',
} as const;

export type AuthStatus = (typeof AuthStatus)[keyof typeof AuthStatus];
