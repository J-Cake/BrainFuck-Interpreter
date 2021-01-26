import {install} from 'source-map-support';

import state, {State} from './state';
import Lex from './lexer';
import Format, {queryFn, Statement} from './format';
import initOptions, {debugAction, Options, options} from './options';
import {inspect} from "util";

install();

const exec = async function (brainfuck: string, queryFunc: queryFn, options?: Options): Promise<number> {
    const opts = initOptions(options);

    await evalFn(await Format(Lex(brainfuck)), queryFunc, opts.action);

    return state.memory[state.pointer];
}

export const evalFn = async function(statements: Statement[], queryFn: queryFn, action: debugAction) {
    if (typeof options.action === 'function')
        for await (const state of ExecuteBreakable(statements, queryFn)) options.action(state);
    else
        await Execute(statements, queryFn);
}

export async function Execute(statements: Statement[], query: queryFn): Promise<number> {
    for (const i of statements)
        await i.action(query);
    return state.memory[state.pointer];
}

export async function *ExecuteBreakable(statements: Statement[], query: queryFn): AsyncGenerator<State, number> {
    for (const i of statements) {
        await i.action(query);
        yield state;
    }
    return state.memory[state.pointer];
}

export default async (brainfuck: string, queryFunc: () => Promise<string>, options?: Options) => await exec(brainfuck, queryFunc, options);
// export it so that people who want to write a graphical wrapper *cough* me *cough* can do that without having to rewrite the damn thing
