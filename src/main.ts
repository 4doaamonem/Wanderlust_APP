import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './logger/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  
  // Enable CORS for frontend integration
  app.enableCors({
    origin: true, // Allow all origins during development
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    exposedHeaders: ['ngrok-skip-browser-warning'],
  });
  
  app.use((_req: any, res: any, next: any) => {
    res.header('ngrok-skip-browser-warning', 'true');
    next(); 
  });
  
  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Global Logging Interceptor for Request/Response tracking
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Wanderlust API')
    .setDescription('Travel Platform Backend API')

    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('countries')
    .addTag('weather')
    .addTag('currency')
    .addTag('restaurants')
    .addTag('hotels')
    .addTag('popular-places')
    .addTag('profile')
    .addTag('subscriptions')
    .addTag('payment')
    .addTag('premium')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log(' Swagger UI available at: http://localhost:3000/api');
  console.log('🔍 Global Logging Interceptor enabled - All requests will be logged');
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(` Server running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();

