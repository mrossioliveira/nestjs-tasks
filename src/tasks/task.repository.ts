import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { TaskList } from 'src/lists/list.entity';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(user: User): Promise<Task[]> {
    const query = this.createQueryBuilder('task')
      .innerJoin('task.list', 'list')
      .where('list.userId = :userId', { userId: user.id });

    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const query = this.createQueryBuilder('task')
      .innerJoinAndSelect('task.list', 'list')
      .where('task.id = :taskId', { taskId: id })
      .andWhere('list.userId = :userId', { userId: user.id });

    const task = await query.getOne();
    return task;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    taskList: TaskList,
  ): Promise<Task> {
    const { title, description, important, myDay } = createTaskDto;
    const newTask = new Task();
    newTask.list = taskList;
    newTask.title = title;
    newTask.description = description;
    newTask.status = TaskStatus.OPEN;
    newTask.important = !!important;
    newTask.myDay = !!myDay;
    await newTask.save();
    return newTask;
  }
}
