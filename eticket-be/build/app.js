"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = __importDefault(require("./middleware/error"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const routeLocation_router_1 = __importDefault(require("./routes/routeLocation.router"));
const bus_route_1 = __importDefault(require("./routes/bus.route"));
const trip_router_1 = __importDefault(require("./routes/trip.router"));
//body parser
exports.app.use(express_1.default.json({ limit: "50mb" }));
//cookies parser
exports.app.use((0, cookie_parser_1.default)());
// cors origin
// app.use(cors({ origin: process.env.ORIGIN }));
// ["http://localhost:3000", "http://192.168.0.106:3000"];
const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://192.168.0.106:3000",
        "https://e-ticket-frontend-one.vercel.app/",
    ],
    credentials: true,
    optionSuccessStatus: 200,
};
// app.use((_req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   next();
// });
exports.app.use((0, cors_1.default)(corsOptions));
//testing api
exports.app.get("/test", (req, res) => {
    res.cookie("ac", "hi bro");
    res.status(200).json({});
});
//routes
exports.app.use("/api/v1", user_route_1.default);
exports.app.use("/api/v1/route", routeLocation_router_1.default);
exports.app.use("/api/v1/bus", bus_route_1.default);
exports.app.use("/api/v1/trip", trip_router_1.default);
//unknown route
exports.app.all("*", (req, _res, next) => {
    const err = new Error(`${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});
exports.app.use(error_1.default);
//# sourceMappingURL=app.js.map