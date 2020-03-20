# BrainFuck-Interpreter
BrainFuck Interpreter! Execute and test BrainFuck in the Command Line!

To use interpreter, you'll need to build, so far, I haven't published to NPM but that will come soon. 
You'll need a TypeScript compiler, I'm just using the one that came with IntelliJ, 
it works fine, but if you're in CLI, then navigate into the source dir and type `tsc`.

You'll see a directory called `dist`. Confirm that each source file is there, and each has a source map.
Now type ``` $ npm link``` or if you use `yarn`, ``` $ yarn link```. You now have a BrainFuck interpreter on your computer!

To use it, type bfc in a command line. You'll see a REPL. In here you can enter any BrainFuck code and it will run as though it had been executed through a file.
The memory will persist between commands as though you are using multiple lines in a text file

## REPL Commands

There are several commands you can use in the REPL to observe the state of the program as you enter commands.

Commands can have aliases. Below is a list of all commands and their respective aliases. Parameter patterns and names remain consisten across aliased commands.

 - memory, mem
 - history, his
 - pointer, index, mem-loc
 - dump
 - clear, cls

### memory

The `memory` command handles the state of the memory registers.

```
$ memory [arguments ...]
```

The memory command takes sub commands. They are:

 - clear
 - dump
 - expand \<value\>
 - reduce \<value\>
 - fixed \<size\>
 - set \<index\> \<value\>

`clear`: resets every memory location to `0`
`dump`: prints the contents of memory to the command line
`expand`: increases the memory capacity by `value`.
`reduce`: reduces the memory capacity by `value`.
`fixed`: allocate exactly `size` positions to memory.
`set`: set value at location `index` to `value`.

### history

The `history` command handles the REPL command history.

```
$ history [operation]
```

The history command takes arguments:

 - list
 - clear

`list`: prints the command history to the command line
`clear`: clears the command history

### pointer

The `pointer` command deals with the current memory pointer.

```
$ pointer [operation]
```

The pointer command takes arguments:

 - dump | \*nothing\*
 - set <index>
 - reset

`dump`: prints the pointer index to the command line
`set`: sets the pointer index to `value`
`reset`: resets the pointer index to 0