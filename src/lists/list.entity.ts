import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Task } from 'src/tasks/task.entity';
import { User } from 'src/auth/user.entity';

@Entity()
export class TaskList extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  system: boolean;

  @ManyToOne(
    type => User,
    user => user.lists,
    { eager: false },
  )
  user: User;

  @Column()
  userId: number;

  @OneToMany(
    type => Task,
    task => task.list,
    { eager: true },
  )
  tasks: Task[];
}
