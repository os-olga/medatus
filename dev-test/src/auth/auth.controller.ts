import { Request } from 'express';

import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login() {
    console.log();
  }

  @Get('')
  async getAuthSession(@Session() session: Record<string, any>) {
    session.authenticated = true;
    return session;
  }

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.authService.register(username, email, password);
  }

  @Get('status')
  async getAuthStatus(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }

  @Put('user/change-password')
  async changePassword(
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Req() req: Request,
  ) {
    return await this.authService.updatePassword(
      oldPassword,
      newPassword,
      req.user,
    );
  }

  @Get('logout')
  logout(@Req() request: Request) {
    request.destroy();
  }
}
