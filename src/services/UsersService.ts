import { getCustomRepository, Repository } from "typeorm";
import { User } from "../entities/user";
import { UsersRepository } from "../repositories/UsersRepository";

class UsersService {
  private usersRepository: Repository<User>;

  constructor() {
    this.usersRepository = getCustomRepository(UsersRepository);
  }

  async create(email: string) {
    const userExists = await this.usersRepository.findOne({ email });

    if (userExists) {
      return userExists;
    }

    const user = await this.usersRepository.create({
      email,
    });

    await this.usersRepository.save(user);
    return user;
  }
}

export { UsersService };
