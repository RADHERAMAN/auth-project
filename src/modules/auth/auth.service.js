import crypto from "crypto";

import ApiError from "../../common/utils/api-error.js"

import{
    genrateAccessToken,
    generateRefreshToken,
    generateResetToken,
    verifyAccessToken,
    verifyRefreshToken,
    generateAccessToken
} from "../../common/utils/jwt.utils.js"

import User from "auth.model.js"

const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
}

//Register
const register = async ({name, email, password, role}) => {
    const existing = await User.findOne({email})

    if(existing){
        throw ApiError.conflict("Email already exists")

    }

    const{rawToken, hashedToken} = generateResetToken();

    const user = await User.create({
        name, email, password,
        role,
        verificationToken: hashedToken,
        
    });

    // Later we will send rawToken Through email.

    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.verificationToken;

    return userObj;
};

// Login

const login = async ({email, password}) => {
    const user = await User.findOne({email}).select("+password");

    if(!user){
        throw ApiError.unauthorized("Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        throw ApiError.unauthorized("Invalid email or password");
    }

    if(!user.isVerified){
        throw ApiError.forbidden("please verify your email before logging in")
    }
    const accessToken = generateAccessToken({
        id: user._id,
        role: user._role
    });
    const refreshToken = generateRefreshToken({
        id: user._id,
    })
    user.refreshToken = hashToken(refreshToken);


    await user.save({validateBeforeSave: false});

    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.refreshToken;

    return {
        user: userObj,
        accessToken,
        refreshToken
    };
};

//Refresh Access token
const refresh = async (token) => {
    if(!token) {
        throw ApiError.unauthorized("Refresh token missing");
    }

    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id).select("+refreshToken");

    if(!user) {
        throw ApiError.unauthorized("user Not found")
    }
    const hashedToken = hashToken(token);
    if(user.refreshToken !== hashToken){
        throw ApiError.unauthorized("Invalid refresh token");
    }

    const accessToken = generateAccessToken({
        id: user._id,
        role: user.role,
    });
    return { acceessToken };

}

//LOGOUT

const logout = async (userId) => {
    await User.findByIdAndUpdate(userId, {
        refreshToken: null,
    });
};

//VERIFY EMAIL

const verifyEmail = async (token) => {
    const hashedToken = hashToken(token);

    const user = await User.findOne({
        verificationToken : hashedToken,
    }).select("+verificationToken");
    if(!user) {
        throw ApiError.badRequest("Invalid verification token");
    }
    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();
    return user;
}

// Get current user

const getMe = async (userId) => {
    const user = await User.findById(userId);

    if(!user) {
        throw ApiError.notFound("user Not found");
    }
    return user;
};

export {
    register,
    login,
    refresh,
    logout,
    getMe, 
    verifyEmail
};