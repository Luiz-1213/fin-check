import { httpClient } from '../httpClient';

export interface SocialLoginParams {
  code: string;
  provider: string;
  redirectUri: string;
}

interface SocialLoginResponse {
  accessToken: string;
  refreshToken: string;
}

export async function socialLogin({
  code,
  provider,
  redirectUri,
}: SocialLoginParams) {
  const { data } = await httpClient.post<SocialLoginResponse>(
    '/auth/social-login',
    {
      code,
      provider,
      redirectUri,
    }
  );

  return data;
}
