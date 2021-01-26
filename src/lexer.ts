// import TokenClass from "./token";
// import Grammar from "./grammar";

export enum TokenType {
    Inc,
    Dec,
    PInc,
    PDec,
    Out,
    In,
    LBracket,
    RBracket,
    Comment,
    WhiteSpace,
}

export const matchers: Record<TokenType, (char: string) => boolean> = {
    [TokenType.Inc]: tok => tok === '+',
    [TokenType.Dec]: tok => tok === '-',
    [TokenType.PInc]: tok => tok === '>',
    [TokenType.PDec]: tok => tok === '<',
    [TokenType.Out]: tok => tok === '.',
    [TokenType.In]: tok => tok === ',',
    [TokenType.LBracket]: tok => tok === '[',
    [TokenType.RBracket]: tok => tok === ']',
    [TokenType.Comment]: tok => /^#.*$/.test(tok),
    [TokenType.WhiteSpace]: tok => /^\s+\n$/.test(tok),
}

export type Token = {
    source: string,
    type: TokenType,
    charIndex?: number,
    file?: string
}

export default function Lex(input: string, fileName?: string): Token[] {
    const tokens: Token[] = [];

    let source: string[] = Array.from(input);

    while (source.length > 0) {
        const accumulator: string[] = [];
        let token: Token | null = null;

        for (const i of source) {
            accumulator.push(i);

            for (const [a, i] of Object.entries(matchers))
                if (i(accumulator.join('')))
                    token = {
                        source: accumulator.join(''),
                        type: Number(a) as TokenType,
                        file: fileName,
                        charIndex: 0
                    };
        }

        if (token) {
            tokens.push(token);
            source = source.slice(token.source.length);
        } else {
            console.error(`Invalid token ${token.source}`);
            process.exit(1);
        }
    }

    return tokens;
}
