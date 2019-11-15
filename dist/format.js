"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("./token"));
function Format(tokens, depth = 0) {
    const newTokenList = [];
    const body = [];
    let bracketCount = 0;
    for (const token of tokens) {
        if (token === "[") {
            bracketCount++;
            continue;
        }
        else if (token === "]") {
            if (--bracketCount === 0)
                newTokenList.push(token_1.default.Loop(Format(body.splice(0, body.length), depth + 1)));
            continue;
        }
        if (bracketCount > 0)
            body.push(token);
        else
            newTokenList.push(token);
    }
    return newTokenList;
}
exports.default = Format;
//# sourceMappingURL=format.js.map