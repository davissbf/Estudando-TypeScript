import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';

interface Request {
  name: 'string';
  email: 'string';
  password: 'string';
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRpository = getRepository(User);

    const checkUserExists = await usersRpository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('Email adders alredy used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRpository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRpository.save(user);

    return user;
  }
}

export default CreateUserService;
