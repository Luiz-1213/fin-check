import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { UsersService } from './users.service';

// import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @ApiOperation({ summary: 'Buscar usuário logado pelo token' })
  @ApiResponse({ status: 200, description: 'Retorna o usuario' })
  @ApiResponse({ status: 401, description: 'Token Inválido' })
  me(@ActiveUserId() userId: string) {
    return this.usersService.getUserById(userId);
  }
}
