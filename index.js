import express from "express";
import predictHandler from "./api/predict.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/api/predict", predictHandler);

app.listen(port, () => {
  console.log(`✅ Servern körs på http://localhost:${port}`);
});
