"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatchAsyncError = void 0;
const CatchAsyncError = (theFunc) => (req, res, next) => {
    return Promise.resolve(theFunc(req, res, next)).catch(next);
};
exports.CatchAsyncError = CatchAsyncError;
//# sourceMappingURL=catchAsyncErrors.js.map