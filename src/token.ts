import readline from 'readline';

import State from './state';



export default class Token {
    type: string;
    action: () => Promise<void|string>;
    body: Array<Token> = [];

    constructor(type: string, action: () => Promise<void|string>) {
        this.type = type;
        this.action = action;
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

    static Read(query: () => Promise<string>): Token {
        return new Token("Read", function (): Promise<string> {
            return query();
        })
    }

    static Write(): Token {
        return new Token("Write", async function() {
            process.stdout.write(String.fromCharCode(State.memory[State.memoryIndex]));
        });
    }

    static Start(): string {
        return "[";
    }

    static End(): string {
        return "]";
    }

    static Loop(body: Array<Token>): Token {
        const token = new Token("Loop", async function() {
            while (State.memory[State.memoryIndex] > 0) {
                for (const token of body)
                    await token.action();
            }
        });

        token.body = body;

        return token;
    }
}

