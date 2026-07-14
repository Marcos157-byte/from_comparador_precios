import type { AuthRepository } from '@/domain/ports/auth-repository.port';
import type { LoggedUser } from '@/domain/entities/logged-user.entity';
import type { LoginDto } from '../dtos/login.dto';

export class LoginUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute(dto: LoginDto): Promise<LoggedUser> {
    return this.authRepository.login(dto.username, dto.password);
  }
}
