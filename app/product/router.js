import express from "express";
import multer from "multer";
import os from "os";

import productController from "./controller.js";
import { policy_check } from "../../middlewares/index.js";

const router = express();

router.get("/products", productController.index);
router.post(
  "/product",
  multer({ dest: os.tmpdir() }).single("image"),
  policy_check("create", "Product"),
  productController.store
);
router.put(
  "/product/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  policy_check("update", "Product"),
  productController.update
);
router.delete(
  "/product/:id",
  policy_check("delete", "Product"),
  productController.destroy
);

export default router;
