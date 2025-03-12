import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Certifique-se de importar o ConfigModule
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Obtém a chave do .env
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  exports: [
    JwtModule
  ]
})
export class AuthModule {}
