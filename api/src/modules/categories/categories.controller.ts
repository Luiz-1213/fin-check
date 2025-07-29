import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { CategoriesService } from './services/categories.service';

@ApiTags('Categorias')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Busca todas as categorias de um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  findAll(@ActiveUserId() userId: string) {
    return this.categoriesService.findAllByUserId(userId);
  }
}
