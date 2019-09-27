export class BusinessException extends Error {

    httpStatus: number = 422;
    code: string;
    message: string;

    constructor(code: string, message: string) {
        super();
        this.code = code;
        this.message = message;
    }

}
