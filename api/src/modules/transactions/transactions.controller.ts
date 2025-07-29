import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from './entities/Transaction';
import { TransactionsService } from './services/transactions.service';

@ApiTags('Transações')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova transação' })
  @ApiResponse({ status: 201, description: 'Transação criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(
    @ActiveUserId() userId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(userId, createTransactionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista todas as transações do usuário, com filtros',
  })
  @ApiResponse({ status: 200, description: 'Lista de transações' })
  @ApiQuery({
    name: 'month',
    example: 7,
    description: 'Mês da transação (1 a 12)',
  })
  @ApiQuery({
    name: 'year',
    example: 2025,
    description: 'Ano da transação',
  })
  @ApiQuery({
    name: 'bankAccountId',
    required: false,
    example: 'uuid-aqui',
    description: 'Filtra por conta bancária (opcional)',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: TransactionType,
    description: 'Filtra por tipo: INCOME ou EXPENSE',
  })
  findAll(
    @ActiveUserId() userId: string,
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
    @Query('bankAccountId', new ParseUUIDPipe({ optional: true }))
    bankAccountId?: string,
    @Query('type', new ParseEnumPipe(TransactionType, { optional: true }))
    type?: TransactionType,
  ) {
    return this.transactionsService.findAllByUserId(userId, {
      month,
      year,
      bankAccountId,
      type,
    });
  }

  @Put(':transactionId')
  @ApiOperation({ summary: 'Atualiza uma transação existente' })
  @ApiResponse({ status: 200, description: 'Transação atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  @ApiParam({
    name: 'transactionId',
    description: 'ID da transação',
    example: 'uuid-transacao',
  })
  update(
    @ActiveUserId() userId: string,
    @Param('transactionId', ParseUUIDPipe) transactionId: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(
      userId,
      transactionId,
      updateTransactionDto,
    );
  }

  @Delete(':transactionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove uma transação pelo ID' })
  @ApiResponse({ status: 204, description: 'Transação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  @ApiParam({
    name: 'transactionId',
    description: 'ID da transação',
    example: 'uuid-transacao',
  })
  remove(
    @ActiveUserId() userId: string,
    @Param('transactionId', ParseUUIDPipe) transactionId: string,
  ) {
    return this.transactionsService.remove(userId, transactionId);
  }
}
