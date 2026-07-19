import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/presentation/store/auth.store';

const ANCHO_BOTON_REAL = 320;

// El botón real de Google (<GoogleLogin>) vive en un iframe de accounts.google.com:
// no se puede "customizar" su apariencia ni disparar su click programáticamente
// (cross-origin). La técnica estándar es superponerlo INVISIBLE pero clickeable
// arriba de nuestro botón visual (que tiene pointer-events: none) — el click del
// usuario cae físicamente sobre el iframe real, pero lo que ve es nuestro diseño.
//
// `use_fedcm_for_button` le pide a Google que use el selector de cuentas nativo del
// navegador (Federated Credential Management) en vez de "hornear" el nombre/foto del
// usuario directo en el botón — es lo más cerca que se puede llegar a un botón
// genérico con esta librería sin perder el id_token que ya valida el backend.
export function GoogleLoginButton({ onError }: { onError: (mensaje: string) => void }) {
  const loginConGoogle = useAuthStore((s) => s.loginConGoogle);

  return (
    <div className="relative mx-auto h-12" style={{ width: ANCHO_BOTON_REAL }}>
      <div className="absolute inset-0 z-10 overflow-hidden opacity-0 [&>div]:size-full [&_iframe]:!size-full">
        <GoogleLogin
          size="large"
          width={ANCHO_BOTON_REAL}
          use_fedcm_for_button
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              loginConGoogle(credentialResponse.credential);
            } else {
              onError('No se pudo iniciar sesión con Google.');
            }
          }}
          onError={() => onError('No se pudo iniciar sesión con Google.')}
        />
      </div>

      <div className="pointer-events-none flex size-full items-center justify-center gap-2 rounded-xl border border-border bg-white text-sm font-semibold text-[#3C4043] shadow-sm">
        <GoogleIcon className="size-[18px]" />
        Continuar con Google
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}
