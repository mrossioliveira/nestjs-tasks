import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Task } from '../tasks/task.entity';
import { User } from '../auth/user.entity';

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

  static createMock() {
    return {
      id: 1,
      title: 'A mocked list',
      system: false,
      user: User.createMock(),
      userId: 42,
      tasks: [],
    };
  }
}
