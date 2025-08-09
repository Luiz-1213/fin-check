import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { env } from 'process';
import { stringify } from 'qs';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { TokenService } from './token.service';

export interface IUserInfoResponse {
  email: string;
  verifiedEmail: boolean;
  firstName: string;
  lastName: string;
  photo: string;
}

@Injectable()
export class SignWithGoogleService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(code: string, redirectUri: string) {
    const accessToken = await this.getAccessToken(code, redirectUri);

    if (!accessToken) {
      throw new UnauthorizedException('Invalid access code');
    }

    const { email, firstName, lastName, verifiedEmail, photo } =
      await this.getUserInfoResponse(accessToken);

    if (!verifiedEmail) {
      throw new UnauthorizedException('Email not verified');
    }

    await this.revokeAccessToken(accessToken);

    const { id } = await this.usersRepo.upsert({
      create: {
        photo,
        email,
        firstName,
        lastName,
        password: null,
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
      update: {},
      where: { email: email },
    });

    return this.tokenService.generateTokens(id);
  }

  private async getAccessToken(code: string, redirectUri: string) {
    const options = stringify({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    });

    const { data } = await axios.post<{ access_token: string }>(
      'https://oauth2.googleapis.com/token',
      options,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return data.access_token;
  }

  private async getUserInfoResponse(
    accessToken: string,
  ): Promise<IUserInfoResponse> {
    const { data } = await axios.get(
      'https://www.googleapis.com/userinfo/v2/me',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return {
      email: data.email,
      verifiedEmail: data.verified_email,
      firstName: data.given_name,
      lastName: data.family_name,
      photo: data.picture,
    };
  }

  private async revokeAccessToken(accessToken: string): Promise<void> {
    await axios.post(
      'https://oauth2.googleapis.com/revoke',
      stringify({ token: accessToken }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
  }
}
