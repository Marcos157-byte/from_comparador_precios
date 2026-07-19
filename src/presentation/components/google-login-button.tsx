import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/presentation/store/auth.store';

// El botón real de Google (<GoogleLogin>) vive en un iframe de accounts.google.com.
// Probamos una técnica de superposición (real invisible + visual propio encima) para
// lograr un look 100% custom, pero resultó frágil en navegador real (el click no
// llegaba de forma confiable al iframe real). Volvemos al botón real y visible de
// Google, y nos apoyamos en sus props soportadas para acercarnos a un look genérico:
// - `text="continue_with"` pide la etiqueta genérica "Continuar con Google" (Google
//   igual puede reemplazarla por "Continuar como {nombre}" si detecta una sesión ya
//   consentida en este origen — eso ya no depende de nuestro código).
// - `use_fedcm_for_button` le pide a Google usar el selector de cuentas nativo del
//   navegador (Federated Credential Management) en el click, en vez de decidir todo
//   de antemano dentro del botón.
// - `itp_support` habilita el mismo comportamiento "upgraded" en navegadores con
//   Intelligent Tracking Prevention (Safari).
export function GoogleLoginButton({ onError }: { onError: (mensaje: string) => void }) {
  const loginConGoogle = useAuthStore((s) => s.loginConGoogle);

  return (
    <div className="flex justify-center">
      <GoogleLogin
        size="large"
        shape="rectangular"
        text="continue_with"
        width={320}
        use_fedcm_for_button
        itp_support
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
  );
}
