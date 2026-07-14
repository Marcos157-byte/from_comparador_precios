import type { AuthRepository, RegisterPayload } from '@/domain/ports/auth-repository.port';
import type { LoggedUser } from '@/domain/entities/logged-user.entity';
import { axiosClient } from '../http/axios-client';
import { localTokenStorage } from '../storage/local-token-storage';
import { parseLoginError, parseRegisterError } from '../http/parse-api-error';

interface StoredUserMap {
  user_id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

function mapStoredUser(map: StoredUserMap): LoggedUser {
  return {
    id: map.user_id,
    username: map.username,
    email: map.email,
    isStaff: map.is_staff,
  };
}

export class AuthHttpAdapter implements AuthRepository {
  async login(username: string, password: string): Promise<LoggedUser> {
    try {
      const { data } = await axiosClient.post<StoredUserMap & { access: string; refresh: string }>(
        '/auth/login/',
        { username, password },
      );
      return this.guardarSesion(data);
    } catch (error) {
      throw parseLoginError(error);
    }
  }

  async register(payload: RegisterPayload): Promise<LoggedUser> {
    try {
      const { data } = await axiosClient.post<StoredUserMap & { access: string; refresh: string }>(
        '/auth/register/',
        payload,
      );
      return this.guardarSesion(data);
    } catch (error) {
      throw parseRegisterError(error);
    }
  }

  async logout(): Promise<void> {
    const refresh = localTokenStorage.getRefreshToken();
    if (refresh) {
      try {
        await axiosClient.post('/auth/logout/', { refresh });
      } catch {
        // Si falla el logout remoto, igual cerramos sesión localmente.
      }
    }
    localTokenStorage.clear();
  }

  async getStoredUser(): Promise<LoggedUser | null> {
    const access = localTokenStorage.getAccessToken();
    const userMap = localTokenStorage.getStoredUser<StoredUserMap>();
    if (!access || !userMap) return null;
    return mapStoredUser(userMap);
  }

  private guardarSesion(data: StoredUserMap & { access: string; refresh: string }): LoggedUser {
    const user = mapStoredUser(data);
    localTokenStorage.saveSession(data.access, data.refresh, {
      user_id: user.id,
      username: user.username,
      email: user.email,
      is_staff: user.isStaff,
    });
    return user;
  }
}
