import express from "express";
import multer from "multer";
import os from "os";

import positionsController from "./controller.js";

const router = express();

router.get("/positions", positionsController.index);
router.get("/positions/:id", positionsController.detail);
router.post(
  "/positions",
  multer({ dest: os.tmpdir() }).single("company_logo"),
  positionsController.store
);
router.put(
  "/positions/:id",
  multer({ dest: os.tmpdir() }).single("company_logo"),
  positionsController.update
);
router.delete("/positions/:id", positionsController.destroy);

export default router;
