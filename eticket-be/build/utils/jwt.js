"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = exports.refreshTokenExpire = exports.accessTokenExpire = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
// parse environment variable integrate with fallback value
exports.accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
exports.refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);
//options for cookies
exports.accessTokenOptions = {
    expires: new Date(Date.now() + exports.accessTokenExpire * 60 * 60 * 1000),
    maxAge: exports.accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
};
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + exports.refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: exports.refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
};
const sendToken = (user, statusCode, res) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN || "", { expiresIn: "5m" });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN || "", { expiresIn: "3d" });
    //only set secure to true in production
    if (process.env.NODE_ENV === "production") {
        exports.accessTokenOptions.secure = true;
    }
    return res
        .cookie("access_token", accessToken, exports.accessTokenOptions)
        .cookie("refresh_token", refreshToken, exports.refreshTokenOptions)
        .status(statusCode)
        .json({
        success: true,
        user,
        accessToken,
    });
};
exports.sendToken = sendToken;
//# sourceMappingURL=jwt.js.map