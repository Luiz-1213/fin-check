import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: '',
    description: 'Refresh token válido',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  refreshToken: string;
}
