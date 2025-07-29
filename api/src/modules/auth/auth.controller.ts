import { Body, Controller, Post } from '@nestjs/common';
import { isPublic } from 'src/shared/decorators/IsPublic';
import { AuthService } from './auth.service';
import { SinginDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
}
