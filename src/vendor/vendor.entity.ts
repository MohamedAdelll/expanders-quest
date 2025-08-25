import { Country } from 'src/country/country.entity';
import { Service } from 'src/service/service.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Country)
  @JoinTable({
    name: 'vendor_countries',
    joinColumn: { name: 'vendor_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'country_code', referencedColumnName: 'code' },
  })
  countriesSupported: Country[];

  @ManyToMany(() => Service)
  @JoinTable({
    name: 'vendor_services',
    joinColumn: { name: 'vendor_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },
  })
  servicesOffered: Service[];

  @Column({ name: 'rating', type: 'decimal', precision: 3, scale: 2 })
  rating: number;

  @Column({ name: 'response_sla_hours', type: 'int', nullable: false })
  responseSlaHours: number;

  @Column({ name: 'sla_expired_at', type: 'timestamp', nullable: true })
  slaExpiredAt: Date;
}
