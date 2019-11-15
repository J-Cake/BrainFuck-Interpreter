"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("./token"));
const Grammar = {
    "+": token_1.default.Increment,
    "-": token_1.default.Decrement,
    "<": token_1.default.LShift,
    ">": token_1.default.RShift,
    ",": token_1.default.Read,
    ".": token_1.default.Write,
    "[": token_1.default.Start,
    "]": token_1.default.End
};
exports.default = Grammar;
//# sourceMappingURL=grammar.js.map