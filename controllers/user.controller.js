const db = require("../models");
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const User = db.user;
/**
 * @swagger
 * components:
 *   schemas:
 *     NewUser:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: firstName.
 *           example: Priydarshini
 *         lastName:
 *           type: string
 *           description: The lastName.
 *           example:  Puja
 *         dob:
 *           type: date
 *           description: DOB .
 *           example:  1994-12-28T18:30:00.000+00:00
 *         email:
 *            type: string
 *            description: email .
 *            example:  test@gmail.com
 *         mobile:
 *           type: string
 *           description: mobile
 *           example:  2212192121
 *         password:
 *           type: string
 *           description: password
 *           example:  221212121
 *     User:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: firstName.
 *           example: Priydarshini
 *         lastName:
 *           type: string
 *           description: The lastName.
 *           example:  Puja
 *         dob:
 *           type: date
 *           description: DOB .
 *           example:  1994-12-28T18:30:00.000+00:00
 *         email:
 *            type: string
 *            description: email .
 *            example: test@gmail.com
 *         mobile:
 *           type: string
 *           description: mobile
 *           example:  2212121821
 *         id:
 *           type: integer
 *           description: id
 *           example: 62020a1e8076597bac35e05a,
 *         token:
 *            type: string
 *            description: token
 *            example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMDIwYTFlODA3NjU5N2JhYzM1ZTA1YSIsImlhdCI6MTY0NDMzNDA0NywiZXhwIjoxNjQ0NDIwNDQ3fQ._RuBs6hiWe0JPIPujjnlLiS-2SLwJ50I3jKNKYVlyXA
 */

/**
 * @swagger
 * /api/v1/user/signup:
 *  post:
 *      summary: Api to register user
 *      description: Take  firstName , lastName ,email , password , dob and mobile etc
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *      responses:
 *         201:
 *              description: User registered successfully
 */
exports.signup = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (user) {
    res.status(400).send({ message: "User already exist" });
    return;
  }
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dob: req.body.dob,
    mobile: req.body.mobile,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    token: {},
  });

  newUser.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "User registered successfully!" });
  });
};
/**
 * @swagger
 * /api/v1/user/login:
 *  post:
 *      summary: Api to login user
 *      description: Take email and password etc
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  description: email
 *                  example: test@gmail.com
 *                password:
 *                  type: string
 *                  description: password.
 *                  example:  221212121,
 *      responses:
 *         200:
 *             description: User loggedin successfully
 *             content:
 *               application/json:
 *                 schema:
 *                   $ref: '#/components/schemas/User'
 */

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" });
    }
    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });
    user.token = [...user.token, { token }];
    user.save();
    res.status(200).send({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob,
      mobile: user.mobile,
      email: user.email,
      token: token,
    });
  });
};

exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user) {
      const requestToken = req.headers.token;
      const existingToken = user.token.find((e) => e.token === requestToken);
      await user.token.remove(existingToken._id);
      await user.save();
      return res
        .status(200)
        .send({ message: "You've been signed out successfully!" });
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    res.status(401);
    return res.status(404).send({ message: "User Not found." });
  }
};

exports.logoutAllDevices = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user) {
      user.token = [];
      await user.save();
      return res.status(200).send({
        message: "You've been signed out from all devices successfully!",
      });
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    res.status(401);
    return res.status(404).send({ message: "User Not found." });
  }
};

/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     summary: Retrieve particular user detail
 *     description: Can be used to populate a details of  user when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: string
 */
exports.getUserDetails = async (req, res) => {
  const user = await User.findById(req.userId);
  if (user) {
    res.json({
      isAuth: true,
      id: req.userId,
      fullName: user.firstName + user.lastName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dob: user.dob,
      mobile: user.mobile,
    });
  } else {
    return res.status(404).send({ message: "User Not found." });
  }
};
/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     summary: Retrieve particular user detail
 *     description: Can be used to populate a details of  user when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: string
 */
exports.updateUserDetails = async (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then((user) => res.json(user))
    .catch((err) => res.status(404).send({ message: "User Not found." }));
};
