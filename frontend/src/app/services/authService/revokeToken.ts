import { httpClient } from '../httpClient';

export async function revokeToken(refreshToken: string) {
  const { data } = await httpClient.post<void>('/auth/revoke', {
    refreshToken,
  });

  return data;
}
