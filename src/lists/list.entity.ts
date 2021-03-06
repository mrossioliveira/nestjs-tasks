import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { Task } from '../tasks/task.entity';
import { type } from 'os';

@Entity()
export class TaskList extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  // @ManyToOne(
  //   type => User,
  //   user => user.lists,
  //   { eager: false },
  // )
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @OneToMany(
    type => Task,
    task => task.list,
    { eager: false },
  )
  @JoinColumn({ name: 'task_id' })
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
      userId: 42,
      tasks: [],
    };
  }
}
