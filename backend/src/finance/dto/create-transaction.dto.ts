import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsNumber()
  categoryId: number;

  @IsDateString()
  date: string;
}
