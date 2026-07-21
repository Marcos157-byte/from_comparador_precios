import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '@/presentation/store/auth.store';
import { AuthStatus } from '@/domain/enums/auth-status.enum';
import { LoginPage } from '@/presentation/pages/auth/login-page';
import { RegisterPage } from '@/presentation/pages/auth/register-page';
import { LandingPage } from '@/presentation/pages/landing/landing-page';
import { HomePage } from '@/presentation/pages/catalog/home-page';
import { ExplorarPage } from '@/presentation/pages/catalog/explorar-page';
import { ExplorarComercioPage } from '@/presentation/pages/catalog/explorar-comercio-page';
import { MiListaPage } from '@/presentation/pages/cart/mi-lista-page';
import { CompararListasPage } from '@/presentation/pages/cart/comparar-listas-page';
import { ProfilePage } from '@/presentation/pages/profile/profile-page';
import { SubcategoriaPage } from '@/presentation/pages/catalog/subcategoria-page';
import { CatalogPage } from '@/presentation/pages/catalog/catalog-page';
import { PreciosPage } from '@/presentation/pages/catalog/precios-page';
import { MainLayout } from './main-layout';

export function AppRouter() {
  const status = useAuthStore((s) => s.status);
  const checkStoredSession = useAuthStore((s) => s.checkStoredSession);

  useEffect(() => {
    checkStoredSession();
  }, [checkStoredSession]);

  return (
    // Réplica del patrón "app mobile-first centrada en desktop": el fondo neutro ocupa
    // todo el viewport, y esta columna queda acotada a un ancho de teléfono (480px) y
    // centrada. `transform-gpu` no es solo estética: al fijar un `transform` en este
    // contenedor, se convierte en el "containing block" de todo elemento `fixed`
    // descendiente (bottom nav, CTAs fijos, toasts), así quedan atrapados dentro de
    // esta columna en vez de estirarse al viewport completo — sin tocar cada pantalla.
    // Clave: la columna debe medir EXACTO un viewport y scrollear su propio contenido
    // (`overflow-y-auto`). Si se le permitiera crecer con el contenido, en páginas
    // largas (ej. Catalog con muchos productos) la columna completa se estira, y todo
    // lo `fixed` (que se ancla a ESTA columna, no al viewport real) terminaría pegado
    // al fondo de ese contenido larguísimo en vez de quedar visible pegado al fondo de
    // la pantalla.
    //
    // `h-viewport-dinamico`/`min-h-viewport-dinamico` (definidas en index.css) en vez de
    // `h-svh`/`min-h-svh`: `svh` asume que la barra de direcciones del navegador móvil
    // está siempre expandida (mide el viewport más chico posible) y NO se recalcula
    // cuando esa barra se oculta al hacer scroll. `dvh` sí se recalcula en vivo; las
    // utilidades declaran fallback en cascada vía @supports para navegadores viejos.
    //
    // IMPORTANTE — por qué el scroll vive en un div ANIDADO y no en este mismo shell:
    // un elemento `position: fixed` cuyo "containing block" lo establece un ancestro
    // con `transform` (nuestro caso) deja de comportarse como fijo-al-viewport de
    // verdad si ESE MISMO ancestro también es el que scrollea (`overflow-y-auto`) — en
    // ese caso el navegador lo trata como si fuera `position: absolute` DENTRO del
    // contenido scrolleado, y se mueve junto con el scroll en vez de quedarse pegado
    // (confirmado con getBoundingClientRect(): el nav se corría exactamente lo mismo
    // que el scrollTop del contenedor). La solución es separar responsabilidades: este
    // div (transform-gpu) NUNCA scrollea, solo establece el containing block fijo de
    // tamaño estable; el scroll real ocurre en el div hijo de abajo. Así, el nav (o
    // cualquier `fixed` de cualquier página) "salta" el div que scrollea sin verse
    // afectado por su posición de scroll, y se ancla de verdad al shell estable.
    //
    // Responsive (bloque 1 del rediseño desktop): por debajo de `lg` (1024px) esto seguí
    // siendo la "tarjeta de teléfono" de siempre (max-w-[480px], centrada, con sombra).
    // A partir de `lg` el shell pasa a ocupar el viewport completo (`lg:max-w-none`, sin
    // sombra) — es el mismo containing-block estable de antes, solo que ahora más ancho,
    // para que un `fixed inset-x-0` (la navbar superior de escritorio, o el bottom nav en
    // mobile) se estire de punta a punta como en un sitio real, no como una tarjeta.
    // El ancho "razonable" del CONTENIDO (max-w-7xl centrado) se aplica un nivel más
    // adentro, en main-layout.tsx — no acá, porque este shell también envuelve
    // Login/Register/Landing, que no deberían heredar ese padding.
    <div className="min-h-viewport-dinamico w-full bg-neutral-200 lg:bg-background">
      <div className="relative mx-auto h-viewport-dinamico w-full max-w-[480px] transform-gpu bg-background shadow-xl lg:max-w-none lg:shadow-none">
        <div className="size-full overflow-y-auto">
          {status === AuthStatus.Checking ? (
            <div className="flex min-h-full items-center justify-center bg-background">
              <span className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : status === AuthStatus.Unauthenticated ? (
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<LoginPage />} />
            </Routes>
          ) : (
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="explorar" element={<ExplorarPage />} />
                <Route path="explorar-comercio" element={<ExplorarComercioPage />} />
                <Route path="explorar-comercio/:idComercio" element={<ExplorarComercioPage />} />
                <Route path="mi-lista" element={<MiListaPage />} />
                <Route path="perfil" element={<ProfilePage />} />
                <Route path="subcategoria/:idPadre" element={<SubcategoriaPage />} />
                <Route path="catalog/:tipo/:idCategoria" element={<CatalogPage />} />
                <Route path="precios/:idProducto" element={<PreciosPage />} />
                <Route path="comparar-listas" element={<CompararListasPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
}
