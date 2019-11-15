# BrainFuck-Interpreter
BrainFuck Interpreter! Execute and test BrainFuck in the Command Line!

To use interpreter, you'll need to build, so far, I haven't published to NPM but that will come soon. 
You'll need a TypeScript compiler, I'm just using the one that came with IntelliJ, 
it works fine, but if you're in CLI, type navigate into the source dir and type `tsc`.

You'll see a directory called `dist`. Confirm that each source file is there, and each has a source map.
Now type ``` $ npm link``` or if you use `yarn`, ``` $ yarn link```. You now have a BrainFuck interpreter on your computer!

To use it, type bfc in a command line. You'll see a REPL. In here you can enter any BrainFuck code and it will run as though it had been executed through a file.
The memory will persist between commands as though you are using multiple lines in a text file
