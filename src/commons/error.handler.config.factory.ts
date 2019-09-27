import * as express from 'express';
import { interfaces } from 'inversify-express-utils';
import { BusinessException } from '../domains/business.exception';

export class ErrorHandlerFactory {

  private constructor() { }

  public static create() : interfaces.ConfigFunction {

    return (app: any) => {
      app.use((err: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {

        if (err instanceof BusinessException || (err as BusinessException).httpStatus >= 400) {
          let be: BusinessException = (err as BusinessException)
          response.status(be.httpStatus).json([{
            code: be.code,
            message: be.message,
          }]).end();
        } else {
          response.status(500).json([{
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal Server Error.',
          }]).end();
        }
      }

      );
    };
  }

}

export class JsonException {
  public code: string;
  public message: string;

  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }

}
