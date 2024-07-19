import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('USERSDATA')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fullName?: string;
}
