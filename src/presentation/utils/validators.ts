export function validateUsername(value: string): string | null {
  return value.trim().length < 3 ? 'Mínimo 3 caracteres' : null;
}

export function validateEmail(value: string): string | null {
  return value.includes('@') ? null : 'Email inválido';
}

export function validatePassword(value: string): string | null {
  return value.length < 8 ? 'Mínimo 8 caracteres' : null;
}
