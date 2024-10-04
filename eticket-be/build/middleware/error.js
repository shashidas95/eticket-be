"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const ErrorMiddleware = (err, _, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error.";
    // wrong mongo id error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler_1.default(message, 400);
    }
    // duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)[0]} entered`;
        err = new ErrorHandler_1.default(message, 400);
    }
    // wrong jwt error
    if (err.name === "JsonWebTokenError") {
        const message = `Json web token is invalid, try again`;
        err = new ErrorHandler_1.default(message, 400);
    }
    // jwt expire error
    if (err.name === "TokenExpiredError") {
        const message = `json web token is expired, try again`;
        err = new ErrorHandler_1.default(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
    // Call next to pass the error to the default error handler
    next();
};
exports.default = ErrorMiddleware;
//# sourceMappingURL=error.js.map