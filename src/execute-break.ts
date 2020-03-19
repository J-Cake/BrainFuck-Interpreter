import Token from "./token";
import State from './state';

export default async function *ExecuteBreakable(tokens: Token[], query: () => Promise<string>) {
    for (const token of tokens) {
        await token.action(query);
        
        yield State;
    }
}
