import ApiError from "../../common/utils/api-error.js"
import { verifyAccessToken } from "../../common/utils/jwt.utils.js"

import user from "./auth.model.js";

const authenticate = async (req, res, next) => {
    let token;

    if(req.headers.authorization?.startWith("Bearer ")){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token) {
        throw ApiError.unauthorized("Not authenticated");
    }

    const decoded = verifyAcceessToken(token);

    const user = await User.findById(decoded.id);

    if(!user) {
        throw ApiError.unauthorized("User no longer exists");
    }

    req.user = {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
    };
    next();
}

const authorize = (...roles) => {
    return (req,res, next) => {
        if(!roles.includes(req.user.role)){
            throw ApiError.forbidden("you do not permission to perform this action");
        }

        next();
    };

};

export {authenticate, authorize}