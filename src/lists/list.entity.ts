import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
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

  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: false,
  })
  updatedAt: Date;

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
