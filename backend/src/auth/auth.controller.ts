import { Controller, Post, Body, UnauthorizedException, BadRequestException, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    const { username, password } = body;
    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }
    return this.authService.register(username, password);
  }

  @Post('login')
  async login(@Body() body: any) {
    const { username, password } = body;
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('google')
  async googleLogin(@Body() body: any) {
    const { token } = body;
    if (!token) {
      throw new BadRequestException('Google token is required');
    }
    return this.authService.googleLogin(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
