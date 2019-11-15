#!/usr/bin/env node
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
const os_1 = __importDefault(require("os"));
const lexer_1 = __importDefault(require("./lexer"));
const format_1 = __importDefault(require("./format"));
const executer_1 = __importDefault(require("./executer"));
const cli_1 = __importDefault(require("./cli"));
const readline_1 = __importDefault(require("readline"));
const state_1 = __importDefault(require("./state"));
let rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
function query() {
    if (process.stdin.isTTY)
        process.stdin.setRawMode(true);
    return new Promise(function (resolve) {
        new Promise(function (resolve) {
            if (process.stdin.isTTY) {
                process.stdin.on("keypress", function (string, key) {
                    if (key.sequence === "\u0003")
                        process.exit(0);
                    process.stdin.removeAllListeners();
                    resolve(key.sequence[0]);
                });
            }
            else {
                rl.question("", (ans) => resolve(ans[0]));
            }
            // @ts-ignore
        }).then(function (key) {
            state_1.default.memory[state_1.default.memoryIndex] = key.charCodeAt(0);
            resolve(key);
        });
    });
}
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const fileArg = process.argv[2];
        let file;
        let filePath;
        if (fileArg) {
            if (fileArg[0] === "/")
                filePath = path_1.default.resolve(fileArg);
            else if (fileArg[0] + fileArg[1] === "~/")
                filePath = path_1.default.join(os_1.default.homedir(), fileArg.slice(2));
            else if (fileArg === "$")
                filePath = path_1.default.join(process.cwd(), "index.bf");
            else
                filePath = path_1.default.join(process.cwd(), fileArg);
            if (fs_1.default.existsSync(filePath)) {
                file = fs_1.default.readFileSync(filePath, "utf8");
                const tokens = yield lexer_1.default(file).filter(i => !!i);
                const formatted = yield format_1.default(tokens).filter(i => !!i);
                // console.log(parsed);
                yield executer_1.default(formatted, query);
                process.stdin.end();
                process.stdout.end();
                process.stdin.removeAllListeners();
                process.exit(0);
            }
            else {
                process.stderr.write(`The file "${fileArg || "index.bf"}" doesn't exist`);
                process.exit(-1);
            }
        }
        else {
            cli_1.default(query, rl);
        }
    });
})();
//# sourceMappingURL=index.js.map