import type { AuthRepository } from '@/domain/ports/auth-repository.port';
import type { LoggedUser } from '@/domain/entities/logged-user.entity';

export class CheckSessionUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute(): Promise<LoggedUser | null> {
    return this.authRepository.getStoredUser();
  }
}
