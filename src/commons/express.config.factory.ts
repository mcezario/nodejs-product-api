import { interfaces } from "inversify-express-utils";
import * as bodyParser from "body-parser";

export class ExpressConfigFactory {

    private constructor(){ }

    public static create() : interfaces.ConfigFunction {
        
        return (app: any) => {
          app.use(bodyParser.urlencoded({
            extended: true
          }));
          app.use(bodyParser.json());
        };
    }

}