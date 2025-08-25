import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('countries')
export class Country {
  @PrimaryColumn({ type: 'char', length: 2, nullable: false })
  code: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  name: string;
}
