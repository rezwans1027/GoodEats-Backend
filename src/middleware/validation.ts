import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({ errors: errors.array() });
}
    
export const validateMyUserRequest = [
  body("name")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Name must be a string with at least 1 character"),
  body("addressLine1")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Address Line 1 must be a string with at least 1 character"),
  body("country")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Country must be a string with at least 1 character"),
  body("city")
    .isString()
    .isLength({ min: 1 })
    .withMessage("City must be a string with at least 1 character"),
    handleValidationErrors,
];
