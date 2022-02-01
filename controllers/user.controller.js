
const db = require("../models");
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const User = db.user;


exports.signup = async (req, res) => {

    const user = await User.findOne({
        email: req.body.email,
    });
    if (user) {
        res.status(400).send({ message: 'User already exist' });
        return;
    }
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: req.body.dob,
        mobile: req.body.mobile,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        token: {}
    });

    newUser.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send({ message: "User registered successfully!" });
    });


};

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

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

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
            token: user.token
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
            return res.status(200).send({ message: "You've been signed out successfully!" });
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
            return res.status(200).send({ message: "You've been signed out from all devices successfully!" });
        } else {
            throw new Error("User not found");
        }

    } catch (err) {
        res.status(401);
        return res.status(404).send({ message: "User Not found." });
    }
};

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


        })
    } else {
        return res.status(404).send({ message: "User Not found." });
    }

};

exports.updateUserDetails = async (req, res) => {
    const user = await User.findById(req.userId);
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.dob = req.body.dob;
    user.mobile = req.body.mobile;
    user.email = req.body.email;
    await user.save();
    if (user) {
        res.json({
            isAuth: true,
            id: req.userId,
            fullName: `${user.firstName}  ${user.lastName} `,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            dob: user.dob,
            mobile: user.mobile,

        })
    } else {
        return res.status(404).send({ message: "User Not found." });
    }

};