import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskListRepository } from './list.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([TaskListRepository])],
  providers: [ListsService],
  controllers: [ListsController],
  exports: [ListsService],
})
export class ListsModule {}
