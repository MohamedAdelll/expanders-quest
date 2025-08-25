import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'company_name',
    type: 'varchar',
    length: 255,
  })
  companyName: string;

  @Column({
    name: 'contact_email',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  contactEmail: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({ name: 'password_hash', type: 'text', nullable: false })
  password: string;
}
