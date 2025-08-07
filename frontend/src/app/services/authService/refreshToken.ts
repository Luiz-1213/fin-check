import { httpClient } from '../httpClient';

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export async function refreshToken(refreshToken: string) {
  const { data } = await httpClient.post<RefreshTokenResponse>(
    '/auth/refresh-token',
    { refreshToken }
  );

  return data;
}
