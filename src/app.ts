import express from "express";
import transcriptionsRouter from "./routes/transcription";
import usersRouter from "./routes/user";

const app = express();

app.use(express.json());

app.use("/v1/transcriptions", transcriptionsRouter);

app.use("/v1/users", usersRouter);

export default app;
