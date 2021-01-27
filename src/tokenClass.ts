import State from './state';

export default class TokenClass {
    type: string;
    action: (query?: () => Promise<string>) => Promise<void | number>;
    body: Array<TokenClass> = [];

    pos: {line: number, char: number} = {
        line: 0,
        char: 0
    }

    constructor(type: string, action: () => Promise<void | number>) {
        this.type = type;
        this.action = action;
    }

    setPos(line: number, char: number): TokenClass {
        this.pos.line = line;
        this.pos.char = char;

        return this;
    }

    static Increment(): TokenClass {
        return new TokenClass("Inc", async function () {
            State.memory[State.pointer]++;
        });
    }

    static Decrement(): TokenClass {
        return new TokenClass("Dec", async function () {
            State.memory[State.pointer]--;
        });
    }

    static LShift(): TokenClass {
        return new TokenClass("LShift", async function () {
            State.pointer--;
            if (State.pointer === -1)
                State.pointer = State.memSize;
        });
    }

    static RShift(): TokenClass {
        return new TokenClass("RShift", async function () {
            State.pointer = (State.pointer + 1) % State.memSize;
        })
    }

    static Read(): TokenClass {
        return new TokenClass("Read", function (query?: () => Promise<string>): Promise<number> {
            if (query)
                return new Promise<number>(function (resolve) {
                    return query()
                        .then(res => resolve(res[0].charCodeAt(0)))
                        .catch(() => resolve(0));
                }).then(res => State.memory[State.pointer] = res);
            else
                throw new TypeError("Query Function is required");
        });
    }

    static Write(): TokenClass {
        return new TokenClass("Write", async function () {
            process.stdout.write(String.fromCharCode(State.memory[State.pointer]));
        });
    }

    static Start(): TokenClass {
        return new TokenClass("LoopStart", async function () {});
    }

    static End(): TokenClass {
        return new TokenClass("LoopEnd", async function () {});
    }

    static Loop(body: Array<TokenClass>): TokenClass {
        const token = new TokenClass("Loop", async function () {
            while (State.memory[State.pointer] > 0) {
                for (const token of body)
                    await token.action();
            }
        });

        token.body = body;

        return token;
    }
}

