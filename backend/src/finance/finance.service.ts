import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async getDashboardSummary(userId: number) {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      include: { category: true }
    });

    const income = transactions
      .filter((t) => t.category?.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const expenses = transactions
      .filter((t) => t.category?.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const balance = income - expenses;

    // Get expenses by category for the pie chart
    const expensesByCategory = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { 
        userId,
        category: { type: 'expense' }
      },
      _sum: {
        amount: true
      }
    });

    // Fetch category names for the IDs
    const categoryIds = expensesByCategory.map(e => e.categoryId).filter(id => id !== null) as number[];
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } }
    });

    const categoryData = expensesByCategory.map(item => {
      const category = categories.find(c => c.id === item.categoryId);
      return {
        name: category?.name || 'Otros',
        value: item._sum.amount || 0
      };
    });

    return {
      balance,
      income,
      expenses,
      categoryData,
      totalTransactions: transactions.length
    };
  }

  async getTransactions(userId: number) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: 'desc' },
    });
  }

  async createTransaction(userId: number, data: any) {
    return this.prisma.transaction.create({
      data: {
        amount: parseFloat(data.amount),
        description: data.description,
        categoryId: parseInt(data.categoryId),
        date: new Date(data.date),
        userId,
      },
    });
  }

  async getFixedExpenses(userId: number) {
    return this.prisma.fixedExpense.findMany({
      where: { userId },
      include: { category: true },
    });
  }

  async createFixedExpense(userId: number, data: any) {
    return this.prisma.fixedExpense.create({
      data: {
        amount: parseFloat(data.amount),
        description: data.description,
        dueDate: data.dueDate.toString(),
        categoryId: parseInt(data.categoryId),
        userId,
      },
    });
  }

  async updateFixedExpense(userId: number, id: number, data: any) {
    return this.prisma.fixedExpense.updateMany({
      where: { id, userId },
      data: {
        amount: parseFloat(data.amount),
        description: data.description,
        dueDate: data.dueDate.toString(),
        categoryId: parseInt(data.categoryId),
      },
    });
  }

  async deleteFixedExpense(userId: number, id: number) {
    return this.prisma.fixedExpense.deleteMany({
      where: { id, userId },
    });
  }

  async payFixedExpense(userId: number, id: number, data: any) {
    const expense = await this.prisma.fixedExpense.findFirst({
      where: { id, userId }
    });

    if (!expense) throw new Error('Gasto fijo no encontrado');

    return this.prisma.transaction.create({
      data: {
        amount: expense.amount,
        description: `${expense.description} - ${data.month || 'Pago'}`,
        categoryId: expense.categoryId,
        date: new Date(data.date || new Date()),
        userId,
      }
    });
  }

  async getCategories() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  }
}
