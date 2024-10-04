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
exports.authRoles = exports.isAuthenticated = void 0;
const catchAsyncErrors_1 = require("./catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
//authenticate user
exports.isAuthenticated = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        return next(new ErrorHandler_1.default("User is not authenticated", 400));
    }
    const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN);
    if (!decoded) {
        return next(new ErrorHandler_1.default("Access token is not valid", 400));
    }
    const user = "";
    if (!user) {
        return next(new ErrorHandler_1.default("User not found", 400));
    }
    req.user = JSON.parse(user);
    next();
}));
//authenticate user role
const authRoles = (...roles) => {
    return (req, res, next) => {
        var _a, _b;
        if (!roles.includes(((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || "")) {
            return next(new ErrorHandler_1.default(`Role:${(_b = req.user) === null || _b === void 0 ? void 0 : _b.role} is not allowed to access this content`, 400));
        }
        next();
    };
};
exports.authRoles = authRoles;
//# sourceMappingURL=auth.js.map