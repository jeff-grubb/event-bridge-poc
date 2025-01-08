export class Response {
    readonly success: boolean
    readonly statusCode: number
    readonly message?: string
    protected readonly data?: any

    constructor(success: boolean, statusCode?: number, data?: any, message?: string) {
        this.success = success
        this.statusCode = statusCode ?? 500
        this.message = message
        this.data = data
    }

    public isSuccess(): boolean {
        return this.success
    }

    public getStatusCode(): number {
        return this.statusCode
    }

    public getData(): any {
        return this.data
    }
}
