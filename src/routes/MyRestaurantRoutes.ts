import express from "express";
import multer from "multer";
import {
  createMyRestaurant,
  getMyRestaurant,
  getMyRestaurantOrders,
  updateMyRestaurant,
  updateOrderStatus,
} from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 5 } });

router.get("/", jwtCheck, jwtParse, getMyRestaurant);

router.get("/order", jwtCheck, jwtParse, getMyRestaurantOrders);

router.patch("/order/:orderId/status", jwtCheck, jwtParse, updateOrderStatus);

router.post(
  "/",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  createMyRestaurant
);

router.put(
  "/",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  updateMyRestaurant
);

export default router;
