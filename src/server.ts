import express, { Request, Response } from "express";

const app = express();

app.use(express.json({ limit: "50mb" }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "I am working hooman", time: new Date() });
});

app.post("/", (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  res.status(200).json({ message: "Let's go!", name, email, password });
});

app.listen(3333, () => console.log("Server is running at port 3333"));
