import {
  Controller,
  HttpCode,
  HttpStatus,
  Body,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto, AuthRegisterDto } from './auth.schema';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.logIn(authLoginDto.username, authLoginDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() authRegisterDto: AuthRegisterDto) {
    return this.authService.register(
      authRegisterDto.username,
      authRegisterDto.password,
    );
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Request() request) {
    return request.user;
  }
}
