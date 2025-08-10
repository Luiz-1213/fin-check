import { useQuery, useQueryClient } from '@tanstack/react-query';
import qs from 'qs';
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { LaunchScreen } from '../../view/components/LaunchScreen';
import { localStorageKeys } from '../config/localStorageKeys';
import { User } from '../entities/User';
import { authService } from '../services/authService';
import { httpClient } from '../services/httpClient';
import { usersService } from '../services/usersService';

interface ISignParams {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextValue {
  signedIn: boolean;
  signin(signParams: ISignParams): void;
  signout(): void;
  signInWithGoogle(): void;
  user: User | undefined;
}

export const AuthContext = createContext({} as AuthContextValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState<boolean>(() => {
    const storedRefreshToken = localStorage.getItem(
      localStorageKeys.REFRESH_TOKEN
    );

    return !!storedRefreshToken;
  });

  const queryClient = useQueryClient();

  const { isError, isFetching, isSuccess, data } = useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => usersService.me(),
    enabled: signedIn,
    staleTime: Infinity,
  });

  const signin = useCallback(({ accessToken, refreshToken }: ISignParams) => {
    localStorage.setItem(localStorageKeys.ACCESS_TOKEN, accessToken);
    localStorage.setItem(localStorageKeys.REFRESH_TOKEN, refreshToken);
    setSignedIn(true);
  }, []);

  const signInWithGoogle = useCallback(() => {
    const baseURL = 'https://accounts.google.com/o/oauth2/v2/auth';

    const options = qs.stringify({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri: 'https://fin-check-theta.vercel.app/callbacks/google',
      response_type: 'code',
      scope: 'email profile',
    });

    window.location.href = `${baseURL}?${options}`;
  }, []);

  const signout = useCallback(async () => {
    const refreshToken = localStorage.getItem(localStorageKeys.REFRESH_TOKEN);

    await authService.revokeToken(refreshToken!);

    localStorage.removeItem(localStorageKeys.ACCESS_TOKEN);
    localStorage.removeItem(localStorageKeys.REFRESH_TOKEN);

    queryClient.removeQueries({ queryKey: ['users', 'me'] });

    setSignedIn(false);

    toast.success('Logout efetuado com sucesso!');
  }, [queryClient]);

  useLayoutEffect(() => {
    const interceptorId = httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem(
          localStorageKeys.REFRESH_TOKEN
        );

        if (originalRequest.url === 'refresh-token') {
          setSignedIn(false);
          localStorage.clear();
          return Promise.reject(error);
        }

        if (error.response?.status !== 401 || !refreshToken) {
          return Promise.reject(error);
        }

        const { accessToken, refreshToken: newRefreshToken } =
          await authService.refreshToken(refreshToken);

        localStorage.setItem(localStorageKeys.ACCESS_TOKEN, accessToken);
        localStorage.setItem(localStorageKeys.REFRESH_TOKEN, newRefreshToken);

        return httpClient(originalRequest);
      }
    );

    return () => {
      httpClient.interceptors.response.eject(interceptorId);
    };
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error('Sua sessão expirou!');
      signout();
    }
  }, [isError, signout]);

  return (
    <AuthContext.Provider
      value={{
        signedIn: isSuccess && signedIn,
        signin,
        signout,
        signInWithGoogle,
        user: data,
      }}
    >
      <LaunchScreen isLoading={isFetching} />

      {!isFetching && children}
    </AuthContext.Provider>
  );
}
