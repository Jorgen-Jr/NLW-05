import { Router } from "express";
import { MessageController } from "./controllers/MessageController";
import { SettingsController } from "./controllers/SettingsController";
import { UsersController } from "./controllers/UsersController";

const settingsController = new SettingsController();
const usersController = new UsersController();
const messageController = new MessageController();

const routes = Router();

routes.post("/settings", settingsController.create);
routes.post("/user", usersController.create);
routes.post("/message", messageController.create);
routes.get("/message/:id", messageController.showByUser);

export { routes };
