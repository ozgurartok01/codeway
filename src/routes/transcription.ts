import { Router, Response } from "express";
import { z } from "zod";
import {
  firebaseAuthMiddleware,
  AuthenticatedRequest,
} from "../middlewares/firebaseAuth";
import { schema } from "../utils/transcription";

const router = Router();

router.post(
  "/",
  firebaseAuthMiddleware,
  (req: AuthenticatedRequest, res: Response) => {
    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid request body",
        details: z.treeifyError(validation.error),
      });
    }

    return res.status(204).send();
  },
);

export default router;
