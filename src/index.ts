import 'reflect-metadata';
import { config } from 'node-config-ts';
import { ContainerFactory } from './commons/container.factory';
import { ErrorHandlerFactory } from './commons/error.handler.config.factory';
import { ExpressConfigFactory } from './commons/express.config.factory';
import { InversifyExpressServer } from 'inversify-express-utils';
import { DbConnection } from "./commons/mongodb.connection";

// create server
const server = new InversifyExpressServer(ContainerFactory.create(), null, { rootPath: '/api/products' });
server.setConfig(ExpressConfigFactory.create());
server.setErrorConfig(ErrorHandlerFactory.create());

const app: any = server.build();
app.listen(config.port, function () {
  console.info('Server is listening on port {}', config.port);
});

export default app;

DbConnection.initConnection().then((mongod) => {
    DbConnection.setAutoReconnect();
});