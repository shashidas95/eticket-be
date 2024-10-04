"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const busSchema = new mongoose_1.default.Schema({
    busName: {
        type: String,
        required: [true, "Please provide bus name."],
    },
    busType: {
        type: String,
        required: [true, "Please provide bus type."],
    },
    numberOfSeat: {
        type: Number,
        required: [true, "Please provide number of seat"],
    },
    isAvailableForTrip: {
        type: Boolean,
        default: true,
    },
    isTripBooked: {
        type: Boolean,
        default: false,
    },
});
const busModel = mongoose_1.default.model("bus", busSchema);
exports.default = busModel;
//# sourceMappingURL=bus.model.js.map