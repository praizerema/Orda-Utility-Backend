// user.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthDto, AuthSignInDto } from './dto';
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
  async signup(@Body() createUser: AuthDto) {
    // console.log(req.body);
    // Assuming CreateUserDto has properties like 'username' and 'password'
    const user = await this.authService.signup(createUser);
    // return user;
    // You may choose to log the user in automatically after signing up
    const loginResult = await this.authService.signin(user);

    return loginResult;
  }
}
