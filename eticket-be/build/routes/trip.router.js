"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trip_controller_1 = require("../controllers/trip.controller");
// import { isAuthenticated } from "../middleware/auth";
const tripRouter = express_1.default.Router();
tripRouter.post("/create", trip_controller_1.createTrip);
tripRouter.put("/update", trip_controller_1.createTrip);
tripRouter.put("/update-trip/:tripId", trip_controller_1.updateTrip);
tripRouter.delete("/delete/:tripId", trip_controller_1.deleteTrip);
tripRouter.get("/get-passengers", trip_controller_1.getPassengers);
tripRouter.put("/trip-cancel/trip/:tripId/passenger/:passengerId", trip_controller_1.passengerTripCancel);
tripRouter.put("/book-seat", trip_controller_1.bookSeat);
tripRouter.get("/trip-list/from/:from/to/:to", trip_controller_1.getTrips);
tripRouter.get("/get-all-trips", trip_controller_1.getAllTrips);
tripRouter.post("/confirm-trip", trip_controller_1.confirmTrip);
exports.default = tripRouter;
//# sourceMappingURL=trip.router.js.map