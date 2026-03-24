import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

import { User } from '../users/schemas/user.schema';
import { Company } from '../companies/schemas/company.schema';
import { Job } from '../jobs/schemas/job.schema';
import { CreateUserData } from '../users/users.service';
interface SeedUser extends CreateUserData {
  location: string;
  bio: string;
  skills: string[];
  profilePicture: string;
}
@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @InjectModel(Job.name) private jobModel: Model<Job>,
  ) {}
  async runSeed() {
    await this.userModel.deleteMany({});
    await this.companyModel.deleteMany({});
    await this.jobModel.deleteMany({});
    const companies = await this.companyModel.insertMany([
      {
        name: 'Zonamerica Cali',
        industry: 'Tecnología',
        description: 'Parque empresarial y tecnológico.',
      },
      {
        name: 'Carvajal Tecnología',
        industry: 'Servicios IT',
        description: 'Soluciones digitales globales.',
      },
      {
        name: 'TaskUs Colombia',
        industry: 'BPO/Tech',
        description: 'Soporte para startups de Silicon Valley.',
      },
    ]);
    const passwordHash = await bcrypt.hash('Password123!', 10);
    const users: SeedUser[] = [];
    for (let i = 0; i < 10; i++) {
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: passwordHash,
        location: 'Cali, Colombia',
        bio: 'Estudiante de Ingeniería de Sistemas en Alianza.',
        skills: ['NestJS', 'TypeScript', 'MongoDB'],
        profilePicture: faker.image.avatar(),
      });
    }
    await this.userModel.insertMany(users);
    const jobs = [
      {
        title: 'Backend Developer (NestJS)',
        company: companies[0]._id,
        location: 'Remoto / Cali',
        salaryRange: '$4M - $6M COP',
        description: 'Buscamos talento local para escalar Alliance.',
        tags: ['NestJS', 'Node.js'],
      },
      {
        title: 'Junior Cloud Engineer',
        company: companies[1]._id,
        location: 'Cali, Valle',
        salaryRange: '$3.5M COP',
        description: 'Únete al equipo de infraestructura.',
        tags: ['AWS', 'Docker'],
      },
    ];
    await this.jobModel.insertMany(jobs);
    return { message: 'Seed ejecutado con éxito y tipado fuerte.' };
  }
}
