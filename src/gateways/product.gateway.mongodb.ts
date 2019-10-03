import { injectable } from 'inversify';
import 'reflect-metadata';
import Product, { IProduct } from "../domains/product";
import { IProductGateway } from './product.gateway';
import  { MongoError } from "mongodb";
import { ProductDuplicatedException } from './product.duplicated.exception';
import { ProductNotFoundException } from './product.not.found.exception';

@injectable()
export class ProductMongoGateway implements IProductGateway {
    public static TARGET_NAME: string = 'product.mongo.gateway';

    public create(product: IProduct): Promise<IProduct> {
        return Product.create(product)
            .then((data: IProduct) => {
                return data;
            })
            .catch((error: Error) => {

                if ((error as MongoError).code == 11000) {
                    throw new ProductDuplicatedException();
                }

                throw error;
            });
    }

    public async update(product: IProduct): Promise<IProduct> {

        let id: string = await this.findByCode(product.code).then((data: IProduct) => {
            return data._id;
        });

        return Product.findOneAndUpdate({_id: id}, product, {new: true})
            .then((data: IProduct) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async findByCode(code: string): Promise<IProduct> {
        return Product.find({code: code})
            .then((data: IProduct[]) => {

                if (data == null || data[0] == undefined) {
                    throw new ProductNotFoundException();
                }
                return data[0];
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async findAll(): Promise<IProduct[]> {
        return Product.find()
            .then((data: IProduct[]) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public delete(code: string): Promise<void> {
        return Product.findOneAndDelete({code: code})
            .then(() => {
                //
            })
            .catch((error: Error) => {
                
                throw error;
            });
    }

  
}