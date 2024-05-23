import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
        jwt_access_secret: process.env.JWT_ACCESS_SECRET,
        jwt_expire_in: process.env.EXPIRE_IN,
        jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
        jwt_refresh_expire_in: process.env.REFRESH_EXPIRE_IN,
      
} 