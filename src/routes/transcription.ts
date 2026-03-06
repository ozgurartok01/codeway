import { Router, Request, Response } from "express";

const transcriptionsRouter = Router();

transcriptionsRouter.post("/", (_req: Request, res: Response) => {
  return res.status(204).send();
});

export default transcriptionsRouter;
