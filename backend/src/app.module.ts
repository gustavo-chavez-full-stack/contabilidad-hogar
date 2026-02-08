import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FinanceModule } from './finance/finance.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, FinanceModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
