import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { SinginDto } from '../dto/signin.dto';
import { SignupDto } from '../dto/signup.dto';
import { SignWithGoogleService } from './sign-in-with-google.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly tokenService: TokenService,
    private readonly signWithGoogleService: SignWithGoogleService,
  ) {}

  async signin(singinDto: SinginDto) {
    const { email, password } = singinDto;

    const user = await this.usersRepo.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.password === null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.tokenService.generateTokens(user.id);
  }

  async signup(signupDto: SignupDto) {
    const { firstName, lastName, email, password } = signupDto;

    const emailTaken = await this.usersRepo.findUnique({
      where: { email },
      select: { id: true },
    });

    const hashedPassword = await hash(password, 10);

    if (emailTaken) {
      throw new ConflictException('This email in already in use');
    }

    const user = await this.usersRepo.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        categories: {
          createMany: {
            data: [
              // Income
              { name: 'Salário', icon: 'salary', type: 'INCOME' },
              { name: 'Freelance', icon: 'freelance', type: 'INCOME' },
              { name: 'Outro', icon: 'other', type: 'INCOME' },
              // Expense
              { name: 'Casa', icon: 'home', type: 'EXPENSE' },
              { name: 'Alimentação', icon: 'food', type: 'EXPENSE' },
              { name: 'Educação', icon: 'education', type: 'EXPENSE' },
              { name: 'Lazer', icon: 'fun', type: 'EXPENSE' },
              { name: 'Mercado', icon: 'grocery', type: 'EXPENSE' },
              { name: 'Roupas', icon: 'clothes', type: 'EXPENSE' },
              { name: 'Transporte', icon: 'transport', type: 'EXPENSE' },
              { name: 'Viagem', icon: 'travel', type: 'EXPENSE' },
              { name: 'Outro', icon: 'other', type: 'EXPENSE' },
            ],
          },
        },
      },
    });

    return this.tokenService.generateTokens(user.id);
  }

  async refreshToken(refreshTokenId: string) {
    try {
      const { userId } =
        await this.tokenService.validateRefreshToken(refreshTokenId);

      await this.tokenService.revokeRefreshToken(refreshTokenId);
      return await this.tokenService.generateTokens(userId);
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Token not found');
    }
  }

  revokeToken(refreshTokenId: string) {
    return this.tokenService.revokeRefreshToken(refreshTokenId);
  }

  async socialLogin(provider: string, code: string, redirectUri: string) {
    if (provider === 'google') {
      return this.signWithGoogleService.execute(code, redirectUri);
    } else {
      throw new BadRequestException('Provider is not Valid');
    }
  }
}
