import { Router, Response } from "express";
import { z } from "zod";
import {
  firebaseAuthMiddleware as middleware,
  AuthenticatedRequest as authReq,
} from "../middlewares/firebaseAuth";
import { schema } from "../utils/transcription";
import { create, get, getAll, remove } from "../services/transcription";

const router = Router();

router.post("/", middleware, async (req: authReq, res: Response) => {
  const validation = schema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: "Invalid request body",
      details: z.treeifyError(validation.error),
    });
  }

  const transcriptions = await create(req.user!.uid, validation.data.urls);

  return res.status(201).json({
    transcriptions,
  });
});

router.get("/", middleware, async (req: authReq, res: Response) => {
  const uid = req.user!.uid;

  const limit = parseInt(req.query.limit as string) || 10;
  const cursor = req.query.cursor as string | undefined;

  const result = await getAll(uid, limit, cursor);

  return res.json(result);
});

router.get("/:id", middleware, async (req: authReq, res: Response) => {
  const transcription = await get(req.user!.uid, req.params.id as string);

  if (!transcription) {
    return res.status(404).json({
      error: "Transcription not found",
    });
  }

  return res.json(transcription);
});

router.delete("/:id", middleware, async (req: authReq, res: Response) => {
  const deleted = await remove(req.user!.uid, req.params.id as string);

  if (!deleted) {
    return res.status(404).json({
      error: "Transcription not found",
    });
  }

  return res.json({
    message: "Transcription deleted successfully",
  });
});

export default router;
