const controller = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/authJwt");
const {
  userValidationRules,
  loginValidationRules,
  validate,
} = require("../validators/user-validators");

module.exports = function (app) {
  app.post(
    "/api/v1/user/signup",
    userValidationRules(),
    validate,
    controller.signup
  );
  app.post(
    "/api/v1/user/login",
    loginValidationRules(),
    validate,
    controller.signin
  );
  app.post("/api/v1/user/logout", verifyToken, controller.logout);
  app.post(
    "/api/v1/user/logout-all-devices",
    verifyToken,
    controller.logoutAllDevices
  );
  app.get("/api/v1/user/:id", verifyToken, controller.getUserDetails);
  app.patch(
    "/api/v1/user/:id",
    verifyToken,
    userValidationRules(),
    validate,
    controller.updateUserDetails
  );
};
