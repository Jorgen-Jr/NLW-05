import { Request, Response } from "express";
import { MessageService } from "../services/MessageService";

class MessageController {
  async create(req: Request, res: Response): Promise<Response> {
    const { admin_id, user_id, text } = req.body;

    const messageService = new MessageService();

    const message = await messageService.create({ admin_id, user_id, text });

    return res.json(message);
  }

  async showByUser(req: Request, res: Response) {
    const { id } = req.params;

    const messageService = new MessageService();

    const list = await messageService.listByUser(id);

    return res.json(list);
  }
}

export { MessageController };
