import 'reflect-metadata';
import { IProduct } from '../domains/product';

export interface IProductGateway {
    
    create(movie: IProduct): Promise<IProduct>;

    update(movie: IProduct): Promise<IProduct>;

    findAll(): Promise<IProduct[]>;

    findByCode(code: string): Promise<IProduct>;

    delete(code: string): Promise<void>;

}