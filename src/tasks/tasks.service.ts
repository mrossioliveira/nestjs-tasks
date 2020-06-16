import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';
import { ListsService } from '../lists/lists.service';
import { UpdateTaskDTO } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService');

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
    private listService: ListsService,
  ) {}

  async getTasks(userId: number): Promise<Task[]> {
    return this.taskRepository.getTasks(userId);
  }

  async getTaskById(id: number, userId: number): Promise<Task> {
    const foundTask = await this.taskRepository.getTaskById(id, userId);

    if (!foundTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return foundTask;
  }

  async getByTaskListId(listId: number, userId: number): Promise<Task[]> {
    return this.taskRepository.find({
      list: { id: listId },
      userId,
    });
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    userId: number,
  ): Promise<Task> {
    this.logger.log(`Creating task with payload: ${createTaskDto}`);
    let taskList;
    try {
      taskList = await this.listService.getTaskListById(
        createTaskDto.listId,
        userId,
      );
    } catch (error) {
      this.logger.log('Task created without a list');
    }

    return this.taskRepository.createTask(createTaskDto, taskList, userId);
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
    userId: number,
  ): Promise<Task> {
    const task = await this.getTaskById(id, userId);

    task.title = updateTaskDto.title.trim();
    task.description = updateTaskDto.description;
    await task.save();
    return task;
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    userId: number,
  ): Promise<Task> {
    const task = await this.getTaskById(id, userId);
    task.status = status;
    await task.save();
    return task;
  }

  async updateTaskImportant(
    id: number,
    important: boolean,
    userId: number,
  ): Promise<Task> {
    const task = await this.getTaskById(id, userId);
    task.important = important;
    await task.save();
    return task;
  }
}
