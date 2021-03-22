import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  name: 'string';
  email: 'string';
  password: 'string';
}

class CreateUserService {
  constructor(private usersRpository: IUsersRepository) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRpository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email adders alredy used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = await this.usersRpository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
