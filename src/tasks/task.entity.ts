import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { TaskList } from '../lists/list.entity';
import { User } from '../auth/user.entity';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => User,
    user => user.tasks,
    { eager: false, nullable: false },
  )
  user: User;

  @Column()
  userId: number;

  @ManyToOne(
    type => TaskList,
    task => task.tasks,
    { eager: false, onDelete: 'CASCADE', nullable: true },
  )
  list: TaskList;

  @Column({ nullable: true })
  listId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  important: boolean;

  @Column()
  status: TaskStatus;

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
}
