import axios from 'axios';
import { ApiException } from '@/domain/exceptions/api-exception';

export function parseLoginError(error: unknown): ApiException {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    const detail =
      data && typeof data === 'object' && 'detail' in data
        ? String((data as Record<string, unknown>).detail)
        : null;
    return new ApiException(detail ?? 'No se pudo iniciar sesión.', error.response?.status ?? null);
  }
  return new ApiException('No se pudo conectar con el servidor.');
}

/** El backend devuelve errores por campo, ej: {"username": ["Este nombre ya existe."]} */
export function parseRegisterError(error: unknown): ApiException {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>;
      const primerError = Object.values(record)[0];
      if (Array.isArray(primerError) && primerError.length > 0) {
        return new ApiException(String(primerError[0]), error.response?.status ?? null);
      }
      if ('detail' in record) {
        return new ApiException(String(record.detail), error.response?.status ?? null);
      }
    }
    return new ApiException('No se pudo crear la cuenta.', error.response?.status ?? null);
  }
  return new ApiException('No se pudo conectar con el servidor.');
}
