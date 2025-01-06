export class Response {
    readonly success: boolean
    readonly message?: string
    protected readonly data?: any

    constructor(success: boolean, data?: any, message?: string) {
        this.success = success
        this.message = message
        this.data = data
    }

    public getData(): any {
        return this.data
    }

    public isSuccess(): boolean {
        return this.success
    }
}
