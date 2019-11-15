import Token from "./token";
import Grammar from "./grammar";

export default function Lex(source: string) {
    const tokens: Array<Token> = [];

    for (const i of [...source]) {
        if (i in Grammar)
        // @ts-ignore
            tokens.push(Grammar[i]());
    }

    return tokens;
}
