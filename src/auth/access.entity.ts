import {
  BaseEntity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Entity,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['username'])
export class Access extends BaseEntity {
  @PrimaryColumn()
  username: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;
}
