import { refreshToken } from './refreshToken';
import { revokeToken } from './revokeToken';
import { signin } from './signin';
import { signup } from './signup';
import { socialLogin } from './socialLogin';

export const authService = {
  signup,
  signin,
  revokeToken,
  refreshToken,
  socialLogin,
};
