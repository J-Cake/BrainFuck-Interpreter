export interface Options {
    maxMemory: number,
    prompt: string
}

export const options: Options = {
    maxMemory: 256,
    prompt: "#"
}

export default function initOptions(preferences?: Options) {
    if (preferences)
        for (const key in preferences)
            options[key] = preferences[key];
}
