import jwt from "jsonwebtoken";
import {config} from "../config/auth.config.js";
export const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  console.log("token", token, req.headers);

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};
