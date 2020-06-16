import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskListRepository } from './list.repository';
import { TaskList } from './list.entity';
import { CreateTaskListDto } from './dto/create-list.dto';
import { DeleteResult } from 'typeorm';
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
  async getTaskLists(userId: number): Promise<TaskList[]> {
    return this.taskListRepository.getTaskLists(userId);
  }

  /**
   * Get a single task list if it belongs to the authenticated uer
   * @param id ID of the desired task list
   * @param user Authenticated user
   */
  async getTaskListById(id: number, userId: number): Promise<TaskList> {
    const foundList = await this.taskListRepository.findOne(
      {
        id,
        userId,
      },
      { relations: ['tasks'] },
    );

    if (!foundList) {
      throw new NotFoundException(`Task list with ID ${id} not found!!!`);
    }

    return foundList;
  }

  /**
   * Create a new task list for the authenticated user
   * @param createTaskListDto Task list DTO definition
   * @param user Authenticated user
   */
  async createTaskList(
    createTaskListDto: CreateTaskListDto,
    userId: number,
  ): Promise<TaskList> {
    return this.taskListRepository.createTaskList(createTaskListDto, userId);
  }

  /**
   * Update a single task list of the authenticated user
   * @param id Task list ID
   * @param user Authenticated user
   * @param title The new title to be updated
   */
  async updateTaskList(
    id: number,
    userId: number,
    updateListDto: UpdateListDTO,
  ): Promise<TaskList> {
    const taskList = await this.getTaskListById(id, userId);
    taskList.title = updateListDto.title;
    await taskList.save();
    return taskList;
  }

  /**
   * Deletes a single task list
   * @param id ID of the task list
   */
  async deleteTaskListById(id: number, userId: number): Promise<void> {
    const result: DeleteResult = await this.taskListRepository.delete({
      id,
      userId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Task list with ID ${id} not found`);
    }
  }
}
