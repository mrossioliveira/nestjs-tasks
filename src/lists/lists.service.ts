import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskListRepository } from './list.repository';
import { TaskList } from './list.entity';
import { CreateTaskListDto } from './dto/create-list.dto';
import { DeleteResult } from 'typeorm';
import { User } from '../auth/user.entity';
import { UpdateListDTO } from './dto/update-list.dto';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(TaskListRepository)
    private taskListRepository: TaskListRepository,
  ) {}

  /**
   * Get all task lists for the authenticated user
   * @param user Authenticated user
   */
  async getTaskLists(user: User): Promise<TaskList[]> {
    return this.taskListRepository.getTaskLists(user);
  }

  /**
   * Get a single task list if it belongs to the authenticated uer
   * @param id ID of the desired task list
   * @param user Authenticated user
   */
  async getTaskListById(id: number, user: User): Promise<TaskList> {
    const foundTask = await this.taskListRepository.findOne({
      id,
      userId: user.id,
    });

    if (!foundTask) {
      throw new NotFoundException(`Task list with ID ${id} not found`);
    }

    return foundTask;
  }

  /**
   * Create a new task list for the authenticated user
   * @param createTaskListDto Task list DTO definition
   * @param user Authenticated user
   */
  async createTaskList(
    createTaskListDto: CreateTaskListDto,
    user: User,
  ): Promise<TaskList> {
    return this.taskListRepository.createTaskList(createTaskListDto, user);
  }

  // ? Create a DTO so it's possible to update another fields in the future
  /**
   * Update a single task list of the authenticated user
   * @param id Task list ID
   * @param user Authenticated user
   * @param title The new title to be updated
   */
  async updateTaskList(
    id: number,
    user: User,
    updateListDto: UpdateListDTO,
  ): Promise<TaskList> {
    const taskList = await this.getTaskListById(id, user);
    taskList.title = updateListDto.title;
    await taskList.save();
    return taskList;
  }

  /**
   * Deletes a single task list
   * @param id ID of the task list
   */
  async deleteTaskListById(id: number, user: User): Promise<void> {
    const result: DeleteResult = await this.taskListRepository.delete({
      id,
      userId: user.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Task list with ID ${id} not found`);
    }
  }
}
