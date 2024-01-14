// auth.service.ts
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthSignInDto, AuthSignUpDto } from './dto';
import { User } from './user.schema';
import { ApiResponse } from 'src/bid/bid.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(user: AuthSignUpDto): Promise<any> {
    // Check if the email is already taken
    try {
      const { email, first_name, last_name, password } = user;
      const existingUser = await this.userModel.findOne({ email }).exec();
      if (existingUser) {
        throw new ForbiddenException('Email already in use');
      }

      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user instance with the hashed password
      const newUser = new this.userModel({
        email,
        first_name,
        last_name,
        password: hashedPassword,
      });

      // Save the new user to the database
      const savedUser = await newUser.save();
      const successResp = {
        email: savedUser.email,
        first_name: savedUser.first_name,
        last_name: savedUser.last_name,
      };
      return {
        statusCode: 200,
        message: 'User created successfully',
        data: successResp,
      };
    } catch (error) {
      // Handle errors and return an appropriate response
      return {
        statusCode: error instanceof ForbiddenException ? 403 : 500,
        message: error.message || 'Internal server error',
      };
    }
  }
  async validateUserById(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }
    return user;
  }

  async signin(signInDto: AuthSignInDto): Promise<ApiResponse<any>> {
    try {
      const { email, password } = signInDto;
      const existingUser = await this.validateUser(email);
      // if user does not exist, throw exception
      if (!existingUser) {
        throw new ForbiddenException('User does not exist');
      }
      // compare password
      const pwMatches = await bcrypt.compare(password, existingUser.password);

      // if password incorrect, throw exception
      if (!pwMatches) {
        throw new ForbiddenException('Invalid login credentials');
      }

      const access_token = this.jwtService.sign({ id: existingUser._id });
      const userData = {
        last_name: existingUser.first_name,
        first_name: existingUser.last_name,
        email: existingUser.email,
        _id: existingUser._id,
      };
      return {
        statusCode: 200,
        message: 'User created successfully',
        data: { access_token, user: userData },
      };
    } catch (error) {
      return {
        statusCode:
          error instanceof ForbiddenException ? 403 : error.response.statusCode,
        message: error.message || 'Internal server error',
      };
    }
  }

  async validateUser(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();

    if (user) {
      return user;
    }

    return null; // User not found or password doesn't match
  }
}
