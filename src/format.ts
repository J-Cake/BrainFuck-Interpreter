import Token from './token';

// export default function Format(tokens: Array<Token | "[" | "]">, depth: number = 0): Token[] {
export default function Format(tokens: Token[], depth: number = 0): Token[] {
    const newTokenList: Token[] = [];
    const body: Token[] = [];

    let bracketCount: number = 0;

    for (const token of tokens) {
        if (token.type === "LoopStart") {
            bracketCount++;
            continue;
        } else if (token.type === "LoopEnd") {
            if (--bracketCount === 0)
                newTokenList.push(Token.Loop(Format(body.splice(0, body.length), depth + 1)));
            continue;
        }

        if (bracketCount > 0)
            body.push(token);
        else
            newTokenList.push(token);
    }

    return newTokenList;
}
