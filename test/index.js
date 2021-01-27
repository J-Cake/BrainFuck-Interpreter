const {inspect} = require('util');

const tests = require('./tests.json');

function compareArray(arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;
    else
        for (const i in arr1)
            if (arr1[i] !== arr2[i])
                return false;

    return true;
}

function compare(...objects) {
    // StackOverflow to the rescue
    let i, l, leftChain, rightChain;

    function compare2Objects(x, y) {
        let p;

        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number')
            return true;

        // Compare primitives and functions.
        // Check if both arguments link to the same object.
        // Especially useful on the step where we compare prototypes
        if (x === y)
            return true;

        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if ((typeof x === 'function' && typeof y === 'function') ||
            (x instanceof Date && y instanceof Date) ||
            (x instanceof RegExp && y instanceof RegExp) ||
            (x instanceof String && y instanceof String) ||
            (x instanceof Number && y instanceof Number))
            return x.toString() === y.toString();

        // At last checking prototypes as good as we can
        if (!(x instanceof Object && y instanceof Object))
            return false;

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false;
        }

        if (x.constructor !== y.constructor)
            return false;

        if (x.prototype !== y.prototype)
            return false;

        // Check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1)
            return false;

        for (let p in y)
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p))
                return false;
            else if (typeof y[p] !== typeof x[p])
                return false;

        for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p))
                return false;
            else if (typeof y[p] !== typeof x[p])
                return false;

            switch (typeof (x[p])) {
                case 'object':
                case 'function':

                    leftChain.push(x);
                    rightChain.push(y);

                    if (!compare2Objects(x[p], y[p]))
                        return false;

                    leftChain.pop();
                    rightChain.pop();
                    break;

                default:
                    if (x[p] !== y[p])
                        return false;
                    break;
            }
        }

        return true;
    }

    if (objects.length < 1)
        return true; //Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";

    for (i = 1, l = objects.length; i < l; i++) {

        leftChain = []; //Todo: this can be cached
        rightChain = [];

        if (!compare2Objects(objects[0], objects[i]))
            return false;
    }

    return true;
}

function fail(...message) {
    console.error(...message);

    process.exit(-1);
}

if (typeof tests === "object" && !(tests instanceof Array)) {
    for (const testName in tests) {
        const expected = tests[testName];

        try {
            var testScript = require(testName);
        } catch (err) {
            fail(`Test ${testName} does not exist`);
        }

        if (typeof testScript === "function") {
            try {
                var actual = testScript();
            } catch (err) {
                fail(`Test ${testName} failed with the following exception\n\n`, err);
            }
            if (!compare(actual, expected))
                fail("Test Failed:", inspect(actual, false, null, true), "does not equal", inspect(expected, false, null, true));
        }
    }

    console.log("All Tests Passed");
} else throw new TypeError('Invalid Test Structure');
