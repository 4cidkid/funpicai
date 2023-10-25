import { Dispatch, SetStateAction, MutableRefObject, RefObject } from 'react'

export type Prompts = { promp: string, index: number, response: boolean, responseImage: string | null, loadingPropmt: boolean }[]
export type GenerateProps = {
    prompts: Prompts,
    setPrompts: Dispatch<SetStateAction<Prompts>>,
    mode: boolean,
    setMode: Dispatch<SetStateAction<boolean>>,
    currentPrompt: CurrentPrompt,
    setCurrentPrompt: Dispatch<SetStateAction<CurrentPrompt>>,
    setImageToEdit: Dispatch<SetStateAction<ImageToEdit>>,
    canvasRef: RefObject<HTMLCanvasElement>,
    imageToEdit: ImageToEdit,
    switchImage: boolean,
    setSwitchImage: Dispatch<SetStateAction<boolean>>
}
export type EditProps = {
    mode: boolean, imageToEdit: ImageToEdit, setImageToEdit: Dispatch<SetStateAction<ImageToEdit>>
    , canvasRef: RefObject<HTMLCanvasElement>, switchImage: boolean, setSwitchImage: Dispatch<SetStateAction<boolean>>
}
export type PrompBarProps = {
    prompts: Prompts,
    mode: boolean,
    setPrompts: Dispatch<SetStateAction<Prompts>>,
    currentPrompt: CurrentPrompt,
    setCurrentPrompt: Dispatch<SetStateAction<CurrentPrompt>>,
    setImageToEdit: Dispatch<SetStateAction<ImageToEdit>>,
    setMode: Dispatch<SetStateAction<boolean>>,
    canvasRef: RefObject<HTMLCanvasElement>
    imageToEdit: ImageToEdit,
    setSwitchImage: Dispatch<SetStateAction<boolean>>

}
export type ModeProps = {
    prompts: Prompts,
    mode: boolean,
    setMode: Dispatch<SetStateAction<boolean>>,
    setSwitchImage: Dispatch<SetStateAction<boolean>>

}
export type CurrentPrompt = {
    prompt: string,
    active: boolean,
}
export type ImageToEdit = {
    file: File | null, url: string
}
export type OptionsModalProps = {
    showDialog: boolean,
    setShowDialog: Dispatch<SetStateAction<boolean>>,
    setPrompts: Dispatch<SetStateAction<Prompts>>,
}


export type ShowNoApiKeyDialog = {
    state: boolean,
    action: boolean | null // true = user tried to submit a prompt without api key, false = user click on the button to setup api key
}
export type ApiKeyModalProps = {
    showNoApiKeyDialog: ShowNoApiKeyDialog
    setShowNoApiKeyDialog: Dispatch<SetStateAction<ShowNoApiKeyDialog>>,
    apikeyCookie: MutableRefObject<string | undefined>
}