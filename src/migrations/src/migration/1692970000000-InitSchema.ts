import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1692970000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE country (
        code VARCHAR(3) PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );
      CREATE TABLE service (
        id INT AUTO_INCREMENT PRIMARY KEY,
        serviceName VARCHAR(100) NOT NULL
      );
      CREATE TABLE user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        companyName VARCHAR(100) NOT NULL,
        contactEmail VARCHAR(100) NOT NULL,
        role ENUM('client', 'admin') NOT NULL,
        password VARCHAR(255) NOT NULL
      );
      CREATE TABLE vendor (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        rating FLOAT DEFAULT 0,
        responseSlaHours INT,
        slaExpiredAt DATETIME
      );
      CREATE TABLE project (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clientId INT,
        countryCode VARCHAR(3),
        budget FLOAT,
        status VARCHAR(50),
        FOREIGN KEY (clientId) REFERENCES user(id),
        FOREIGN KEY (countryCode) REFERENCES country(code)
      );
      CREATE TABLE project_services_service (
        projectId INT,
        serviceId INT,
        PRIMARY KEY (projectId, serviceId),
        FOREIGN KEY (projectId) REFERENCES project(id),
        FOREIGN KEY (serviceId) REFERENCES service(id)
      );
      CREATE TABLE vendor_services_service (
        vendorId INT,
        serviceId INT,
        PRIMARY KEY (vendorId, serviceId),
        FOREIGN KEY (vendorId) REFERENCES vendor(id),
        FOREIGN KEY (serviceId) REFERENCES service(id)
      );
      CREATE TABLE vendor_countries_country (
        vendorId INT,
        countryCode VARCHAR(3),
        PRIMARY KEY (vendorId, countryCode),
        FOREIGN KEY (vendorId) REFERENCES vendor(id),
        FOREIGN KEY (countryCode) REFERENCES country(code)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS vendor_countries_country;
      DROP TABLE IF EXISTS vendor_services_service;
      DROP TABLE IF EXISTS project_services_service;
      DROP TABLE IF EXISTS project;
      DROP TABLE IF EXISTS vendor;
      DROP TABLE IF EXISTS user;
      DROP TABLE IF EXISTS service;
      DROP TABLE IF EXISTS country;
    `);
  }
}
