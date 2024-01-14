import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse, BidService } from './bid.service';
import { Bid } from './bid.schema';
import { CreateBidDto } from './dto/creat-bid.dto';
import { User } from 'src/auth/user.schema';

@Controller('auth')
export class BidController {
  constructor(private bidService: BidService) {}

  @UseGuards(JwtAuthGuard)
  @Post('bids/create')
  async placeBid(
    @Body(new ValidationPipe({ transform: true })) bid: CreateBidDto,
    @Req() req: Express.Request,
    // @Res() res: Express.Request,
  ): Promise<ApiResponse<Bid>> {
    bid.start_time = new Date(bid.start_time);
    bid.close_time = new Date(bid.close_time);
    return this.bidService.placeBid(bid, req.user as User);
  }

  @Get('bids/history')
  @UseGuards(JwtAuthGuard)
  async getBidHistory(): Promise<ApiResponse<Bid[]>> {
    return this.bidService.getBidHistory();
  }
}
