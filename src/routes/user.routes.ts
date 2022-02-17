import { Application } from "express";

import {signin, signup, logout, logoutAllDevices, getUserDetails, updateUserDetails} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/authJwt";
import { userValidationRules, updateUserValidationRules, loginValidationRules, validate } from "../validators/user-validators";

export const userRoutes  = (app:Application) =>{
  app.post(
    "/signup",
    userValidationRules(),
    validate,
   signup
  );
  app.post(
    "/login",
    loginValidationRules(),
    validate,
  signin
  );
  app.post("/logout", verifyToken,logout);
  app.post(
    "/logout-all-devices",
    verifyToken,
 logoutAllDevices
  );
  app.get("/:id", verifyToken,getUserDetails);
  app.patch(
    "/:id",
    verifyToken,
    updateUserValidationRules(),
    validate,
    updateUserDetails
  );
};
