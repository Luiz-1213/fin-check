import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SocialLoginDto {
  @ApiProperty({
    example: '15624862',
    description: 'Codigo válido do provedor',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 'https://aplication/callbacks/google',
    description: 'URI de redirecionamento válido',
  })
  @IsString()
  @IsNotEmpty()
  redirectUri: string;

  @ApiProperty({
    example: 'google',
    description: 'Provedor de login válido',
  })
  @IsString()
  @IsNotEmpty()
  provider: string;
}
