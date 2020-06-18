import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskListRepository } from './list.repository';
import { AuthModule } from '../auth/auth.module';
import { TasksService } from '../tasks/tasks.service';
import { TaskRepository } from '../tasks/task.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    AuthModule,
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
    TypeOrmModule.forFeature([TaskListRepository]),
  ],
  providers: [ListsService, TasksService, TaskRepository],
  controllers: [ListsController],
  exports: [ListsService],
})
export class ListsModule {}
