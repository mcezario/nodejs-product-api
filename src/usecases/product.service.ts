import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { defaultTo } from "lodash";
import { IProduct } from '../domains/product';
import { IProductGateway } from '../gateways/product.gateway'
import { ProductMongoGateway } from '../gateways/product.gateway.mongodb'
import { BusinessException } from '../domains/business.exception';
import { ProductDuplicatedException } from '../gateways/product.duplicated.exception';
import { ProductNotFoundException } from '../gateways/product.not.found.exception';

@injectable()
export class ProductService {

    public static TARGET_NAME: string = 'product.service';

    constructor(
        @inject(ProductMongoGateway.TARGET_NAME)
        private gateway: IProductGateway) {}

    public async create(product: IProduct): Promise<IProduct> {

      product.dateCreation = new Date();
      
      return this.gateway.create(product)
        .then((data: IProduct) => {
          return data;
        })
        .catch((err: Error) => {
          
          console.error("Error to create the product.", err);
          
          if (err instanceof ProductDuplicatedException) {
            throw new BusinessException("C-001", "The product has already been registered.");
          }

          throw new BusinessException("C-002", "Error to create the new product.");
        });

    }

    public async update(product: IProduct): Promise<IProduct> {
      
      product.dateModification = new Date();

      return this.gateway.update(product)
        .then((data: IProduct) => {
          return data;
        })
        .catch((err: Error) => {
          
          console.error("Error to update the product.", err);
          if (err instanceof ProductNotFoundException) {
            throw new BusinessException("U-001", "Product not found.");
          }
          
          throw new BusinessException("U-002", "Error to update the new product.");
        });

    }

    public async getAll(): Promise<IProduct[]> {
      return this.gateway.findAll()
      .then((data: IProduct[]) => {
        return defaultTo(data, []).filter((p) => p.active == true);
      })
      .catch((err) => {
        throw new BusinessException("R-001", "Error to get the product list.");
      });
    }

    public async delete(code: string): Promise<void> {
      return this.gateway.delete(code)
      .then(() => {
        //
      })
      .catch((err) => {
        throw new BusinessException("D-001", "Error to delete the product.");
      });
    }

}