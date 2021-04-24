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

    const allMessages = await messageService.listByUser(user_id);

    socket.emit("client_list_all_messages", allMessages);

    const allUsers = await connectionService.findAllWithoutAdmin();

    io.emit("admin_list_all_users", allUsers);
  });

  socket.on("client_send_to_admin", async (params) => {
    const { text, socket_admin_id } = params;

    const socket_id = socket.id;

    const { user_id } = await connectionService.findBySocketId(socket.id);

    const message = await messageService.create({
      text,
      user_id,
    });

    console.log("okok");
    io.to(socket_admin_id).emit("admin_receive_message", {
      message,
      socket_id,
    });
  });
});
