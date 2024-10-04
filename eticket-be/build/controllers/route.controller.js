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
exports.getAllRoutes = exports.getRoute = exports.getRoutes = exports.deleteRoute = exports.updateRoute = exports.createRoute = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const routeLocatoin_mode_1 = __importDefault(require("../models/routeLocatoin.mode"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const trip_model_1 = __importDefault(require("../models/trip.model"));
exports.createRoute = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        //chk is route is already avaiable
        const getRoute = yield routeLocatoin_mode_1.default.findOne({
            locationName: name.toLocaleLowerCase(),
        });
        if (getRoute) {
            return res
                .status(400)
                .json({ success: false, message: "Route already available" });
        }
        yield routeLocatoin_mode_1.default.create({
            locationName: name.toLocaleLowerCase(),
        });
        const routeDoc = yield routeLocatoin_mode_1.default.find();
        return res.status(201).json({ success: true, response: routeDoc });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
exports.updateRoute = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { routeId, updatedName } = req.body;
        //is available the route
        const routeDoc = yield routeLocatoin_mode_1.default.findOne({ _id: routeId });
        if (!routeDoc) {
            return res
                .status(400)
                .json({ success: false, message: "Route not found" });
        }
        routeDoc.locationName = updatedName;
        yield routeDoc.save();
        const newRouteDoc = yield routeLocatoin_mode_1.default.find();
        return res.status(200).json({ success: true, response: newRouteDoc });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
exports.deleteRoute = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { routeId } = req.params;
        // is this route is available
        const getRoute = yield routeLocatoin_mode_1.default.findOne({ _id: routeId });
        if (!getRoute) {
            return res
                .status(400)
                .json({ success: false, message: "Route not found" });
        }
        // is this route is selected for trip
        const tripDoc = yield trip_model_1.default.findOne({
            $or: [{ from: routeId }, { to: routeId }],
        });
        if (tripDoc)
            return res.status(400).json({
                success: false,
                message: "This location is already is in used for trip",
            });
        // delete the route
        yield routeLocatoin_mode_1.default.deleteOne({ _id: routeId });
        const newRouteDoc = yield routeLocatoin_mode_1.default.find();
        return res.status(200).json({
            success: true,
            response: newRouteDoc,
        });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
exports.getRoutes = (0, catchAsyncErrors_1.CatchAsyncError)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getRoutes = yield routeLocatoin_mode_1.default.find();
        res.status(200).json({ success: true, getRoutes });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
exports.getRoute = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { routeName } = req.params;
        if (routeName === "undefined") {
            const getAllRoutes = yield routeLocatoin_mode_1.default.find();
            return res.status(200).json({ success: true, response: getAllRoutes });
        }
        const getRoutes = yield routeLocatoin_mode_1.default.find({
            locationName: { $regex: routeName, $options: "i" },
        });
        return res.status(200).json({ success: true, response: getRoutes });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
exports.getAllRoutes = (0, catchAsyncErrors_1.CatchAsyncError)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const routesDoc = yield routeLocatoin_mode_1.default.find();
        return res.status(200).json({ success: true, response: routesDoc });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
//# sourceMappingURL=route.controller.js.map