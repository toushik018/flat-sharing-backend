"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/User/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const flat_route_1 = require("../modules/Flat/flat.route");
const flatRequest_route_1 = require("../modules/FlatShareRequest/flatRequest.route");
const profile_route_1 = require("../modules/Profile/profile.route");
const router = express_1.default.Router();
const moduleRoutes = [
    { path: '/', route: user_route_1.userRoutes },
    { path: '/', route: flat_route_1.flatRoutes },
    { path: '/', route: auth_route_1.authRoutes },
    { path: '/', route: flatRequest_route_1.bookingRoutes },
    { path: '/', route: profile_route_1.profileRoutes },
];
moduleRoutes.forEach(({ path, route }) => router.use(path, route));
exports.default = router;
