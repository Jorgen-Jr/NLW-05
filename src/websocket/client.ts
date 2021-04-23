import { Socket } from "socket.io";
import { io } from "../http";
import { ConnectionService } from "../services/ConnectionService";
import { MessageService } from "../services/MessageService";
import { UsersService } from "../services/UsersService";

interface IParams {
  text: string;
  email: string;
}

io.on("connect", (socket: Socket) => {
  const connectionService = new ConnectionService();
  const userService = new UsersService();
  const messageService = new MessageService();

  socket.on("client_first_access", async (params) => {
    const socket_id = socket.id;

    const { email, text } = params as IParams;

    let user_id = null;

    const userExists = await userService.findByEmail(email);

    if (!userExists) {
      const user = await userService.create(email);

      await connectionService.create({
        socket_id,
        user_id: user.id,
      });

      user_id = user.id;
    } else {
      const connection = await connectionService.findByUserId(userExists.id);

      if (connection) {
        connection.socket_id = socket.id;
        await connectionService.create(connection);
      } else {
        await connectionService.create({
          socket_id,
          user_id: userExists.id,
        });
      }
      user_id = userExists.id;
    }

    await messageService.create({
      text,
      user_id,
    });
  });
});
