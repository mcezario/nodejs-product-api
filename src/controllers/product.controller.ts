import 'reflect-metadata';
import * as express from 'express';
import { interfaces, controller, httpGet, httpPost, httpPut, httpDelete, response, request, requestParam } from 'inversify-express-utils';
import { IProduct } from "../domains/product";
import { inject } from 'inversify';
import { ProductService } from '../usecases/product.service';
import { ProductResponse } from './product.response';

@controller('')
export class ProductController implements interfaces.Controller {
    
    public static TARGET_NAME: string = 'product.controller';

    constructor(
      @inject(ProductService.TARGET_NAME)
      private service: ProductService){
    }

    @httpGet('/')
    public async getAll(
      @request() request: express.Request,
      @response() response: express.Response) {
      let products: IProduct[] = await this.service.getAll();

      let productsReponse: ProductResponse[] = products.map(p => new ProductResponse(p));
      response.send(productsReponse);
    }

    @httpPost('/', 'SecurityFilterMiddleware')
    public async create(
        @request() request: express.Request,
        @response() response: express.Response) {
          
      const product: IProduct = request.body;

      await this.service.create(product);
      response.sendStatus(201);
    }

    @httpPut('/', 'SecurityFilterMiddleware')
    public async update(
        @request() request: express.Request,
        @response() response: express.Response) {
          
      const product: IProduct = request.body;

      await this.service.update(product);
      response.sendStatus(204);
    }

    @httpDelete('/:code', 'SecurityFilterMiddleware')
    public async delete(
        @requestParam("code") code: string,
        @response() response: express.Response) {
        
      await this.service.delete(code);
      response.sendStatus(204);
    }

}