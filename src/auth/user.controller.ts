// user.controller.ts
import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpDto, AuthSignInDto } from './dto';

@Controller('auth')
export class UserController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signin(
    @Body() userObj: AuthSignInDto,
    @Res() res: Response,
  ): Promise<void> {
    const response = await this.authService.signin(userObj);

    (res.status as any)(response.statusCode).json(response);
  }

  @Post('signup')
  async signup(
    @Body() signUpDto: AuthSignUpDto,
    @Res() res: Response,
  ): Promise<void> {
    const response = await this.authService.signup(signUpDto);

    (res.status as any)(response.statusCode).json(response);
  }
}
