"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route_controller_1 = require("../controllers/route.controller");
// import { isAuthenticated } from "../middleware/auth";
const routeRouter = express_1.default.Router();
routeRouter.post("/create", route_controller_1.createRoute);
routeRouter.put("/update", route_controller_1.updateRoute);
routeRouter.get("/all-routes", route_controller_1.getAllRoutes);
routeRouter.get("/get-route/:routeName", route_controller_1.getRoute);
routeRouter.delete("/delete/:routeId", route_controller_1.deleteRoute);
routeRouter.get("/route-list", route_controller_1.getRoutes);
exports.default = routeRouter;
//# sourceMappingURL=routeLocation.router.js.map