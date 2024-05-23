import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";

type UserCreateInput = {
    username: string;
    email: string;
    password: string;
    profilePhoto?: string;
    contactNumber?: string;
};

type AdminCreateInput = {
    username: string;
    email: string;
    password: string;
    profilePhoto?: string;
};


const createUser = async (payload: UserCreateInput) => {
    const { username, email, password, profilePhoto, contactNumber } = payload;

    const hashPassword: string = await bcrypt.hash(password, 12);

    const userData = {
        username,
        email,
        password: hashPassword,
        profilePhoto,
        contactNumber,
    };

    const result = await prisma.$transaction(async (transactionClient) => {
        const createdUserData = await transactionClient.user.create({
            data: userData,
        });

        const { password, ...user } = createdUserData;
        return user;
    });

    return result;
};


// const createAdmin = async (payload: AdminCreateInput) => {
//     const { username, email, password, profilePhoto } = payload;

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create the admin
//     const createdAdmin = await prisma.admin.create({
//         data: {
//             username: username,
//             email: email,
//             password: hashedPassword,
//             profilePhoto: profilePhoto,
//             user: {
//                 connect: {
//                     email: email
//                 }
//             }
//         }
//     });

//     return createdAdmin;
// };


export const UserServices = {
    createUser,
};
