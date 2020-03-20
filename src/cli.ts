import readline from "readline";
import fs from 'fs';
import path from 'path';

import Lexer from './lexer';
import Format from "./format";
import Execute from "./executer";
import State from "./state";

const bfHistory: string[] = [];

function memory(query: string[]): string {
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
            return "Error, cannot expand by value of non-numeric type";
    } else if (req[0] === "reduce") {
        const size = Number(req[1]);
        if (!isNaN(size)) {
            State.maxMemory -= Number(req[1]);
            State.memory = State.memory.splice(0, State.maxMemory);
            return `${State.maxMemory} allocated to Memory`;
        } else
            return "Error, cannot reduce by value of non-numeric type";
    } else if (req[0] === "fixed") {
        const size = Number(req[1]);
        if (!isNaN(size)) {
            State.memory = State.memory.slice(0, size);
            return `Set memory size to ${State.maxMemory = size}`;
        } else
            return "Error, cannot fix to value of non-numeric type";
    } else if (req[0] === "set") {
        const index = Number(req[1])
        const value = Number(req[2]);

        if (!isNaN(index) && !isNaN(value))
            if (index < State.maxMemory && index >= 0 && typeof State.memory[index] !== "undefined")
                return `Memory at index ${index}, set to ${State.memory[index] = value}`;
            else
                return `Error, invalid memory address, ${index}`;
        else
            return `Error, both index and value must be numbers`;
    } else if (req[0] === "clear") {
        State.memory = new Array<number>(State.maxMemory).fill(0);
        return `Memory cleared`;
    } else if (req[0] === "pointer")
        return String(State.memoryIndex);
    else
        return `Available options are "dump", "expand <value>", "reduce <value>", "fixed <size>", "set <index> <value>" and "clear"`;
}

function history(query: string[]): string {
    const req = query.slice(1);

    if (req[0] === "list")
        return bfHistory.map(i => i.trim()).join("\n");
    else if (req[0] === "clear") {
        bfHistory.splice(0, bfHistory.length);
        return "History cleared";
    } else
        return `Available options are "list" and "clear"`;
}

function dump(query: string[]): string {
    if (query[1]) {
        const pth = query[1][0] === "/" ? query[1] : path.join(process.cwd(), query[1]);
        for (const i of bfHistory)
            fs.appendFileSync(pth, i, "utf8");
        return `Written to ${pth}`;
    } else
        return bfHistory.join("\n");
}

function memLoc(query: string[]): string {
    if (!query[1] || query[1] === "dump")
        return `Memory Index At: ${String(State.memoryIndex)}`;
    else if (query[1] === "reset")
        return `Reset Memory Index to: ${State.memoryIndex = 0}`;
    else if (query[1] === "set")
        if (!isNaN(Number(query[2])))
            if (Number(query[2]) >= 0 && Number(query[2]) < State.maxMemory)
                return `Set Memory Index to: ${State.memoryIndex = Number(query[2])}`;
            else
                return `Error, pointer out of bounds. The pointer must be between 0 and ${State.maxMemory}`
        else
            return "Error, cannot set to value of non-numeric type";
    else
        return `Available options are "dump | *nothing*", "set <number>" and "reset"`;
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
        else if (query[0] === "pointer" || query[0] === "index" || query[0] === "mem-loc")
            console.log(memLoc(query));
        else if (query[0] === "cls" || query[0] === "clear")
            console.clear();
        else if (response) {
            bfHistory.push(response);
            await Execute(await Format(await Lexer(response)), queryFn);
        }

        prompt(queryFn, rlIf);
    });
}
