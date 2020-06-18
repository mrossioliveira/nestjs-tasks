import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { AuthModule } from '../auth/auth.module';
import { ListsModule } from '../lists/lists.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    AuthModule,
    ListsModule,
    TypeOrmModule.forFeature([TaskRepository]),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_TCP_HOST || 'localhost',
          port: parseInt(process.env.AUTH_TCP_PORT) || 8000,
        },
      },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
