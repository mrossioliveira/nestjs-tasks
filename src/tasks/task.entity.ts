import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { TaskList } from '../lists/list.entity';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(
  //   type => User,
  //   user => user.tasks,
  //   { eager: false, nullable: false },
  // )
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(
    type => TaskList,
    task => task.tasks,
    { eager: true, onDelete: 'CASCADE', nullable: true },
  )
  @JoinColumn({ name: 'list_id' })
  list: TaskList;

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
