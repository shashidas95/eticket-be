"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const logger = winston.createLogger({
    level: "info",
    format: winston.format.cli(),
    transports: [new winston.transports.Console()],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map