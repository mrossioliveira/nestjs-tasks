import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { TaskList } from 'src/lists/list.entity';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => TaskList,
    task => task.tasks,
    { eager: false, onDelete: 'CASCADE' },
  )
  list: TaskList;

  @Column()
  listId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  important: boolean;

  @Column()
  myDay: boolean;

  @Column()
  status: TaskStatus;
}
