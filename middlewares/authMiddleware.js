const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const JWT_SECRET = "your_super_secret_jwt_key_change_this_in_production";

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if(req?.headers?.authorization?.startsWith("Bearer")){
        token = req.headers.authorization.split(' ')[1];
        try{
            if(token) {
                const decode = jwt.verify(token, JWT_SECRET);
                const user = await User.findById(decode?.id);
                req.user =user;
                next();
            }
        }catch(error){
            throw new Error("Not Authorized token expired, Please Login agin");
        }
    }else{
        throw new Error("There is no token attached to header");
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if(adminUser.role !== "admin") {
        throw new Error("You are not an admin");
    }else{
        next();
    }
})
module.exports = { authMiddleware, isAdmin };