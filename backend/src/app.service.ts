import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async checkDatabase() {
    // Ejecuta una consulta simple para verificar la conexión
    return this.prisma.$queryRaw`SELECT 1`;
  }
}
