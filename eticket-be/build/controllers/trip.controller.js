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
exports.passengerTripCancel = exports.confirmTrip = exports.getTrips = exports.getAllTrips = exports.deleteTrip = exports.getPassengers = exports.bookSeat = exports.updateTrip = exports.createTrip = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const trip_model_1 = __importDefault(require("../models/trip.model"));
const bus_model_1 = __importDefault(require("../models/bus.model"));
const routeLocatoin_mode_1 = __importDefault(require("../models/routeLocatoin.mode"));
const sendmail_1 = __importDefault(require("../utils/sendmail"));
const dayjs_1 = __importDefault(require("dayjs"));
exports.createTrip = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { busId, fromId, toId, departure_time, price } = req.body;
        // check is bus is free for trip and is fit
        const selectedBusInfo = yield bus_model_1.default.findOne({
            _id: busId,
        });
        if (!selectedBusInfo)
            return res
                .status(400)
                .json({ success: false, message: "Bus not found" });
        if (!selectedBusInfo.isAvailableForTrip)
            return res
                .status(400)
                .json({ success: false, message: "Bus is not fit" });
        if (selectedBusInfo.isTripBooked)
            return res
                .status(400)
                .json({ success: false, message: "Bus is already booked for trip" });
        // check from  and to is available
        const getFrom = yield routeLocatoin_mode_1.default.findOne({ _id: fromId });
        const getTo = yield routeLocatoin_mode_1.default.findOne({ _id: toId });
        if (!getFrom || !getTo) {
            return res
                .status(400)
                .json({ success: false, message: "Route not found" });
        }
        const createTrip = yield trip_model_1.default.create({
            busId,
            fromId,
            toId,
            busName: selectedBusInfo.busName,
            from: getFrom.locationName,
            to: getTo.locationName,
            busType: selectedBusInfo.busType,
            numberOfSeat: selectedBusInfo.numberOfSeat,
            price,
            departure_time,
        });
        yield bus_model_1.default.findByIdAndUpdate({ _id: busId }, { $set: { isTripBooked: true } });
        res.status(201).json({ success: true, createTrip });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
// change bus
exports.updateTrip = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { busId: newBusId, fromId, toId, departure_time, price } = req.body;
        const { tripId } = req.params;
        //is trip id is available
        const getTrip = yield trip_model_1.default.findOne({ _id: tripId });
        if (!getTrip)
            return res
                .status(400)
                .json({ success: false, message: "Trip not found" });
        if (getTrip.busId !== newBusId && newBusId) {
            const selectedOldBusInfo = yield bus_model_1.default.findOne({
                _id: getTrip.busId,
            });
            if (!selectedOldBusInfo)
                return res
                    .status(400)
                    .json({ success: false, message: "Bus not found" });
            const selectedNewBusInfo = yield bus_model_1.default.findOne({
                _id: newBusId,
            });
            if (!selectedNewBusInfo)
                return res
                    .status(400)
                    .json({ success: false, message: "New bus not found" });
            if (!selectedNewBusInfo.isAvailableForTrip)
                return res
                    .status(400)
                    .json({ success: false, message: "New bus is not fit" });
            if (selectedNewBusInfo.isTripBooked)
                return res.status(400).json({
                    success: false,
                    message: "New bus is already booked for trip",
                });
            getTrip.busName = selectedNewBusInfo.busName;
        }
        //is route id is available
        if (fromId && fromId !== getTrip.fromId) {
            const fromDoc = yield routeLocatoin_mode_1.default.findOne({ _id: fromId });
            if (!fromDoc) {
                return res.status(400).json({
                    success: false,
                    message: "Source Location not in database.",
                });
            }
            else {
                getTrip.from = fromDoc.locationName;
                getTrip.fromId = fromDoc._id;
            }
        }
        if (toId && toId !== getTrip.toId) {
            const toDoc = yield routeLocatoin_mode_1.default.findOne({ _id: toId });
            if (!toDoc) {
                return res.status(400).json({
                    success: false,
                    message: "Source Location not in database.",
                });
            }
            else {
                getTrip.to = toDoc.locationName;
                getTrip.toId = toDoc._id;
            }
        }
        yield bus_model_1.default.findByIdAndUpdate({ _id: newBusId }, { $set: { isTripBooked: true } });
        yield bus_model_1.default.findByIdAndUpdate({ _id: getTrip.busId }, { $set: { isTripBooked: false } });
        getTrip.busId = newBusId;
        if (departure_time)
            getTrip.departure_time = departure_time;
        if (price)
            getTrip.price = price;
        const tripDoc = yield getTrip.save();
        return res.status(200).json({ success: true, tripDoc });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
