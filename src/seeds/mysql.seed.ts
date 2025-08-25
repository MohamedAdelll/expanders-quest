import { DataSource } from 'typeorm';
import { User, UserRole } from '../user/user.entity';
import { Country } from '../country/country.entity';
import { Service } from '../service/service.entity';
import { Vendor } from '../vendor/vendor.entity';
import { Project, ProjectStatus } from '../project/project.entity';
import * as bcrypt from 'bcrypt';

export async function seedMySQL(dataSource: DataSource) {
  // Countries
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'EG', name: 'Egypt' },
  ];
  await dataSource.getRepository(Country).save(countries);

  // Services
  const services = [
    { serviceName: 'Market Research' },
    { serviceName: 'Data Analysis' },
    { serviceName: 'Consulting' },
  ];
  await dataSource.getRepository(Service).save(services);

  // Users
  const admin = new User();
  admin.companyName = 'Admin Corp';
  admin.contactEmail = 'admin@corp.com';
  admin.role = UserRole.CLIENT;
  admin.password = (await bcrypt.hash('adminpass', 10)) as string;

  const client = new User();
  client.companyName = 'Client Inc';
  client.contactEmail = 'client@inc.com';
  client.role = UserRole.CLIENT;
  client.password = (await bcrypt.hash('clientpass', 10)) as string;

  await dataSource.getRepository(User).save([admin, client]);

  // Vendors
  const vendor = new Vendor();
  vendor.name = 'Vendor One';
  vendor.rating = 4.5;
  vendor.responseSlaHours = 24;
  await dataSource.getRepository(Vendor).save(vendor);

  // Projects
  const project = new Project();
  project.client = client;
  project.country = countries[0].code;
  project.budget = 10000;
  project.status = ProjectStatus.ACTIVE;
  await dataSource.getRepository(Project).save(project);
}
