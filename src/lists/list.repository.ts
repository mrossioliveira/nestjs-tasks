import { Repository, EntityRepository } from 'typeorm';
import { TaskList } from './list.entity';
import { CreateTaskListDto } from './dto/create-list.dto';

@EntityRepository(TaskList)
export class TaskListRepository extends Repository<TaskList> {
  async getTaskLists(userId: number): Promise<TaskList[]> {
    const query = this.createQueryBuilder('task_list')
      .where('task_list.user_id = :userId', { userId })
      .orderBy('task_list.id', 'ASC');

    const taskLists = await query.getMany();
    return taskLists;
  }

  async createTaskList(
    createTaskListDto: CreateTaskListDto,
    userId: number,
  ): Promise<TaskList> {
    const { title } = createTaskListDto;
    const newTaskList = new TaskList();
    newTaskList.userId = userId;
    newTaskList.title = title;
    newTaskList.tasks = [];
    await newTaskList.save();
    return newTaskList;
  }
}
