import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { port } from "./config";
import router from "./routers";

import helmet from "helmet";

const app = express();
const baseUri = "/api/v1";

app.use(helmet());
app.use(express.json());
app.use(bodyParser.json({}));
app.use(cors());

app.use(baseUri, router);

app.listen(port, () => {
  console.log(`
  ################################################
      🛡️  Server listening on port: ${port} 🛡️
  ################################################
  `);
});

app.use((req: any, res: any, next: any) => {
  const err = new Error("API not found");
  return next(err);
});
