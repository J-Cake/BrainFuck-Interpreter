import {State} from "./state";

export type debugAction = null | ((state: State) => State);

export interface Options {
    maxMemory: number,
    prompt: string,
    action: debugAction
}

export const options: Options = {
    maxMemory: 4,
    prompt: `#`,
    action: null
}

export default function initOptions(preferences?: Partial<Options>): Options {
    const opts: Options = options;
    if (preferences)
        for (const key in preferences)
            options[key] = preferences[key];
    return opts;
}
