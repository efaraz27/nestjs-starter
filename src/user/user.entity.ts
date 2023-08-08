import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  username: string;

  @Column()
  password: string;
}
