import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { authRoutes } from "../modules/Auth/auth.route";
import { flatRoutes } from "../modules/Flat/flat.route";
import { bookingRoutes } from "../modules/FlatShareRequest/flatRequest.route";
import { profileRoutes } from "../modules/Profile/profile.route";


const router = express.Router();


const moduleRoutes = [
    { path: '/', route: userRoutes },
    { path: '/', route: flatRoutes },
    { path: '/', route: authRoutes },
    { path: '/', route: bookingRoutes },
    { path: '/', route: profileRoutes },
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;