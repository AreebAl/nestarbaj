import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: configService.get<number>('MYSQL_PORT'),
        username: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DB'),
        entities: [User],
        synchronize: true, // Do not use this in production
      }),
      inject: [ConfigService],
    }),
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    console.log('Connected to DB');
    console.log('MYSQL_HOST:', this.configService.get<string>('MYSQL_HOST'));
    console.log('MYSQL_PORT:', this.configService.get<number>('MYSQL_PORT'));
    console.log('MYSQL_USER:', this.configService.get<string>('MYSQL_USER'));
    console.log('MYSQL_PASSWORD:', this.configService.get<string>('MYSQL_PASSWORD'));
    console.log('MYSQL_DB:', this.configService.get<string>('MYSQL_DB'));
    console.log('JWT_SECRET:', this.configService.get<string>('JWT_SECRET'));
  }
}
