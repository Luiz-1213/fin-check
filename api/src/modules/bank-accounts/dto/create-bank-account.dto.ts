import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { BankAccountType } from '../entities/BankAccount';

export class CreateBankAccountDto {
  @ApiProperty({
    example: 'Nubank',
    description: 'Nome identificador da conta bancária',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 1500.75,
    description: 'Saldo inicial da conta bancária',
  })
  @IsNumber()
  @IsNotEmpty()
  initialBalance: number;

  @ApiProperty({
    example: BankAccountType.CHECKING, // Exemplo, dependendo do enum
    description: 'Tipo da conta bancária',
    enum: BankAccountType,
  })
  @IsEnum(BankAccountType)
  @IsNotEmpty()
  type: BankAccountType;

  @ApiProperty({
    example: '#FF5733',
    description: 'Cor hexadecimal que representa visualmente a conta',
  })
  @IsString()
  @IsNotEmpty()
  @IsHexColor()
  color: string;
}
