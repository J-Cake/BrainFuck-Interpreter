import readline from "readline";
import fs from 'fs';
import path from 'path';

import Lexer from './lexer';
import Format from "./format";
import Execute from "./executer";
import State from "./state";

const bfHistory: Array<string> = [];

function memory(query: Array<string>): string {
    const req = query.slice(1);

    if (req[0] === "dump") {
        const mem = State.memory.map(i => String(i));
        const maxLength = Math.max(...mem.map(i => i.length));

        return mem.map(i => i.padStart(maxLength, "0")).join(" ");
    } else if (req[0] === "expand") {
        const size = Number(req[1]);
        if (!isNaN(size)) {
            State.maxMemory += Number(req[1]);
            const tmpMem = State.memory.splice(0, State.maxMemory);
            State.memory = [...tmpMem, ...new Array(State.maxMemory - tmpMem.length).fill(0)];

            return `${State.maxMemory} allocated to Memory`;
        } else
            return "Error, cannot expand to value of non-numeric type";
    } else if (req[0] === "reduce") {
        const size = Number(req[1]);
        if (!isNaN(size)) {
            State.maxMemory -= Number(req[1]);
            State.memory = State.memory.splice(0, State.maxMemory);
            return `${State.maxMemory} allocated to Memory`;
        } else
            return "Error, cannot expand to value of non-numeric type";
    } else if (req[0] === "clear") {
        State.memory = new Array<number>(State.maxMemory).fill(0);
        return `Memory cleared`;
    } else if (req[0] === "pointer")
        return String(State.memoryIndex);
    else
        return `Available options are "dump", "expand", "reduce" and "clear"`;
}

function history(query: Array<string>): string {
    const req = query.slice(1);

    if (req[0] === "list")
        return bfHistory.map(i => i.trim()).join("\n");
    else if (req[0] === "clear") {
        bfHistory.splice(0, bfHistory.length);
        return "History cleared";
    } else
        return `Available options are "list" and "clear"`;
}

function dump(query: Array<string>): string {
    if (query[2]) {
        const pth = query[2][0] === "/" ? query[2] : path.join(process.cwd(), query[2]);
        for (const i of bfHistory)
            fs.appendFileSync(pth, i, "utf8");
        return `Written to ${pth}`;
    } else
        return bfHistory.join("\n");
}

export default function prompt(queryFn: () => Promise<string>, rlIf: readline.Interface) {
    rlIf.question("$ ", async function (response: string) {
        let query = response.toLowerCase().split(" ");

        if (query[0] === "exit") {
            rlIf.close();
            process.exit(0);
        } else if (query[0] === "mem" || query[0] === "memory")
            console.log(memory(query));
        else if (query[0] === "his" || query[0] === "history")
            console.log(history(query));
        else if (query[0] === "dump")
            console.log(dump(query));
        else if (query[0] === "cls")
            console.clear();
        else if (response) {
            bfHistory.push(response);
            await Execute(await Format(await Lexer(response, queryFn)));
        }

        prompt(queryFn, rlIf);
    });
}
