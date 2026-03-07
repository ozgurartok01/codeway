import { Router, Response } from "express";
import {
  firebaseAuthMiddleware as middleware,
  AuthenticatedRequest as authReq,
} from "../middlewares/firebaseAuth";
import { remove } from "../services/user";

const router = Router();

router.delete("/me", middleware, async (req: authReq, res: Response) => {
  const uid = req.user!.uid;

  const result = await remove(uid);

  return res.json({
    message: "User data deleted successfully",
    deleted: {
      transcriptions: result.deletedTranscriptions,
    },
  });
});

export default router;
