const Lex = require('../../dist/lexer');

module.exports = function() {
    const sampleScript = `+-><,.[]`;

    return Lex.default(sampleScript).map(i => ({
        type: i.type,
        pos: {
            line: i.pos.line,
            char: i.pos.char
        }
    }));
}
