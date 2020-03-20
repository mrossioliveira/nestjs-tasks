import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';
import { TaskListRepository } from 'src/lists/list.repository';
import { ListsService } from 'src/lists/lists.service';
import { User } from 'src/auth/user.entity';
import { UpdateTaskDTO } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
    private listService: ListsService,
  ) {}

  async getTasks(user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const foundTask = await this.taskRepository.getTaskById(id, user);

    if (!foundTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    delete foundTask.list;

    return foundTask;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const taskList = await this.listService.getTaskListById(
      createTaskDto.listId,
      user,
    );
    return this.taskRepository.createTask(createTaskDto, taskList);
  }

  async deleteTaskById(id: number): Promise<void> {
    const result: DeleteResult = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async updateTask(
    id: number,
    updateTaskDto: UpdateTaskDTO,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.title = updateTaskDto.title;
    task.description = updateTaskDto.description;
    await task.save();
    return task;
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }

  async updateTaskImportant(
    id: number,
    important: boolean,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.important = important;
    await task.save();
    return task;
  }

  async updateTaskMyDay(id: number, myDay: boolean, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.myDay = myDay;
    await task.save();
    return task;
  }
}
