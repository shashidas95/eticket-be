"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const passengersSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    seatNumbers: {
        type: [String],
        required: true,
    },
});
const tripSchema = new mongoose_1.default.Schema({
    busId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    fromId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    toId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    busName: {
        type: String,
        required: true,
    },
    departure_time: {
        type: Date,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    busType: {
        type: String,
        required: true,
    },
    numberOfSeat: {
        type: String,
        required: true,
    },
    passengers: {
        type: [passengersSchema],
    },
});
const tripModel = mongoose_1.default.model("trip", tripSchema);
exports.default = tripModel;
//# sourceMappingURL=trip.model.js.map