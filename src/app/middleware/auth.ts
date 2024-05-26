// import { NextFunction, Request, Response } from "express"
// import { Secret } from "jsonwebtoken"

// import httpStatus from "http-status"
// import config from "../config"
// import AppError from "../errors/AppError"
// import { jwtHelper } from "../helpers/jwtHelpers"

// const auth = (...roles: string[]) => {
//     return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
//         try {
//             const token = req.headers.authorization

//             if (!token) {
//                 throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access")
//             }

//             console.log(token);

//             const verifiUser = jwtHelper.verifyToken(token, config.jwt_access_secret as Secret)
//             req.user = verifiUser;
//             if (roles.length && !roles.includes(verifiUser.role)) {
//                 throw new AppError(httpStatus.FORBIDDEN, "Forbidden")
//             }
//             next()
//         } catch (err) {
//             next(err);
//         }
//     }
// }

// export default auth;


import jwt, { Secret } from 'jsonwebtoken';
import config from '../config';
import { NextFunction, Request, Response } from "express";

const auth = (...roles: string[]) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        (req: Request & { user?: any }, res: Response, next: NextFunction) => {


            const authorizationHeader = req.headers.authorization;


            if (!authorizationHeader) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const tokenParts = authorizationHeader.split(' ');
            const token = (tokenParts.length === 2 && tokenParts[0] === 'Bearer') ? tokenParts[1] : authorizationHeader;

            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            jwt.verify(token, config.jwt_access_secret as Secret, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: 'Invalid token' });
                }

                req.user = decoded;
                if (roles.length && !roles.includes(req.user.role)) {
                    return res.status(403).json({ message: 'Forbidden' });
                }

                next();
            });
        },
    ];
};

export default auth;
