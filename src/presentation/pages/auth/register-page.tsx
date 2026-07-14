import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useAuthStore } from '@/presentation/store/auth.store';
import { AuthStatus } from '@/domain/enums/auth-status.enum';
import { validateEmail, validatePassword, validateUsername } from '@/presentation/utils/validators';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Button } from '@/presentation/components/ui/button';

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  password2?: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const status = useAuthStore((s) => s.status);
  const errorMessage = useAuthStore((s) => s.errorMessage);
  const register = useAuthStore((s) => s.register);
  const isLoading = status === AuthStatus.Checking;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [obscurePassword, setObscurePassword] = useState(true);
  const [obscurePassword2, setObscurePassword2] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: FormErrors = {
      username: validateUsername(username) ?? undefined,
      email: validateEmail(email) ?? undefined,
      password: validatePassword(password) ?? undefined,
      password2:
        password2 !== password ? 'Las contraseñas no coinciden' : (validatePassword(password2) ?? undefined),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    register({ username: username.trim(), email: email.trim(), password, password2 });
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="flex h-14 items-center gap-2 border-b border-border bg-card px-2">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="flex size-10 items-center justify-center text-foreground"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-lg font-bold">Crear cuenta</h1>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-sm flex-col p-6">
        {errorMessage && (
          <div className="mb-4 rounded-xl border border-destructive bg-destructive/12 p-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        <div>
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
          <Label htmlFor="email">Correo</Label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              className="pl-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
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

        <div className="mt-4">
          <Label htmlFor="password2">Confirmar contraseña</Label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password2"
              type={obscurePassword2 ? 'password' : 'text'}
              className="px-9"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setObscurePassword2((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {obscurePassword2 ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>
          </div>
          {errors.password2 && <p className="mt-1 text-xs text-destructive">{errors.password2}</p>}
        </div>

        <Button type="submit" disabled={isLoading} className="mt-6 h-[52px] rounded-xl text-[15px]">
          {isLoading ? (
            <span className="size-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            'Crear cuenta'
          )}
        </Button>
      </form>
    </div>
  );
}
