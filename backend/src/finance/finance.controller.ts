import { Controller, Get, Post, Put, Delete, Body, UseGuards, Request, Param } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('finance')
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  @Get('dashboard')
  getDashboardSummary(@Request() req: any) {
    return this.financeService.getDashboardSummary(req.user.userId);
  }

  @Get('transactions')
  getTransactions(@Request() req: any) {
    return this.financeService.getTransactions(req.user.userId);
  }

  @Post('transactions')
  createTransaction(@Request() req: any, @Body() transaction: any) {
    return this.financeService.createTransaction(req.user.userId, transaction);
  }

  @Get('fixed-expenses')
  getFixedExpenses(@Request() req: any) {
    return this.financeService.getFixedExpenses(req.user.userId);
  }

  @Post('fixed-expenses')
  createFixedExpense(@Request() req: any, @Body() data: any) {
    return this.financeService.createFixedExpense(req.user.userId, data);
  }

  @Put('fixed-expenses/:id')
  updateFixedExpense(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    return this.financeService.updateFixedExpense(req.user.userId, parseInt(id), data);
  }

  @Delete('fixed-expenses/:id')
  deleteFixedExpense(@Request() req: any, @Param('id') id: string) {
    return this.financeService.deleteFixedExpense(req.user.userId, parseInt(id));
  }

  @Post('fixed-expenses/:id/pay')
  payFixedExpense(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    return this.financeService.payFixedExpense(req.user.userId, parseInt(id), data);
  }

  @Get('categories')
  getCategories() {
    return this.financeService.getCategories();
  }
}
