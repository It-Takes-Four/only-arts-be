import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwt(user: { id: string; email: string; username: string | null }): Promise<{ accessToken: string; expiresIn: number }> {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const expiresInSeconds = parseInt(process.env.JWT_EXPIRES_IN || '3600');
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: expiresInSeconds,
    });

    return {
      accessToken,
      expiresIn: expiresInSeconds,
    };
  }
}
