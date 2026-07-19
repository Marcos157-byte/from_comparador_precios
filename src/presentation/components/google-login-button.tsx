import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/presentation/store/auth.store';

// El botón real de Google (<GoogleLogin>) vive en un iframe de accounts.google.com.
// Probamos una técnica de superposición (real invisible + visual propio encima) para
// lograr un look 100% custom, pero resultó frágil en navegador real (el click no
// llegaba de forma confiable al iframe real). Volvemos al botón real y visible de
// Google, y nos apoyamos en sus props soportadas para acercarnos a un look genérico:
// - `text="continue_with"` pide la etiqueta genérica "Continuar con Google".
// - `use_fedcm_for_button={false}`: con FedCM, Chrome recuerda la sesión/consentimiento
//   previo y reemplaza el botón por "Continuar como {nombre}", exponiendo la cuenta
//   activa sin que el usuario haga click. Desactivarlo vuelve al flujo clásico de popup
//   de Google (ventana de selección de cuenta), que siempre muestra el botón genérico
//   sin importar la sesión del navegador — a costa de perder el selector nativo.
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
        use_fedcm_for_button={false}
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
