"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const auth_1 = require("./auth");
const adminAuth = (req, res, next) => {
    (0, auth_1.verifyToken)(req, res, () => {
        const user = req.user;
        if (user && user.role === "admin") {
            next();
        }
        else {
            res.status(403).json({ message: "Admin Access Required" });
        }
    });
};
exports.adminAuth = adminAuth;
