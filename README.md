# Expanders Quest

A scalable B2B platform built with [NestJS](https://nestjs.com/) for managing projects, vendors, and research, featuring robust JWT authentication and role-based access control.

---

## Table of Contents

- [Setup](#setup)
- [Database Schema Diagrams](#database-schema-diagrams)
- [API Endpoints](#api-endpoints)
- [Matching Formula](#matching-formula)
- [Deployment](#deployment)
- [Resources](#resources)

---

## Setup

### Prerequisites

- Node.js 18+ (recommended: Node 20+)
- Docker & Docker Compose (for local DBs)
- MySQL 8+
- MongoDB 6+

### Installation

```bash
# Clone the repo
git clone https://github.com/mohamedadelll/expanders-quest.git
cd expanders-quest

# Install dependencies
npm install

# Copy and edit environment variables
cp .env.example .env
# Edit .env as needed

# Start MySQL and MongoDB with Docker Compose
docker-compose up -d

# Run the app (dev mode)
npm run start:dev
```

App runs on [http://localhost:3000](http://localhost:3000) by default.

---

## Database Schema Diagrams

### MySQL (TypeORM Entities)

#### User

| id  | companyName | contactEmail | role | password      |
| --- | ----------- | ------------ | ---- | ------------- |
| PK  | string      | string       | enum | hashed string |

#### Project

| id  | client (FK) | country (FK) | servicesNeeded (M2M) | budget | status |
| --- | ----------- | ------------ | -------------------- | ------ | ------ |

#### Vendor

| id  | name | countriesSupported (M2M) | servicesOffered (M2M) | rating | responseSlaHours | slaExpiredAt |
| --- | ---- | ------------------------ | --------------------- | ------ | ---------------- | ------------ |

#### Match

| id  | project (FK) | vendor (FK) | score | createdAt |
| --- | ------------ | ----------- | ----- | --------- |

#### Service

| id  | serviceName |
| --- | ----------- |

#### Country

| code | name |
| ---- | ---- |

### MongoDB (Mongoose Schema)

#### Research

| projectId | title | content | tags[] |
| --------- | ----- | ------- | ------ |

---

## API Endpoints

### Auth

- `POST /auth/login` — Login, returns JWT

### Projects

- `GET /projects/:id` — Get project (JWT required)
- `POST /projects` — Create project (role: client or admin)
- `PATCH /projects/:id` — Update project (owner only)
- `DELETE /projects/:id` — Delete project (owner only)

### Vendors

- `GET /vendor` — List vendors (role: admin)
- `POST /vendor` — Create vendor (role: admin)
- `PATCH /vendor/:id` — Update vendor (role: admin)
- `DELETE /vendor/:id` — Delete vendor (role: admin)

### Research

- `POST /research` — Create research doc
- `GET /research` — Query research docs (by tag, text, project)

### Matches

- `GET /projects/:id/matches/rebuild` — Rebuild matches for a project

### Analytics

- `GET /analytics/top-vendors` — Top vendors per country, research doc counts

---

## Matching Formula

The vendor-project matching score is calculated as:

```
score = (number of overlapping services) * 2
      + vendor.rating
      + SLA_weight
```

Where:

- **SLA_weight**:
  - 2 if `responseSlaHours <= 24`
  - 1 if `responseSlaHours <= 72`
  - 0 otherwise

Only vendors supporting the project's country and at least one required service are considered.

---

## Deployment

### Local Docker Compose

```bash
docker-compose up --build
```

### Production

- Build the app: `npm run build`
- Run: `npm run start:prod` or use Docker
- Ensure environment variables are set (see `.env.example`)

#### Example Docker Deployment

```bash
docker build -t expanders-quest .
docker run --env-file .env -p 3333:3333 expanders-quest
```

---

## License<p align="center">

<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>

</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).


## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
