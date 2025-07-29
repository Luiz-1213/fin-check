import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionType } from '../entities/Transaction';

export class CreateTransactionDto {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'ID da conta bancária associada à transação',
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  bankAccountId: string;

  @ApiProperty({
    example: '1c7f5f64-5917-4562-b3fc-2c963f66b123',
    description: 'ID da categoria da transação',
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    example: 'Compra no supermercado',
    description: 'Nome ou descrição da transação',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 150.75,
    description: 'Valor da transação (positivo)',
  })
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiProperty({
    example: '2025-07-29T10:00:00Z',
    description: 'Data e hora da transação no formato ISO 8601',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    example: TransactionType.EXPENSE,
    description: 'Tipo da transação: INCOME (receita) ou EXPENSE (despesa)',
    enum: TransactionType,
  })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;
}
