import type { LoggedUser } from '../entities/logged-user.entity';

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface AuthRepository {
  login(username: string, password: string): Promise<LoggedUser>;
  register(payload: RegisterPayload): Promise<LoggedUser>;
  logout(): Promise<void>;
  getStoredUser(): Promise<LoggedUser | null>;
}
