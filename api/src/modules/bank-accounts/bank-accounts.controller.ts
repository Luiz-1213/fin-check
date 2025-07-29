import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccountsService } from './services/bank-accounts.service';

@ApiTags('Contas Bancárias')
@ApiBearerAuth()
@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova conta bancária' })
  @ApiResponse({
    status: 201,
    description: 'Conta bancária criada com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBody({ type: CreateBankAccountDto })
  create(
    @ActiveUserId() userId: string,
    @Body() createBankAccountDto: CreateBankAccountDto,
  ) {
    return this.bankAccountsService.create(userId, createBankAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as contas bancárias do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de contas bancárias retornada com sucesso',
  })
  findAll(@ActiveUserId() userId: string) {
    return this.bankAccountsService.findAllByUserId(userId);
  }

  @Put(':bankAccountId')
  @ApiOperation({ summary: 'Atualiza uma conta bancária' })
  @ApiResponse({
    status: 200,
    description: 'Conta bancária atualizada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Conta bancária não encontrada' })
  @ApiParam({
    name: 'bankAccountId',
    description: 'ID da conta bancária',
    example: 'uuid-conta-bancaria',
  })
  @ApiBody({ type: UpdateBankAccountDto })
  update(
    @ActiveUserId() userId: string,
    @Param('bankAccountId', ParseUUIDPipe) bankAccountId: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
  ) {
    return this.bankAccountsService.update(
      userId,
      bankAccountId,
      updateBankAccountDto,
    );
  }

  @Delete(':bankAccountId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove uma conta bancária' })
  @ApiResponse({
    status: 204,
    description: 'Conta bancária removida com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Conta bancária não encontrada' })
  @ApiParam({
    name: 'bankAccountId',
    description: 'ID da conta bancária',
    example: 'uuid-conta-bancaria',
  })
  remove(
    @ActiveUserId() userId: string,
    @Param('bankAccountId', ParseUUIDPipe) bankAccountId: string,
  ) {
    return this.bankAccountsService.remove(userId, bankAccountId);
  }
}
