import { refreshToken } from './refreshToken';
import { revokeToken } from './revokeToken';
import { signin } from './signin';
import { signup } from './signup';

export const authService = {
  signup,
  signin,
  revokeToken,
  refreshToken,
};
