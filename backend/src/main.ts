import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do CORS
  app.enableCors({
    origin: ['http://localhost:3001'], // URL do frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão no DTO
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Gestor de Igrejas API')
    .setDescription(
      'API para gerenciamento de igrejas, membros, grupos e escola bíblica',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Endpoints de autenticação')
    .addTag('members', 'Gerenciamento de membros')
    .addTag('groups', 'Gerenciamento de grupos e ministérios')
    .addTag('biblical-school', 'Gerenciamento da escola bíblica')
    .addTag('dashboard', 'Endpoints do dashboard')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
void bootstrap();
