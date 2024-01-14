// app.module.ts
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BidModule } from './bid/bid.module';
import { UserController } from './auth/user.controller';
import { AuthService } from './auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { CorsOptions } from 'cors';
import * as cors from 'cors';
import { UserSchema } from './auth/user.schema';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.olop2wc.mongodb.net/?retryWrites=true&w=majority`,
    ),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule,
    BidModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, AuthService],
})
export class AppModule {
  // Implement the configure method to enable CORS
  configure(consumer: MiddlewareConsumer) {
    const corsOptions: CorsOptions = {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    };

    // Enable CORS for all routes
    // consumer
    //   .apply((req, res, next) => {
    //     // Your custom middleware (if any)
    //     next();
    //   })
    //   .forRoutes('*');
    consumer.apply(cors(corsOptions)).forRoutes('*');
  }
}
