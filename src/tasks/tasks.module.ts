import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { AuthModule } from '../auth/auth.module';
import { ListsModule } from '../lists/lists.module';

@Module({
  imports: [
    AuthModule,
    ListsModule,
    TypeOrmModule.forFeature([TaskRepository]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
