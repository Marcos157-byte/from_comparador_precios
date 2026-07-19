import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '@/presentation/store/auth.store';
import { AuthStatus } from '@/domain/enums/auth-status.enum';
import { LoginPage } from '@/presentation/pages/auth/login-page';
import { RegisterPage } from '@/presentation/pages/auth/register-page';
import { HomePage } from '@/presentation/pages/catalog/home-page';
import { ExplorarPage } from '@/presentation/pages/catalog/explorar-page';
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
    // Clave: la columna debe medir EXACTO un viewport (`h-svh`, no `min-h-svh`) y
    // scrollear su propio contenido (`overflow-y-auto`). Si se le permitiera crecer con
    // el contenido, en páginas largas (ej. Catalog con muchos productos) la columna
    // completa se estira, y todo lo `fixed` (que se ancla a ESTA columna, no al
    // viewport real) terminaría pegado al fondo de ese contenido larguísimo en vez de
    // quedar visible pegado al fondo de la pantalla.
    <div className="min-h-svh w-full bg-neutral-200">
      <div className="relative mx-auto h-svh w-full max-w-[480px] transform-gpu overflow-y-auto bg-background shadow-xl">
        {status === AuthStatus.Checking ? (
          <div className="flex min-h-svh items-center justify-center bg-background">
            <span className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : status === AuthStatus.Unauthenticated ? (
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<LoginPage />} />
          </Routes>
        ) : (
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="explorar" element={<ExplorarPage />} />
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
  );
}
