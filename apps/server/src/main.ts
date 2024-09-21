import express from "express";
import helmet from "helmet";

const port = process.env.PORT ?? 4000;

const app = express();
const router = express.Router();

router.get("/", (_, res) => {
  res.json({ message: "ok" });
});

app.use(helmet());
app.use("/api", router);

app.listen(port, () => {
  console.info(`[SERVER]: listening on 0.0.0.0:${port}`);
});
