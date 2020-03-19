import Token from "./token";

export default async function Execute(tokens: Token[], query: () => Promise<string>) {
    for (const token of tokens)
        await token.action(query);
}
