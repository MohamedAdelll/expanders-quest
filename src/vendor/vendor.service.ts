import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './vendor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor) private vendorRepo: Repository<Vendor>,
  ) {}
  async findAll() {
    return await this.vendorRepo.find();
  }
  async updateVendor(id: number, vendorData: Partial<Vendor>) {
    await this.vendorRepo.update(id, vendorData);
    return await this.vendorRepo.findOneBy({ id });
  }
}
