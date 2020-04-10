import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { TaskList } from '../lists/list.entity';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(user: User): Promise<Task[]> {
    const query = this.createQueryBuilder('task')
      .leftJoinAndSelect('task.list', 'task_list')
      .where('task.user_id = :userId', { userId: user.id })
      .orderBy('task.id', 'DESC');

    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const query = this.createQueryBuilder('task')
      .leftJoinAndSelect('task.list', 'task_list')
      .where('task.id = :taskId', { taskId: id })
      .andWhere('task.user_id = :userId', { userId: user.id });

    const task = await query.getOne();
    return task;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    taskList: TaskList,
    user: User,
  ): Promise<Task> {
    const { title, description, important } = createTaskDto;
    const newTask = new Task();
    newTask.user = user;
    newTask.list = taskList;
    newTask.title = title;
    newTask.description = description;
    newTask.status = TaskStatus.OPEN;
    newTask.important = !!important;
    await newTask.save();

    delete newTask.user;

    return newTask;
  }
}
