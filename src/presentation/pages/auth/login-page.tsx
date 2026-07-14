import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useAuthStore } from '@/presentation/store/auth.store';
import { AuthStatus } from '@/domain/enums/auth-status.enum';
import { validatePassword, validateUsername } from '@/presentation/utils/validators';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { TiraRombosCentrada } from '@/presentation/components/tira-rombos-centrada';

const NAVY = '#1A237E';

export function LoginPage() {
  const status = useAuthStore((s) => s.status);
  const errorMessage = useAuthStore((s) => s.errorMessage);
  const login = useAuthStore((s) => s.login);
  const isLoading = status === AuthStatus.Checking;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [obscurePassword, setObscurePassword] = useState(true);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    setErrors({ username: usernameError ?? undefined, password: passwordError ?? undefined });
    if (usernameError || passwordError) return;
    login(username.trim(), password);
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-6">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col">
        <TiraRombosCentrada className="mx-auto h-[30px] w-[200px]" />

        <h1 className="mt-2 text-center text-3xl font-bold" style={{ color: NAVY }}>
          PreciosEC
        </h1>
        <p className="mt-2 text-center text-sm text-blue-600">COMPARA precios entre comercios</p>

        {errorMessage && (
          <div className="mt-10 rounded-xl border border-destructive bg-destructive/12 p-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        <div className={errorMessage ? 'mt-4' : 'mt-10'}>
          <Label htmlFor="username">Usuario</Label>
          <div className="relative mt-1.5">
            <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="username"
              className="pl-9"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {errors.username && <p className="mt-1 text-xs text-destructive">{errors.username}</p>}
        </div>

        <div className="mt-4">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={obscurePassword ? 'password' : 'text'}
              className="px-9"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setObscurePassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {obscurePassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 flex h-[52px] items-center justify-center rounded-xl text-[15px] font-bold text-yellow-400 disabled:opacity-60"
          style={{ backgroundColor: NAVY }}
        >
          {isLoading ? (
            <span className="size-5 animate-spin rounded-full border-2 border-[#0410FC] border-t-transparent" />
          ) : (
            'Iniciar sesión'
          )}
        </button>

        <Link
          to="/register"
          className="mt-4 text-center text-sm font-semibold text-red-600"
          aria-disabled={isLoading}
        >
          ¿No tienes cuenta? Regístrate
        </Link>
      </form>
    </div>
  );
}
