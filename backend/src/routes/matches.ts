import { Router } from "express";

const matchesRouter = Router();

matchesRouter.get("/", (_req, res) => {
  res.json({ message: "Matches endpoint" });
});

export default matchesRouter;