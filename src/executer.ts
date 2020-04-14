import Token from "./token";
import State from './state';

export default async function Execute(tokens: Token[], query: () => Promise<string>): Promise<number> {
    for (const token of tokens)
        await token.action(query);

    return State.memory[State.memoryIndex];
}
