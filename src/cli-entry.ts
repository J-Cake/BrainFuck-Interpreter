#!/usr/bin/env node

import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

import BrainFuck from './index';

import CLI from './cli';

const Package = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export function query(): Promise<string> { // Hi
    return new Promise<string>(function (resolve: (data: any) => void, reject) {
        if (process.stdin.isTTY) {
            process.stdin.once("keypress", function (chunk, key) {
                if (key && key.escape)
                    reject()
                else
                    resolve(chunk);
            });
        } else
            rl.question("", (ans: string) => resolve(ans[0]));
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

            await BrainFuck(file, query);

            process.exit(0);
        } else {
            process.stderr.write(`The file "${fileArg || "index.bf"}" doesn't exist`);
            process.exit(-1);
        }
    } else {
        process.stdout.write(`BrainFuck Interpreter Version ${Package.version}.\n`);
        process.stdout.write(`MIT - Jacob Schneider - 2020.\n`);

        process.stdout.write(`CWD: ${process.cwd()}\n`);

        CLI(query, rl);
    }
})();
