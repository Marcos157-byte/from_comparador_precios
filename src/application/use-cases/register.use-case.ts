import type { AuthRepository } from '@/domain/ports/auth-repository.port';
import type { LoggedUser } from '@/domain/entities/logged-user.entity';
import type { RegisterDto } from '../dtos/register.dto';

export class RegisterUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute(dto: RegisterDto): Promise<LoggedUser> {
    return this.authRepository.register(dto);
  }
}
