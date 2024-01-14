import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsDate, IsEmpty } from 'class-validator';
import { User } from 'src/auth/user.schema';

export class CreateBidDto {
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @Transform(({ value }) => new Date(value)) // Custom transformation for startTime
  @IsDate()
  start_time: Date;

  @Transform(({ value }) => new Date(value)) // Custom transformation for closeTime
  @IsDate()
  close_time: Date;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