// booking seat
exports.bookSeat = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tripId, passenger } = req.body;
        const getTrip = yield trip_model_1.default.findOne({ _id: tripId });
        if (!getTrip)
            return res
                .status(400)
                .json({ success: false, message: "Trip not found" });
        getTrip.passengers = [...getTrip.passengers, passenger];
        getTrip.save();
        return res.status(200).json({ success: true, message: "Success" });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
//get booked seat info
exports.getPassengers = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tripId } = req.body;
        const tripInfo = yield trip_model_1.default.findOne({ _id: tripId });
        if (!tripInfo)
            return res
                .status(400)
                .json({ success: false, message: "Trip not found" });
        return res
            .status(200)
            .json({ success: true, passengers: tripInfo.passengers });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
// delete trip
exports.deleteTrip = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { tripId } = req.params;
    try {
        const getTrip = yield trip_model_1.default.findOne({ _id: tripId });
        if (!getTrip)
            return res.status(400).json({
                success: false,
                message: "Trip is not available",
            });
        const busId = getTrip.busId;
        yield bus_model_1.default.findOneAndUpdate({ _id: busId }, { $set: { isTripBooked: false } });
        yield trip_model_1.default.findOneAndDelete({ _id: tripId });
        return res
            .status(200)
            .json({ success: true, message: "Trip successfully removed" });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
exports.getAllTrips = (0, catchAsyncErrors_1.CatchAsyncError)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getTrips = yield trip_model_1.default.find();
        return res.status(200).json({ getTrips });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
exports.getTrips = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from, to } = req.params;
        const getTrips = yield trip_model_1.default.find({
            fromId: from,
            toId: to,
        });
        if (!getTrips.length)
            return next(new ErrorHandler_1.default("Trip not found", 400));
        return res.status(200).json(getTrips);
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
//confirm trip
exports.confirmTrip = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tripId, name, email, phone, totalAmount, seatNumbers } = req.body;
        if (!name ||
            !email ||
            !phone ||
            !tripId ||
            !totalAmount ||
            !seatNumbers) {
            return res.status(400).json({
                success: true,
                message: "Please provide all the information",
            });
        }
        // is trip id available
        const getTrip = yield trip_model_1.default.findOne({ _id: tripId });
        if (!getTrip) {
            return res.status(400).json({
                success: true,
                message: "Trip not available",
            });
        }
        const passenger = {
            name,
            phoneNumber: phone,
            seatNumbers,
        };
        getTrip.passengers = [...getTrip.passengers, passenger];
        getTrip.save();
        const sanitizeTrip = (d) => {
            return d.charAt(0).toUpperCase() + d.slice(1);
        };
        yield (0, sendmail_1.default)({
            email,
            subject: `${getTrip.busName} bus ticket`,
            template: "bus-ticket.ejs",
            data: {
                passengerName: name,
                departureTime: (0, dayjs_1.default)(getTrip.departure_time).format("DD MMM, h:mm A"),
                seatNumber: seatNumbers === null || seatNumbers === void 0 ? void 0 : seatNumbers.join(", "),
                destination: `${sanitizeTrip(getTrip.from)} - ${sanitizeTrip(getTrip.to)}`,
                totalAmount: `${totalAmount} Tk`,
            },
        });
        return res.status(200).json({ success: true, getTrip });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
exports.passengerTripCancel = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tripId, passengerId } = req.params;
        const { passengerData } = req.body;
        const tripDoc = yield trip_model_1.default.findOne({ _id: tripId });
        if (!tripDoc) {
            return res
                .status(400)
                .json({ success: false, message: "Trip not found" });
        }
        tripDoc.passengers.forEach((passenger) => {
            const passengerDocId = JSON.stringify(passenger._id);
            if (JSON.parse(passengerDocId) === passengerId) {
                passenger.seatNumbers = passengerData;
            }
        });
        yield tripDoc.save();
        return res.status(200).json({ success: true, tripDoc });
    }
    catch (err) {
        return next(new ErrorHandler_1.default(err.message, 400));
    }
}));
//# sourceMappingURL=trip.controller.js.map