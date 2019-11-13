import Token from "./token";
import Grammar from "./grammar";

export default function Lex(source: string, query: () => Promise<string>) {
    const tokens: Array<Token> = [];

    for (const i of [...source]) {
        if (i in Grammar)
        // @ts-ignore
            tokens.push(Grammar[i](i === "." ? query : null));
    }

    return tokens;
}
