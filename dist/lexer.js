"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammar_1 = __importDefault(require("./grammar"));
function Lex(source) {
    const tokens = [];
    for (const i of [...source]) {
        if (i in grammar_1.default)
            // @ts-ignore
            tokens.push(grammar_1.default[i]());
    }
    return tokens;
}
exports.default = Lex;
//# sourceMappingURL=lexer.js.map