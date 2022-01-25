
const controller = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/authJwt");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/v1/user/signup", controller.signup);
    app.post("/api/v1/user/login", controller.signin);
    app.post("/api/v1/user/logout", controller.logout);
    app.post("/api/v1/user/logout-all-devices", controller.logoutAllDevices);
    app.get("/api/v1/user/:id", verifyToken, controller.getUserDetails);
    app.patch("/api/v1/user/:id", verifyToken, controller.updateUserDetails);


}