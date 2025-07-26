import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AuthNonce, AuthResponse, VerifyRequest } from './interfaces/auth.interface';
import { ethers } from 'ethers';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private nonces = new Map<string, AuthNonce>();

  constructor(private readonly jwtService: JwtService) { }

  generateNonce(address: string): string {
    if (!ethers.isAddress(address)) {
      throw new UnauthorizedException('Invalid address format');
    }

    const nonce = Math.random().toString(36).substring(2, 15);

    this.nonces.set(address.toLowerCase(), {
      nonce,
      timestamp: Date.now(),
      address: address.toLowerCase(),
    });

    this.cleanupExpiredNonces();
    this.logger.log(`Generated nonce for address: ${address}`);

    return nonce;
  }

  async verifySignature(request: VerifyRequest): Promise<AuthResponse> {
    const { address, message, signature, nonce } = request;

    // Verify nonce
    const storedNonce = this.nonces.get(address.toLowerCase());
    if (!storedNonce || storedNonce.nonce !== nonce) {
      throw new UnauthorizedException('Invalid nonce');
    }

    // Check nonce expiry (5 minutes)
    if (Date.now() - storedNonce.timestamp > 5 * 60 * 1000) {
      this.nonces.delete(address.toLowerCase());
      throw new UnauthorizedException('Nonce expired');
    }

    try {
      // Verify signature
      const recoveredAddress = ethers.verifyMessage(message, signature);

      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        throw new UnauthorizedException('Invalid signature');
      }

      // Clean up nonce
      this.nonces.delete(address.toLowerCase());

      // Create JWT token
      const payload = { address: address.toLowerCase(), sub: address.toLowerCase() };
      const token = this.jwtService.sign(payload);

      this.logger.log(`User authenticated: ${address}`);

      return {
        success: true,
        token,
        user: {
          address: address.toLowerCase(),
          authenticatedAt: new Date().toISOString(),
        },
      };

    } catch (error) {
      this.logger.error(`Authentication failed for ${address}`, error);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private cleanupExpiredNonces() {
    const now = Date.now();
    const expiredAddresses: string[] = [];

    for (const [address, nonceData] of this.nonces.entries()) {
      if (now - nonceData.timestamp > 5 * 60 * 1000) {
        expiredAddresses.push(address);
      }
    }

    expiredAddresses.forEach(address => this.nonces.delete(address));
  }

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
