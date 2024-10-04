"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const routeLocationSchema = new mongoose_1.default.Schema({
    locationName: {
        type: String,
        required: true,
    },
});
const routeLocationModel = mongoose_1.default.model("route", routeLocationSchema);
exports.default = routeLocationModel;
//# sourceMappingURL=routeLocatoin.mode.js.map