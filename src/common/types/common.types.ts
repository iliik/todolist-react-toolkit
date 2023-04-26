type FieldErrorType = {
    error: string
    field: string
}

export type ResponseTypes<D = {}> = {
    resultCode: number
    messages: Array<string>
    data: D
    fieldsErrors: {
        error: string
        field: string
    }
}
