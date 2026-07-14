import { create } from 'zustand';
import { AuthStatus } from '@/domain/enums/auth-status.enum';
import type { LoggedUser } from '@/domain/entities/logged-user.entity';
import { ApiException } from '@/domain/exceptions/api-exception';
import type { RegisterDto } from '@/application/dtos/register.dto';
import { authUseCases } from '@/infrastructure/factories/auth.factory';
import { authSessionEvents } from '@/infrastructure/http/auth-session-events';

interface AuthStore {
  status: AuthStatus;
  user: LoggedUser | null;
  errorMessage: string | null;
  checkStoredSession: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
}

function mensajeDeError(error: unknown): string {
  return error instanceof ApiException ? error.message : 'No se pudo conectar con el servidor.';
}

export const useAuthStore = create<AuthStore>((set) => ({
  status: AuthStatus.Checking,
  user: null,
  errorMessage: null,

  checkStoredSession: async () => {
    const user = await authUseCases.checkSession.execute();
    set(
      user
        ? { status: AuthStatus.Authenticated, user, errorMessage: null }
        : { status: AuthStatus.Unauthenticated, user: null },
    );
  },

  login: async (username, password) => {
    set({ status: AuthStatus.Checking, errorMessage: null });
    try {
      const user = await authUseCases.login.execute({ username, password });
      set({ status: AuthStatus.Authenticated, user, errorMessage: null });
    } catch (error) {
      set({ status: AuthStatus.Unauthenticated, user: null, errorMessage: mensajeDeError(error) });
    }
  },

  register: async (dto) => {
    set({ status: AuthStatus.Checking, errorMessage: null });
    try {
      const user = await authUseCases.register.execute(dto);
      set({ status: AuthStatus.Authenticated, user, errorMessage: null });
    } catch (error) {
      set({ status: AuthStatus.Unauthenticated, user: null, errorMessage: mensajeDeError(error) });
    }
  },

  logout: async () => {
    await authUseCases.logout.execute();
    set({ status: AuthStatus.Unauthenticated, user: null, errorMessage: null });
  },
}));

authSessionEvents.onSessionExpired(() => {
  useAuthStore.setState({ status: AuthStatus.Unauthenticated, user: null, errorMessage: null });
});
