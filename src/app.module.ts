import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
