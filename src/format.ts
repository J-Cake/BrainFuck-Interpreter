import type {Token} from "./lexer";
import {TokenType} from "./lexer";
import type {State} from "./state";
import {Execute} from "./index";

export type queryFn = () => Promise<string>;
export type Action = (state: State, query: queryFn) => Promise<void>; // can manipulate the current state and returns the success of the operation.

export class Statement {
    action: Action;
    type: Actions;
    source: Token[];

    evalFn?: (statements: Statement[], queryFn: queryFn) => Promise<void>;

    constructor(opts: { action: Action, type: Actions, source: Token[] }) {
        this.action = opts.action;
        this.type = opts.type;
        this.source = opts.source;
    }
}

export enum Actions {
    Inc,
    Dec,
    PInc,
    PDec,
    In,
    Out,
    Loop,
}

export const actions: Record<Actions, Action> = {
    [Actions.Inc]: async (state: State) => void state.memory[state.pointer]++,
    [Actions.Dec]: async (state: State) => void state.memory[state.pointer]--,
    [Actions.PInc]: async (state: State) => void Math.min((Math.max(void state.pointer++, 0)), state.memory.length),
    [Actions.PDec]: async (state: State) => void Math.min((Math.max(void state.pointer--, 0)), state.memory.length),
    [Actions.In]: async (state: State, query: queryFn) => void (state.memory[state.pointer] = (await query()).charCodeAt(0)),
    [Actions.Out]: async (state: State) => void console.log(String.fromCharCode(state.memory[state.pointer])),
    [Actions.Loop]: async _ => void console.error('Invalid Loop'),
}

export type actions = TokenType.Out | TokenType.In | TokenType.Inc | TokenType.Dec | TokenType.PDec | TokenType.PInc;
const tokenTypeToActionMap: { [key in actions]: Actions } = {
    [TokenType.Out]: Actions.Out,
    [TokenType.In]: Actions.In,
    [TokenType.Inc]: Actions.Inc,
    [TokenType.Dec]: Actions.Dec,
    [TokenType.PDec]: Actions.PDec,
    [TokenType.PInc]: Actions.PInc,
}

const p = (...x: any[]) => void console.log.apply(x) || x;

export default function Format(tokens: Token[], depth: number = 0): Statement[] {
    const statements: Statement[] = [];

    let bracketIndex: number = 0;
    const bracketContent: Token[] = [];
    for (const i of tokens) {
        if (i.type === TokenType.LBracket)
            bracketIndex++;
        else if (i.type === TokenType.RBracket)
            bracketIndex--
        else if (bracketIndex > 0)
            bracketContent.push(i);
        else {
            if (bracketContent.length > 0)
                statements.push(new Statement({
                    async action(state: State, query: queryFn): Promise<void> {
                        const tokens: Statement[] = Format(this.source, depth + 1); // execute tokens;
                        while (state[state.pointer] > 0)
                            if (this.evalFn)
                                this.evalFn(tokens);
                            else
                                await Execute(tokens, query);
                    }, type: Actions.Loop,
                    source: p(bracketContent.splice(0, bracketContent.length))[0]
                }));
            if (i.type in tokenTypeToActionMap)
                statements.push(new Statement({
                    action: actions[tokenTypeToActionMap[i.type]],
                    source: [i],
                    type: tokenTypeToActionMap[i.type]
                }))
        }
    }

    return statements;
}
