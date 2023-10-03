import jwt from "jsonwebtoken";
import User from "../app/user/models.js";
import { getToken } from "../utils/index.js";
import config_env from "../app/config.js";

export function decodeToken() {
  return async function (req, res, next) {
    try {
      const token = getToken(req);
      if (!token) return next();
      req.user = jwt.verify(token, config_env.secretkey);
      const user = await User.findOne({ token: { $in: [token] } });
      if (!user)
        return res
          .status(401)
          .json({ errorNumber: 1, message: "token expired" });
    } catch (error) {
      if (error && error.name === "JsonWebTokenError") {
        return res.status(400).json({
          errorNumber: 1,
          message: error.message,
        });
      }
      next(error);
    }
    return next();
  };
}
