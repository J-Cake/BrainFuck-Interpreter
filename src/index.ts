import State from './state';
import Lex from './lexer';
import Format from './format';
import Execute from './executer';
import ExecuteBreakable from './execute-break';

type interpreter = (brainfuck: string, queryFunc: () => Promise<string>) => Promise<number>;

const exec: interpreter = (brainfuck: string, queryFunc: () => Promise<string>): Promise<number> => Execute(
    Format(
        Lex(brainfuck).filter(i => !!i)
    ).filter(i => !!i),
    queryFunc);

const interpreters: {
    [name: string]: interpreter
} = {
    basic: exec
};

function defaultFunction(): interpreter {
    return exec;
}

export function interpreter(name: string, intereter: interpreter) {
    interpreters[name] = intereter;
}

export default async (brainfuck: string, queryFunc: () => Promise<string>) => await defaultFunction()(brainfuck, queryFunc);
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
