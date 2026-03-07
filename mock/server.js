const express = require("express");
const app = express();

app.get("/v1/config/:uid", (req, res) => {
  res.json({
    whisper_version: "tiny",
    updated_at: new Date().toISOString(),
  });
});

app.listen(4000, () => {
  console.log("Config service running on port 4000");
});
