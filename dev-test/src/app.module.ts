import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    MongooseModule.forRoot(`mongodb://localhost:27017`, {
      dbName: 'devtest',
    }),
    AuthModule,
    PassportModule.register({
      session: true,
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
