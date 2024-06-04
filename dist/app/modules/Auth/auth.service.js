"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = exports.changePassword = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const emailSender_1 = __importDefault(require("./emailSender"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        }
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password is incorrect");
    }
    const accessToken = jwtHelpers_1.jwtHelper.generateToken({
        id: userData.id,
        name: userData.username,
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt_access_secret, config_1.default.jwt_expire_in);
    const refreshToken = jwtHelpers_1.jwtHelper.generateToken({
        email: userData.email,
    }, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expire_in);
    return {
        id: userData.id,
        name: userData.username,
        email: userData.email,
        role: userData.role,
        token: accessToken,
        refreshToken
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            isActive: client_1.UserStatus.ACTIVATE,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Current password is incorrect");
    }
    const hashPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashPassword
        },
    });
    return {
        message: "Password changed successfully",
    };
});
exports.changePassword = changePassword;
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelpers_1.jwtHelper.verifyToken(token, config_1.default.jwt_refresh_secret);
    }
    catch (err) {
        throw new Error("You are not authorized");
    }
    const isUserExist = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email
        }
    });
    const accessToken = jwtHelpers_1.jwtHelper.generateToken({
        email: isUserExist.email,
        role: isUserExist.role
    }, config_1.default.jwt_access_secret, config_1.default.jwt_expire_in);
    return {
        accessToken
    };
});
const forgetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            isActive: client_1.UserStatus.ACTIVATE
        }
    });
    const resetPasswordToken = jwtHelpers_1.jwtHelper.generateToken({
        email: userData.email, role: userData.role
    }, config_1.default.reset_password_secret, config_1.default.reset_password_token_expire_in);
    const resetPassLink = config_1.default.reset_password_link +
        `?userId=${userData.id}&token=${resetPasswordToken}`;
    yield (0, emailSender_1.default)(userData.email, `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="font-size: 40px">Flat Share</h1>
            </div>
            <p style="font-size: 16px;">Dear ${userData.username},</p>
            <p style="font-size: 16px;">We received a request to reset your password. Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${resetPassLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">Reset Password</a>
            </div>
            <p style="font-size: 16px;">If you did not request a password reset, please ignore this email. This link will expire in 20 minutes for your security.</p>
            <p style="font-size: 16px;">Best regards,</p>
            <p style="font-size: 16px;">The Flat Share Team</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #777;">If you’re having trouble with the button above, copy and paste the following link into your web browser:</p>
            <a href="${resetPassLink}" style="font-size: 12px; color: #4CAF50;">${resetPassLink}</a>
        </div>
        `);
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            isActive: client_1.UserStatus.ACTIVATE
        }
    });
    const isTokenValid = jwtHelpers_1.jwtHelper.verifyToken(token, config_1.default.reset_password_secret);
    console.log(isTokenValid);
    if (!isTokenValid) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not allow to reset password");
    }
    const password = yield bcrypt_1.default.hash(payload.password, 12);
    yield prisma_1.default.user.update({
        where: {
            id: payload.id,
        },
        data: {
            password
        }
    });
    console.log(isTokenValid, "Your password has been reset");
});
exports.AuthServices = {
    loginUser,
    changePassword: exports.changePassword,
    refreshToken,
    forgetPassword,
    resetPassword
};
