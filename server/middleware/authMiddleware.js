import jwt from "jsonwebtoken";
import { HttpError } from '../Models/errorModel.js';

const authMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
      if (err) {
        return next(new HttpError("Unauthorized. Invalid token.", 403));
      }

      req.user = info;
      // console.log(req.user)
      // console.log(info)
      next();
    });
  } else {
    return next(new HttpError("Unauthorized. No token.", 403));
  }
};

export default authMiddleware;
