import {options} from './options'

export interface State {
    pointer: number,
    memory: number[],
    memSize: number
}

const maxMem = options.maxMemory;

const state: State = {
    pointer: 0,
    memory: new Array(maxMem).fill(0),
    memSize: maxMem
};

export default state;
