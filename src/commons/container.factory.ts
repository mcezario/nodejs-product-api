import * as express from 'express';
import { Container } from 'inversify';
import { interfaces,  TYPE } from 'inversify-express-utils';
import { ProductController } from '../controllers/product.controller';
import { SecurityFilterMiddlewareFactory } from '../commons/security.filter.middleware';
import { IProductGateway } from '../gateways/product.gateway';
import { ProductMongoGateway } from '../gateways/product.gateway.mongodb';
import { ProductService } from '../usecases/product.service';

export class ContainerFactory {

    private constructor(){ }

    public static create() : Container {
        let container: Container = new Container();

        // note that you *must* bind your controllers to Controller
        container
            .bind<interfaces.Controller>(TYPE.Controller)
            .to(ProductController)
            .inSingletonScope()
            .whenTargetNamed(ProductController.TARGET_NAME)
        container
            .bind<IProductGateway>(ProductMongoGateway.TARGET_NAME)
            .to(ProductMongoGateway)
            .inSingletonScope()
        container
            .bind<ProductService>(ProductService.TARGET_NAME)
            .to(ProductService)
            .inSingletonScope()
        container
            .bind<express.RequestHandler>('SecurityFilterMiddleware')
            .toConstantValue(SecurityFilterMiddlewareFactory.create());    

        return container;
    }

}
