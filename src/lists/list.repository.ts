import { Repository, EntityRepository } from 'typeorm';
import { TaskList } from './list.entity';
import { CreateTaskListDto } from './dto/create-list.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(TaskList)
export class TaskListRepository extends Repository<TaskList> {
  async getTaskLists(user: User): Promise<TaskList[]> {
    const query = this.createQueryBuilder('task_list')
      .where('task_list.userId = :userId', { userId: user.id })
      .orderBy('task_list.id', 'ASC');

    const taskLists = await query.getMany();
    return taskLists;
  }

  async createTaskList(
    createTaskListDto: CreateTaskListDto,
    user: User,
  ): Promise<TaskList> {
    const { title } = createTaskListDto;
    const newTaskList = new TaskList();
    newTaskList.user = user;
    newTaskList.title = title;
    newTaskList.system = false;
    newTaskList.tasks = [];
    await newTaskList.save();

    delete newTaskList.user;

    return newTaskList;
  }
}
