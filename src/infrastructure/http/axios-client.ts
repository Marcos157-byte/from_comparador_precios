import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { apiConfig } from '../config/api.config';
import { localTokenStorage } from '../storage/local-token-storage';
import { authSessionEvents } from './auth-session-events';

export const axiosClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeoutMs,
  headers: { 'Content-Type': 'application/json' },
});

function isPublicPath(path: string): boolean {
  return apiConfig.publicPaths.some((publicPath) => path.includes(publicPath));
}

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const path = config.url ?? '';
  if (!isPublicPath(path)) {
    const token = localTokenStorage.getAccessToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const path = originalRequest?.url ?? '';
    const esRefreshFallido = path.includes('/auth/token/refresh');

    if (error.response?.status === 401 && !esRefreshFallido && originalRequest) {
      const refreshToken = localTokenStorage.getRefreshToken();

      if (refreshToken) {
        try {
          const refreshClient = axios.create({ baseURL: apiConfig.baseURL });
          const { data } = await refreshClient.post('/auth/token/refresh/', {
            refresh: refreshToken,
          });

          localTokenStorage.updateTokens(data.access, data.refresh ?? null);

          originalRequest.headers.set('Authorization', `Bearer ${data.access}`);
          const retryClient = axios.create({ baseURL: apiConfig.baseURL });
          return await retryClient.request(originalRequest);
        } catch {
          localTokenStorage.clear();
          authSessionEvents.emitSessionExpired();
        }
      } else {
        localTokenStorage.clear();
        authSessionEvents.emitSessionExpired();
      }
    }

    return Promise.reject(error);
  },
);
