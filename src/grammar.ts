import TokenClass from './tokenClass';

const Grammar: {
    // [key: string]: () => TokenClass | "[" | "]"
    [key: string]: () => TokenClass
} = {
    "+": TokenClass.Increment,
    "-": TokenClass.Decrement,
    "<": TokenClass.LShift,
    ">": TokenClass.RShift,
    ",": TokenClass.Read,
    ".": TokenClass.Write,
    "[": TokenClass.Start,
    "]": TokenClass.End
};

export default Grammar;
