import Token from "./token";
import Grammar from "./grammar";

// export default function Lex(source: string): Array<Token | "[" | "]"> {
export default function Lex(source: string): Token[] {
    // const tokens: Array<Token | "[" | "]"> = [];
    const tokens: Token[] = [];

    let line: number = 0;
    let char: number = 0;

    for (const i of [...source]) {
        if (i === "\n") {
            line++;
            char = 0;
        } else
            char++;

        if (i in Grammar)
            tokens.push(Grammar[i]().setPos(line, char));
    }

    return tokens;
}
