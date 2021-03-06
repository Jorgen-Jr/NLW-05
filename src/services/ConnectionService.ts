import { getCustomRepository, Repository } from "typeorm";
import { Connection } from "../entities/connection";
import { ConnectionRepository } from "../repositories/ConnectionRepository";

interface IConnectionCreate {
  socket_id: string;
  user_id: string;
  admin_id?: string;
  id?: string;
}

class ConnectionService {
  private connectionReposytory: Repository<Connection>;

  constructor() {
    this.connectionReposytory = getCustomRepository(ConnectionRepository);
  }

  async create({ user_id, admin_id, socket_id, id }: IConnectionCreate) {
    const connection = await this.connectionReposytory.create({
      socket_id,
      user_id,
      admin_id,
      id,
    });

    await this.connectionReposytory.save(connection);

    return connection;
  }

  async findByUserId(user_id) {
    const connection = await this.connectionReposytory.findOne({
      user_id,
    });

    return connection;
  }

  async findAllWithoutAdmin() {
    const connections = await this.connectionReposytory.find({
      where: { admin_id: null },
      relations: ["user"],
    });

    return connections;
  }

  async findBySocketId(socket_id) {
    const connection = await this.connectionReposytory.findOne({ socket_id });

    return connection;
  }

  async updateAdminId(user_id: string, admin_id: string) {
    const settings = await this.connectionReposytory
      .createQueryBuilder()
      .update(Connection)
      .set({ admin_id })
      .where("user_id = :user_id", { user_id })
      .execute();

    return settings;
  }
}

export { ConnectionService };
