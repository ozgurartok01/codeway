import express from "express";
import transcriptionsRouter from "./routes/transcription";

const app = express();

app.use(express.json());

app.use("/v1/transcriptions", transcriptionsRouter);

export default app;
