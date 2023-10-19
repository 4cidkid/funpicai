import { Dispatch, SetStateAction } from 'react'

export type Prompts = { promp: string, index: number, response: boolean, responseImage: string | null, loadingPropmt: boolean }[]
export type GenerateProps = {
    prompts: Prompts,
    setPrompts: Dispatch<SetStateAction<Prompts>>,
    mode: boolean,
    setMode: Dispatch<SetStateAction<boolean>>,
    currentPrompt: CurrentPrompt,
    setCurrentPrompt: Dispatch<SetStateAction<CurrentPrompt>>,
    setImage: Dispatch<SetStateAction<image>>,
}
export type PrompBarProps = {
    prompts: Prompts,
    mode: boolean,
    setPrompts: Dispatch<SetStateAction<Prompts>>,
    currentPrompt: CurrentPrompt,
    setCurrentPrompt: Dispatch<SetStateAction<CurrentPrompt>>,
    setImage: Dispatch<SetStateAction<image>>,
    setMode: Dispatch<SetStateAction<boolean>>,
}
export type ModeProps = {
    prompts: Prompts,
    mode: boolean,
    setMode: Dispatch<SetStateAction<boolean>>,
}
export type CurrentPrompt = {
    prompt: string,
    active: boolean,
}
export type image = {
    file: File | null, url: string
}
