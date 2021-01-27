const BrainFuck = require('../../dist/index');
const State = require('../../dist/state');

module.exports = function () {
    const queryResults = "ABC";
    let queryIndex = 0;

    const queryFunction = function () {
        return new Promise(function (resolve) {
            // we provide a query function with preset values just in case we wish to change the test program.
            // this function will simply move along the array
            resolve(queryResults[queryIndex++]);
        });
    }

    const testProgram = `
        ,[>+>+<<-][>>=<<+].
    `;

    BrainFuck.default(testProgram, queryFunction, {
        maxMem: 16
    });

    console.log({
        pointerIndex: State.default.memoryIndex,
        memory: State.default.memory.map(i => Number(i))
    });

    return {
        pointerIndex: State.default.memoryIndex,
        memory: State.default.memory.map(i => Number(i))
    };
}
