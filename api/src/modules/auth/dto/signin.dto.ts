import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SinginDto {
  @ApiProperty({
    example: 'usuario@email.com',
    description: 'E-mail válido do usuário para login',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha com no mínimo 8 caracteres',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
