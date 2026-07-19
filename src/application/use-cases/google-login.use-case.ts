import type { AuthRepository } from '@/domain/ports/auth-repository.port';
import type { LoggedUser } from '@/domain/entities/logged-user.entity';
import type { GoogleLoginDto } from '../dtos/google-login.dto';

export class GoogleLoginUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute(dto: GoogleLoginDto): Promise<LoggedUser> {
    return this.authRepository.loginConGoogle(dto.idToken);
  }
}
