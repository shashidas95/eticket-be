"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bus_controller_1 = require("../controllers/bus.controller");
const busRouter = express_1.default.Router();
busRouter.post("/create", bus_controller_1.createBus);
busRouter.patch("/toggle-available/:busId", bus_controller_1.toggleBusIsAvailableForTrip);
busRouter.put("/update/:busId", bus_controller_1.updateBus);
busRouter.delete("/delete/:busId", bus_controller_1.deleteBus);
busRouter.get("/get-buses", bus_controller_1.getBuses);
exports.default = busRouter;
//# sourceMappingURL=bus.route.js.map