import * as authServise from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const register = async (requestAnimationFrame, res) => {
    const user = await authServise.register(req.body);

    ApiResponse.created(res, "Registration successfull", user);
};

const login = async (req, res) => {
     const {user, access, refreshToken } = await authService.login(req.body);
     res.cookie("refreshToken", resfreshToken, {
        httpOnly : true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7*24*60*60*1000,
     });

     ApiResponse.ok(res, "Login Successful", {
        user,
        accessToken,
     });
};

const logout = async (req, res) => {
    await authServise.logout(req.user.id);

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite : 'strict',
    });
    ApiResponse.ok (res, "Logout Successful");
}

const getMe = async (req, res) => {
    const user = await authServise.getMe(req.user.id);
    
    ApiResponse.ok(res, "User Profile", user);
};

const verifyEmail = async (req, res) => {
    const user = await authServise.verifyEmail(req.params.token);

    ApiResponse.ok(req, "Email verified Successfully", user);
};

export{
    register,
    login,
    logout,
    getMe,
    verifyEmail
}