import express, { Request, Response } from "express";
import serverless from "serverless-http";
import { Update } from "./model/Update";

const app = express();
app.use(express.json());

app.post("/messages", (req: Request, res: Response) => {

  const updateParse = Update.safeParse(req.body);

  if (!updateParse.success) {
    console.log("Invalid telegram Update:", req.body)
    console.error("Error:", updateParse.error.issues)
    res.status(400).json(updateParse.error.issues);
  } else {
    const update: Update = updateParse.data;
    
    res.status(200).json(req.body);
  }

});

app.get("/hello", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello from path!" });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

export const handler = serverless(app);
