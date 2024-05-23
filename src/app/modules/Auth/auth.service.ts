import { Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import bcrypt from "bcrypt"
import { jwtHelper } from "../../helpers/jwtHelpers";
import config from "../../config";

const loginUser = async (payload: {
    email: string,
    password: string
}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        } as Prisma.UserWhereUniqueInput
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password is incorrect")
    }

    const accessToken = jwtHelper.generateToken({
        id: userData.id,
        name: userData.username,
        email: userData.email,
    },
        config.jwt_access_secret as string,
        config.jwt_expire_in as string

    )

    const refreshToken = jwtHelper.generateToken({
        email: userData.email,
    },
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expire_in as string
    );

    return {
        id: userData.id,
        name: userData.username,
        email: userData.email,
        token: accessToken,
        refreshToken
    };


}


export const AuthServices = {
    loginUser
}