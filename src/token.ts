import State from './state';


export default class Token {
    type: string;
    action: (query?: () => Promise<string>) => Promise<void | string>;
    body: Array<Token> = [];

    pos: {line: number, char: number} = {
        line: 0,
        char: 0
    }

    constructor(type: string, action: () => Promise<void | string>) {
        this.type = type;
        this.action = action;
    }

    setPos(line: number, char: number): Token {
        this.pos.line = line;
        this.pos.char = char;

        return this;
    }

    static Increment(): Token {
        return new Token("Inc", async function () {
            State.memory[State.memoryIndex]++;
        });
    }

    static Decrement(): Token {
        return new Token("Dec", async function () {
            State.memory[State.memoryIndex]--;
        });
    }

    static LShift(): Token {
        return new Token("LShift", async function () {
            State.memoryIndex--;
            if (State.memoryIndex === -1)
                State.memoryIndex = State.maxMemory;
        });
    }

    static RShift(): Token {
        return new Token("RShift", async function () {
            State.memoryIndex = (State.memoryIndex + 1) % State.maxMemory;
        })
    }

    static Read(): Token {
        return new Token("Read", function (query?: () => Promise<string>): Promise<string> {
            if (query)
                return query();
            else
                throw new TypeError("Query Function is required");
        })
    }

    static Write(): Token {
        return new Token("Write", async function () {
            process.stdout.write(String.fromCharCode(State.memory[State.memoryIndex]));
        });
    }

    // static Start(): "[" { // this is really backwards, but if you don't know why I do this, perhaps read over the code, there's not that much of it
    //     return "[";
    // }

    // static End(): "]" { // same story here.
    //     return "]";
    // }

    static Start(): Token {
        return new Token("LoopStart", async function () {});
    }

    static End(): Token {
        return new Token("LoopEnd", async function () {});
    }

    static Loop(body: Array<Token>): Token {
        const token = new Token("Loop", async function () {
            while (State.memory[State.memoryIndex] > 0) {
                for (const token of body)
                    await token.action();
            }
        });

        token.body = body;

        return token;
    }
}

