import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './health/health.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { DiagramModule } from './diagrams/diagram.module';
import { corsConfig } from './configs/cors.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [corsConfig] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
    }),
    TerminusModule,
    HealthModule,
    AuthModule,
    UserModule,
    DiagramModule,
  ],
  controllers: [],
})
export class AppModule {}
