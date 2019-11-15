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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const lexer_1 = __importDefault(require("./lexer"));
const format_1 = __importDefault(require("./format"));
const executer_1 = __importDefault(require("./executer"));
const state_1 = __importDefault(require("./state"));
const bfHistory = [];
function memory(query) {
    const req = query.slice(1);
    if (req[0] === "dump") {
        const mem = state_1.default.memory.map(i => String(i));
        const maxLength = Math.max(...mem.map(i => i.length));
        return mem.map(i => i.padStart(maxLength, "0")).join(" ");
    }
    else if (req[0] === "expand") {
        const size = Number(req[1]);
        if (!isNaN(size)) {
            state_1.default.maxMemory += Number(req[1]);
            const tmpMem = state_1.default.memory.splice(0, state_1.default.maxMemory);
            state_1.default.memory = [...tmpMem, ...new Array(state_1.default.maxMemory - tmpMem.length).fill(0)];
            return `${state_1.default.maxMemory} allocated to Memory`;
        }
        else
            return "Error, cannot expand to value of non-numeric type";
    }
    else if (req[0] === "reduce") {
        const size = Number(req[1]);
        if (!isNaN(size)) {
            state_1.default.maxMemory -= Number(req[1]);
            state_1.default.memory = state_1.default.memory.splice(0, state_1.default.maxMemory);
            return `${state_1.default.maxMemory} allocated to Memory`;
        }
        else
            return "Error, cannot expand to value of non-numeric type";
    }
    else if (req[0] === "clear") {
        state_1.default.memory = new Array(state_1.default.maxMemory).fill(0);
        return `Memory cleared`;
    }
    else if (req[0] === "pointer")
        return String(state_1.default.memoryIndex);
    else
        return `Available options are "dump", "expand", "reduce" and "clear"`;
}
function history(query) {
    const req = query.slice(1);
    if (req[0] === "list")
        return bfHistory.map(i => i.trim()).join("\n");
    else if (req[0] === "clear") {
        bfHistory.splice(0, bfHistory.length);
        return "History cleared";
    }
    else
        return `Available options are "list" and "clear"`;
}
function dump(query) {
    if (query[2]) {
        const pth = query[2][0] === "/" ? query[2] : path_1.default.join(process.cwd(), query[2]);
        for (const i of bfHistory)
            fs_1.default.appendFileSync(pth, i, "utf8");
        return `Written to ${pth}`;
    }
    else
        return bfHistory.join("\n");
}
function prompt(queryFn, rlIf) {
    rlIf.question("$ ", function (response) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = response.toLowerCase().split(" ");
            if (query[0] === "exit") {
                rlIf.close();
                process.exit(0);
            }
            else if (query[0] === "mem" || query[0] === "memory")
                console.log(memory(query));
            else if (query[0] === "his" || query[0] === "history")
                console.log(history(query));
            else if (query[0] === "dump")
                console.log(dump(query));
            else if (query[0] === "cls")
                console.clear();
            else if (response) {
                bfHistory.push(response);
                yield executer_1.default(yield format_1.default(yield lexer_1.default(response)), queryFn);
            }
            prompt(queryFn, rlIf);
        });
    });
}
exports.default = prompt;
//# sourceMappingURL=cli.js.map