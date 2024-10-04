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
exports.changePassword = exports.updateUserInfo = exports.socialAuth = exports.getUserInfo = exports.updateAccessToken = exports.logoutUser = exports.loginUser = exports.activateUser = exports.registrationUser = exports.createActivationToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const sendmail_1 = __importDefault(require("../utils/sendmail"));
const jwt_1 = require("../utils/jwt");
const user_services_1 = require("../services/user.services");
dotenv_1.default.config();
const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({ user, activationCode }, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
    return { token, activationCode };
};
exports.createActivationToken = createActivationToken;
exports.registrationUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, password } = req.body;
        const isEmailExist = yield user_model_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler_1.default("Email already exist", 400));
        }
        const user = {
            name,
            email,
            password,
        };
        const activationToken = (0, exports.createActivationToken)(user);
        const activationCode = activationToken.activationCode;
        const data = {
            username: user.name,
            activationCode,
        };
        yield (0, sendmail_1.default)({
            email: user.email,
            subject: "Activation code",
            template: "activation-email.ejs",
            data,
        });
        res.status(200).json({
            success: true,
            message: "Please check your email for active your email",
            activationToken: activationToken.token,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 404));
    }
}));
exports.activateUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { activationCode, activationToken } = req.body;
        const newUser = jsonwebtoken_1.default.verify(activationToken, process.env.ACTIVATION_SECRET);
        if (newUser.activationCode !== activationCode) {
            return next(new ErrorHandler_1.default("Invalid Activation Code", 400));
        }
        const { name, email, password } = newUser.user;
        const isExistUser = yield user_model_1.default.findOne({ email });
        if (isExistUser) {
            return new ErrorHandler_1.default("User already exist.", 400);
        }
        const user = yield user_model_1.default.create({
            name,
            email,
            password,
        });
        res.status(200).json({ success: true, user });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
exports.loginUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        //will add yup validator later
        if (!email || !password) {
            return next(new ErrorHandler_1.default("Please input email or password", 400));
        }
        const user = yield user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler_1.default("Invalid email or password", 400));
        }
        // const isPasswordMatch = await user.comparePassword(password);
        // if (!isPasswordMatch) {
        //   return next(new ErrorHandler("Invalid email or password", 400));
        // }
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
//logout user
exports.logoutUser = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => {
    res.cookie("access-token", "", { maxAge: 1 });
    res.cookie("refresh-token", "", { maxAge: 1 });
    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
    try {
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//regenerate access token
exports.updateAccessToken = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refresh_token;
        const decode = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN);
        if (!decode) {
            return next(new ErrorHandler_1.default("Invalid refresh token", 400));
        }
        // const session = await redis.get(decode.id as string);
        const session = "";
        if (!session) {
            return next(new ErrorHandler_1.default("User not found", 400));
        }
        const user = JSON.parse(session);
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
            expiresIn: "5m",
        });
        const newRefreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
            expiresIn: "3d",
        });
        req.user = user;
        res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
        res.cookie("refresh_token", newRefreshToken, jwt_1.refreshTokenOptions);
        res.status(200).json({
            success: true,
            accessToken,
        });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
//get user info
exports.getUserInfo = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        (0, user_services_1.getUserById)(userId, res);
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
// social auth
// tested ok
exports.socialAuth = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, avatar } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            const newUser = yield user_model_1.default.create({
                email,
                name,
                avatar,
            });
            (0, jwt_1.sendToken)(newUser, 200, res);
        }
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
// update user info
exports.updateUserInfo = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { email, name } = req.body;
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
        const user = user_model_1.default.findById(userId);
        if (email && user) {
            const isEmailExist = yield user_model_1.default.findOne({ email });
            if (isEmailExist) {
                return next(new ErrorHandler_1.default("Email already exist", 400));
            }
            user.email = email;
        }
        if (name && user) {
            user.name = name;
        }
        user === null || user === void 0 ? void 0 : user.save();
        res.status(201).json({
            success: "true",
            user,
        });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
// change password
exports.changePassword = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { oldPassword, newPassword } = req.body;
    const email = (_c = req.user) === null || _c === void 0 ? void 0 : _c.email;
    const user = yield user_model_1.default.findOne({ email }).select("password");
    const isOldPasswordIsValid = yield bcryptjs_1.default.compare(oldPassword, (user === null || user === void 0 ? void 0 : user.password) || "");
    if (isOldPasswordIsValid) {
        const generateNewHashPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        yield user_model_1.default.findOneAndUpdate({ email }, { $set: { password: generateNewHashPassword } });
        return res.status(201).json({
            success: true,
            message: "Password changed successfully.",
        });
    }
    else {
        return next(new ErrorHandler_1.default("Current password is wrong", 400));
    }
}));
//# sourceMappingURL=user.controllers.js.map