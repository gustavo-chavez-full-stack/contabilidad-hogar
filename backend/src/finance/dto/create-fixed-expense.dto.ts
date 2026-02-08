import { IsString, IsNumber } from 'class-validator';

export class CreateFixedExpenseDto {
  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsString()
  dueDate: string;

  @IsNumber()
  categoryId: number;
}
