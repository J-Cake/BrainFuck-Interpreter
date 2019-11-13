import Token from "./token";

export default async function Execute(tokens: Array<Token>) {
    let index = 0;
    for (const token of tokens) {
        // console.log(++index, "of", tokens.length);
        await token.action();
        // console.log("success");
    }
}
