import { AuthHttpAdapter } from '../adapters/auth-http.adapter';
import { LoginUseCase } from '@/application/use-cases/login.use-case';
import { RegisterUseCase } from '@/application/use-cases/register.use-case';
import { LogoutUseCase } from '@/application/use-cases/logout.use-case';
import { CheckSessionUseCase } from '@/application/use-cases/check-session.use-case';

const authRepository = new AuthHttpAdapter();

export const authUseCases = {
  login: new LoginUseCase(authRepository),
  register: new RegisterUseCase(authRepository),
  logout: new LogoutUseCase(authRepository),
  checkSession: new CheckSessionUseCase(authRepository),
};
