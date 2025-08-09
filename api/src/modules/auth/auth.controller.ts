import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { isPublic } from 'src/shared/decorators/IsPublic';
import { SinginDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './services/auth.service';

import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SocialLoginDto } from './dto/social-login.dto';

@ApiTags('Autenticação')
@isPublic() // continua sendo uma rota pública
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOperation({ summary: 'Realiza login de usuário (retorna token JWT)' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiBody({ type: SinginDto })
  signin(@Body() singinDto: SinginDto) {
    return this.authService.signin(singinDto);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Cria um novo usuário no sistema' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso e retorno do access_token',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  @ApiBody({ type: SignupDto })
  create(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('social-login')
  @ApiOperation({ summary: 'Cria ou loga com login social' })
  @ApiResponse({
    status: 201,
    description:
      'Usuário criado/criado com sucesso e retorno do Access Token e Refresh Token',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({
    status: 401,
    description: 'Code inválido ou email não verificado',
  })
  @ApiBody({ type: SocialLoginDto })
  signWithSocialLogin(@Body() { code, provider, redirectUri }: SocialLoginDto) {
    return this.authService.socialLogin(provider, code, redirectUri);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Cria um novo par de tokens' })
  @ApiResponse({
    status: 200,
    description: 'Access Token e Refresh Token',
  })
  @ApiResponse({ status: 401, description: 'Refresh Token inválido' })
  createRefreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('revoke')
  @ApiOperation({ summary: 'Revogar o acesso' })
  @ApiResponse({
    status: 204,
    description: 'Sem conteudo',
  })
  @HttpCode(204)
  revokeToken(@Body() { refreshToken }: RefreshTokenDto) {
    return this.authService.revokeToken(refreshToken);
  }
}
