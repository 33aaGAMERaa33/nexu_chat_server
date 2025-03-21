import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WebSocketAdapter } from './chat/web-socket.adapter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true, 
    transform: true, 
  }));

  const configService = app.get(ConfigService);

  app.useWebSocketAdapter(new WebSocketAdapter(configService));

  await app.listen(Number(process.env.SERVER_PORT));
}

bootstrap();
