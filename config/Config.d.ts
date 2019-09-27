/* tslint:disable */
interface Config {
  app: string;
  port: string;
  mongodb: Mongo;
  security: Security;
}
interface Security {
  token: string;
}
interface Mongo {
  host: string;
  port: string;
  database: string;
}