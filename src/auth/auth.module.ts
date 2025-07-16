import { Module } from '@nestjs/common';
import { GoogleStrategy } from './strategies/google.strategy';
import { UserModule } from 'src/users/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: configService.getOrThrow('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [GoogleStrategy, JwtService, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
