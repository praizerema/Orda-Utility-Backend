import { Module } from '@nestjs/common';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { Bid, BidSchema } from './bid.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Bid.name, schema: BidSchema }]),
  ],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}
