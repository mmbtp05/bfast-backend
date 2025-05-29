import { Request, Response, NextFunction } from "express"
import { UnauthorizedError } from "../utils/customErrors";

export const isAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ");

  if (!token) {
    throw new UnauthorizedError("Auth token not provided.")
  }
  try {
    const decoded = jwt.verify(token[1], process.env.TOKEN_KEY);
    delete decoded.user.password;
    req.user_details = decoded;
    req.user_id = decoded.user._id;
    next();
  } catch (error) {
    logger.error(error.name);
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json(customError("Token has expired. Please log in again."));
    } else if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json(customError("Unauthorized"));
    } else {
      next();
    }
  }
}