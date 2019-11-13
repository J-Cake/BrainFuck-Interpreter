import Token from './token';

const Grammar = {
    "+": Token.Increment,
    "-": Token.Decrement,
    "<": Token.LShift,
    ">": Token.RShift,
    ",": Token.Read,
    ".": Token.Write,
    "[": Token.Start,
    "]": Token.End
};

export default Grammar;
