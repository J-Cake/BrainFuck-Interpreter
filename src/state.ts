import {options} from './options'

export interface State {
    memoryIndex: number,
    memory: Array<number>,
    maxMemory: number
}

const maxMem = options.maxMemory;

const state: State = {
    memoryIndex: 0,
    memory: new Array(maxMem).fill(0),
    maxMemory: maxMem
};

export default state;
