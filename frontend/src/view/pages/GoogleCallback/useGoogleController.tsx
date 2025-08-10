import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../app/hooks/useAuth';
import { authService } from '../../../app/services/authService';
import { SocialLoginParams } from '../../../app/services/authService/socialLogin';

export default function useGoogleController() {
  const { signin } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get('code');

  const { mutateAsync } = useMutation({
    mutationFn: async (data: SocialLoginParams) => {
      return authService.socialLogin(data);
    },
  });

  const hasHandled = useRef(false);

  useEffect(() => {
    if (!code || hasHandled.current) {
      console.log('Skiping...');
      return;
    }

    hasHandled.current = true;

    async function handleSocialLogin() {
      try {
        if (!code) return;

        const { accessToken, refreshToken } = await mutateAsync({
          code,
          provider: 'google',
          redirectUri: 'https://fin-check-theta.vercel.app/callbacks/google',
        });

        signin({ accessToken, refreshToken });
        toast.success('Login efetuado com sucesso!');
      } catch {
        toast.error('Credenciais inválidas!');
      }
    }

    handleSocialLogin();
  }, [code, mutateAsync, signin]);
}
