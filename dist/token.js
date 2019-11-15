"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = __importDefault(require("./state"));
class Token {
    constructor(type, action) {
        this.body = [];
        this.type = type;
        this.action = action;
    }
    static Increment() {
        return new Token("Inc", function (query) {
            return __awaiter(this, void 0, void 0, function* () {
                state_1.default.memory[state_1.default.memoryIndex]++;
            });
        });
    }
    static Decrement() {
        return new Token("Dec", function (query) {
            return __awaiter(this, void 0, void 0, function* () {
                state_1.default.memory[state_1.default.memoryIndex]--;
            });
        });
    }
    static LShift() {
        return new Token("LShift", function (query) {
            return __awaiter(this, void 0, void 0, function* () {
                state_1.default.memoryIndex--;
                if (state_1.default.memoryIndex === -1)
                    state_1.default.memoryIndex = state_1.default.maxMemory;
            });
        });
    }
    static RShift() {
        return new Token("RShift", function (query) {
            return __awaiter(this, void 0, void 0, function* () {
                state_1.default.memoryIndex = (state_1.default.memoryIndex + 1) % state_1.default.maxMemory;
            });
        });
    }
    static Read(query) {
        return new Token("Read", function (query) {
            return query();
        });
    }
    static Write() {
        return new Token("Write", function (query) {
            return __awaiter(this, void 0, void 0, function* () {
                process.stdout.write(String.fromCharCode(state_1.default.memory[state_1.default.memoryIndex]));
            });
        });
    }
    static Start() {
        return "[";
    }
    static End() {
        return "]";
    }
    static Loop(body) {
        const token = new Token("Loop", function (query) {
            return __awaiter(this, void 0, void 0, function* () {
                while (state_1.default.memory[state_1.default.memoryIndex] > 0) {
                    for (const token of body)
                        yield token.action(query);
                }
            });
        });
        token.body = body;
        return token;
    }
}
exports.default = Token;
//# sourceMappingURL=token.js.map