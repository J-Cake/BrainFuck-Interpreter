import Token from "./token";
import Grammar from "./grammar";

export default function Lex(source: string): Array<Token | "[" | "]"> {
    const tokens: Array<Token | "[" | "]"> = [];

    for (const i of [...source])
        if (i in Grammar)
            tokens.push(Grammar[i]());

    return tokens;
}
