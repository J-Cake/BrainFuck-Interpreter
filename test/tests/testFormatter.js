const Lex = require('../../dist/lexer');
const Format = require('../../dist/format');

module.exports = function() {
    const sampleScript = `+++[>+++<-]`;

    function neaten(tokens) {
        return tokens.map(i => ({
            type: i.type,
            pos: i.pos,
            body: neaten(i.body)
        }));
    }

    return neaten(Format.default(Lex.default(sampleScript)));
}
