import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidUnknownValues: true,
    transform: true,
  }));

  // Enable CORS with restrictions for production later
  app.enableCors({
    origin: '*', // In production, replace with the frontend URL
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
