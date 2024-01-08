// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserSchema } from './auth/user.model';
import { AppController } from './app.controller';
import { AppService } from './app.service';
const password = encodeURIComponent('GAYcbCWJ8HAM8eag');
@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://eremapraiz:${password}@cluster0.olop2wc.mongodb.net/?retryWrites=true&w=majority`,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    ),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), // Add this line
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
