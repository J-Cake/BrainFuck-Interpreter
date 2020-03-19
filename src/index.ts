#!/usr/bin/env node

import fs from "fs";
import path from "path";
import os from "os";

import Lex from './lexer';
import Format from "./format";
import Execute from "./executer";
import ExecuteBreakable from "./execute-break";

import CLI from './cli';
import readline from "readline";
import State from "./state";

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export function query(): Promise<string> { // Hi
    if (process.stdin.isTTY)
        process.stdin.setRawMode(true);

    return new Promise<string>(function (resolve: (data: any) => void) {
        new Promise<string>(function (resolve: (data: any) => void) {
            if (process.stdin.isTTY) {
                process.stdin.on("keypress", function (string, key) {
                    if (key.sequence === "\u0003")
                        process.exit(0);

                    process.stdin.removeAllListeners();

                    resolve(key.sequence[0])
                });
            } else {
                rl.question("", (ans: string) => resolve(ans[0]));
            }
        }).then(function (key: string) {
            State.memory[State.memoryIndex] = key.charCodeAt(0);
            resolve(key);
        });
    });
}

(async function () {
    const fileArg: string = process.argv[2];
    let file: string;

    let filePath: string;

    if (fileArg) {
        if (fileArg[0] === "/")
            filePath = path.resolve(fileArg);
        else if (fileArg[0] + fileArg[1] === "~/")
            filePath = path.join(os.homedir(), fileArg.slice(2));
        else if (fileArg === "$")
            filePath = path.join(process.cwd(), "index.bf");
        else
            filePath = path.join(process.cwd(), fileArg);

        if (fs.existsSync(filePath)) {
            file = fs.readFileSync(filePath, "utf8");

            const tokens = Lex(file).filter(i => !!i);
            const formatted = Format(tokens).filter(i => !!i);
            // console.log(parsed);

            await Execute(formatted, query);

            process.stdin.end();
            process.stdout.end();

            process.stdin.removeAllListeners();
            process.exit(0);
        } else {
            process.stderr.write(`The file "${fileArg || "index.bf"}" doesn't exist`);
            process.exit(-1);
        }
    } else {
        CLI(query, rl);
    }
})();

export default async (brainfuck: string, queryFunc?: () => Promise<string>) => Execute(
    Format(
        Lex(brainfuck).filter(i => !!i)
    ).filter(i => !!i),
    queryFunc || query);
// export it so that people who want to write a graphical wrapper *cough* me *cough* can do that without having to rewrite the damn thing

export const state = State;
// mostly for debugging purposes
// allows peeking at state before and after running certain command

export const debuggable = {
    Lex,
    Format,
    Execute,
    ExecuteBreakable // it's the same function as Execute except it yields the state at every iterations. This allows one to attatch a debugger to it
};