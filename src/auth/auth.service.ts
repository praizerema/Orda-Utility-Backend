// auth.service.ts
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import { AuthDto, AuthSignInDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // async validateUser(email: string, password: string): Promise<any> {
  //   const user = await this.userModel.findOne({ email, password }).exec();
  //   return user;
  // }

  async validateUserById(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    return user;
  }

  async signin(user: AuthSignInDto): Promise<{ access_token: string }> {
    const userObj = await this.validateUser(user.email, user.password);
    if (!userObj) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.email };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();

    if (user && (await bcrypt.compare(password, user.password))) {
      // Passwords match, return the user
      return user;
    }

    return null; // User not found or password doesn't match
  }

  async signup(user: AuthDto): Promise<any> {
    // Check if the email is already taken
    const { email, password } = user;
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ForbiddenException('Email already in use');
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10); // Use an appropriate saltRounds value

    // Create a new user instance with the hashed password
    const newUser = new this.userModel({ email, password: hashedPassword });

    // Save the new user to the database
    const savedUser = await newUser.save();

    return savedUser;
  }
}
