import express from "express";
import { body, param } from "express-validator";
import {
  getRestaurant,
  searchRestaurant,
} from "../controllers/RestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City must be a valid string"),
  searchRestaurant
);

router.get(
  "/:restaurantId",
  body("restaurantId").isMongoId().notEmpty(),
  getRestaurant
);

export default router;
