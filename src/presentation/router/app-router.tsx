import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '@/presentation/store/auth.store';
import { AuthStatus } from '@/domain/enums/auth-status.enum';
import { LoginPage } from '@/presentation/pages/auth/login-page';
import { RegisterPage } from '@/presentation/pages/auth/register-page';
import { HomePage } from '@/presentation/pages/catalog/home-page';
import { ExplorarPage } from '@/presentation/pages/catalog/explorar-page';
import { CartPage } from '@/presentation/pages/cart/cart-page';
import { ProfilePage } from '@/presentation/pages/profile/profile-page';
import { SubcategoriaPage } from '@/presentation/pages/catalog/subcategoria-page';
import { CatalogPage } from '@/presentation/pages/catalog/catalog-page';
import { MainLayout } from './main-layout';

export function AppRouter() {
  const status = useAuthStore((s) => s.status);
  const checkStoredSession = useAuthStore((s) => s.checkStoredSession);

  useEffect(() => {
    checkStoredSession();
  }, [checkStoredSession]);

  if (status === AuthStatus.Checking) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <span className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (status === AuthStatus.Unauthenticated) {
    return (
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="explorar" element={<ExplorarPage />} />
        <Route path="mi-lista" element={<CartPage />} />
        <Route path="perfil" element={<ProfilePage />} />
      </Route>
      <Route path="subcategoria/:idPadre" element={<SubcategoriaPage />} />
      <Route path="catalog/:tipo/:idCategoria" element={<CatalogPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
