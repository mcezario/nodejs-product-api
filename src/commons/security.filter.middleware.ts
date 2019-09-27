import { config } from 'node-config-ts';

export class SecurityFilterMiddlewareFactory {

    private constructor(){ }

    public static create() : any {
        
        return (req: any, res: any, next: any) => {
            let token: string = req.headers["authorization"];
            
            if (config.security.token !== token) {
                res.status(401).json();
                return;
            }
            
            next();
        }

    }

}