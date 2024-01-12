// bid/bid.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid } from './bid.schema';
import { CreateBidDto } from './dto/creat-bid.dto';
import { User } from 'src/auth/user.schema';

export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
}

@Injectable()
export class BidService {
  constructor(@InjectModel(Bid.name) private readonly bidModel: Model<Bid>) {}

  async placeBid(bid: CreateBidDto, user: User): Promise<ApiResponse<Bid>> {
    try {
      const newBid = new this.bidModel({
        ...bid,
        status: 'pending',
        user: user._id,
      });
      await newBid.save();
      return {
        statusCode: 200,
        message: 'Bid placed successfully',
        data: newBid,
      };
    } catch (error) {
      // Handle errors and return an appropriate response
      return {
        statusCode: error instanceof UnauthorizedException ? 401 : 500,
        message: error.message || 'Internal server error',
      };
    }
  }

  async getBidHistory(): Promise<ApiResponse<Bid[]>> {
    try {
      const bids = await this.bidModel.find().exec();
      return {
        statusCode: 200,
        message: 'Bids fetched successfully',
        data: bids,
      };
    } catch (error) {
      // Handle errors and return an appropriate response
      return {
        statusCode: error instanceof UnauthorizedException ? 401 : 500,
        message: error.message || 'Internal server error',
      };
    }
  }
}
