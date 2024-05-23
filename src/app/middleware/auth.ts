import { NextFunction, Request, Response } from "express"
import { Secret } from "jsonwebtoken"

import httpStatus from "http-status"
import config from "../config"
import AppError from "../errors/AppError"
import { jwtHelper } from "../helpers/jwtHelpers"

const auth = () => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization

            if (!token) {
                throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access")
            }

            const verifiUser = jwtHelper.verifyToken(token, config.jwt_access_secret as Secret)
            req.user = verifiUser;
            console.log(verifiUser);
            next()
        } catch (err) {
            next(err);
        }
    }
}

export default auth;
