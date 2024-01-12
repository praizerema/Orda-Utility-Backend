// user.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthSignUpDto, AuthSignInDto } from './dto';
// import { User } from './user.model';

@Controller('auth')
export class UserController {
  constructor(private authService: AuthService) {}

  //   @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signin(@Body() userObj: AuthSignInDto) {
    return this.authService.signin(userObj);
  }

  @Post('signup')
  async signup(@Body() signUpDto: AuthSignUpDto) {
    const user = await this.authService.signup(signUpDto);

    return user;
  }
}
