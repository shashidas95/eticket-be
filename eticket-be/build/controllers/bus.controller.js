"use strict";
// export const getRoutes = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//     } catch (err: any) {
//       return next(new ErrorHandler(err.message, 400));
//     }
//   }
// );
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
exports.getBuses = exports.deleteBus = exports.updateBus = exports.toggleBusIsAvailableForTrip = exports.createBus = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const bus_model_1 = __importDefault(require("../models/bus.model"));
const trip_model_1 = __importDefault(require("../models/trip.model"));
exports.createBus = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { busName, busType, numberOfSeat } = req.body;
        const createdBus = yield bus_model_1.default.create({
            busName,
            busType,
            numberOfSeat,
        });
        return res.status(201).json({ success: true, createdBus });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
exports.toggleBusIsAvailableForTrip = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { busId } = req.params;
        const getBus = yield bus_model_1.default.findOne({ _id: busId });
        if (!getBus)
            return res
                .status(400)
                .json({ success: false, message: "Bus not found" });
        // if bus is in trip, we should cancel the trip
        const tripDoc = yield trip_model_1.default.findOne({ busId });
        if (tripDoc) {
            return res.status(400).json({
                success: false,
                message: "Cannot possible toggle while bus is in trip",
            });
        }
        getBus.isAvailableForTrip = !getBus.isAvailableForTrip;
        getBus.save();
        return res.status(200).json({ success: true, message: "Success" });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
exports.updateBus = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { busName, busType, numberOfSeat } = req.body;
        const { busId } = req.params;
        const getBus = yield bus_model_1.default.findOne({ _id: busId });
        if (!getBus)
            return res
                .status(400)
                .json({ success: false, message: "Bus not found" });
        getBus.busName = busName;
        getBus.busType = busType;
        getBus.numberOfSeat = numberOfSeat;
        getBus.save();
        return res
            .status(200)
            .json({ success: true, message: "successfully updated" });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
exports.deleteBus = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { busId } = req.params;
        const getBus = yield bus_model_1.default.findOne({ _id: busId });
        if (!getBus)
            return res
                .status(400)
                .json({ success: false, message: "Bus not found" });
        //if bus is in trip
        const getTrip = yield trip_model_1.default.findOne({ busId });
        if (!!getTrip)
            return res
                .status(400)
                .json({ success: false, message: "Bus is already in trip" });
        yield bus_model_1.default.findOneAndDelete({ _id: busId });
        return res
            .status(200)
            .json({ success: false, message: "Successfully deleted" });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
exports.getBuses = (0, catchAsyncErrors_1.CatchAsyncError)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getBuses = yield bus_model_1.default.find();
        return res.status(200).json({ success: true, getBuses });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
//# sourceMappingURL=bus.controller.js.map