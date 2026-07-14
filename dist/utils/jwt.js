"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicUser = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }
    return secret;
};
const signToken = (user) => jsonwebtoken_1.default.sign({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
}, getJwtSecret(), { expiresIn: "7d" });
exports.signToken = signToken;
const publicUser = (user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    photoUrl: user.photoUrl,
    phone: user.phone,
    bio: user.bio,
    address: user.address,
    role: user.role,
});
exports.publicUser = publicUser;
