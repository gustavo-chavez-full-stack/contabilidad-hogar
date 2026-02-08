import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client();

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(username: string, pass: string) {
    const userExists = await this.prisma.user.findUnique({
      where: { username },
    });
    
    if (userExists) {
      throw new ConflictException('User already exists');
    }
    
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltOrRounds);
    
    await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    
    return { message: 'User registered successfully' };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    
    if (user && user.password && await bcrypt.compare(pass, user.password)) {
      const result = { ...user };
      delete (result as any).password;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async googleLogin(token: string) {
    try {
      // In a real scenario, use verifyIdToken for OIDC or fetch userinfo for access_token
      // For this implementation, we'll use the access_token to get user info from Google's API
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
      const googleUser = await response.json();

      if (!googleUser || !googleUser.email) {
        throw new UnauthorizedException('Invalid Google token');
      }

      let user = await this.prisma.user.findUnique({
        where: { email: googleUser.email },
      });

      if (!user) {
        // Create new user if it doesn't exist
        user = await this.prisma.user.create({
          data: {
            username: googleUser.email.split('@')[0] + Math.floor(Math.random() * 1000),
            email: googleUser.email,
          },
        });
      }

      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Google authentication failed');
    }
  }
}
