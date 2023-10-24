import { Router } from "express";
import {
  saveNewPageContent,
  getAllPages,
  deletePageById,
  updatePageContent,
} from "../controllers/pages.controller.js";
import { isLoggedIn } from "../config/configs.js";

const router = Router();

router.post("/add", isLoggedIn, saveNewPageContent);
router.get("/all", getAllPages);
router.delete("/:id", deletePageById);
router.put("/:id", updatePageContent);

export { router };
