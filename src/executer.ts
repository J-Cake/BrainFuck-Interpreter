import Token from "./token";

export default async function Execute(tokens: Array<Token>, query: () => Promise<string>) {
    let index = 0;
    for (const token of tokens) {
        await token.action(query);
    }
}
