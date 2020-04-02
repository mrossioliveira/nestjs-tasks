import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskList } from '../lists/list.entity';
import * as bcrypt from 'bcrypt';
import { Task } from '../tasks/task.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column()
  salt: string;

  @OneToMany(
    type => TaskList,
    list => list.user,
    { eager: true },
  )
  lists: TaskList[];

  @OneToMany(
    type => Task,
    task => task.user,
    { eager: true },
  )
  tasks: TaskList[];

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

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  static createMock() {
    return {
      id: 42,
      username: 'Testr',
    };
  }
}
