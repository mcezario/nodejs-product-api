import * as mongoose from 'mongoose';
import { config } from 'node-config-ts';
import MongoMemoryServer from "mongodb-memory-server-core/lib/MongoMemoryServer";

export class DbConnection {
    public static async initConnection() {
        let connectionString: string = `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`;
        await DbConnection.connect(connectionString);
    }

    public static async connect(connStr: string) {

        if (process.env.NODE_ENV == "test") {

            let mongod: MongoMemoryServer = new MongoMemoryServer({
                instance: {
                    ip: config.mongodb.host,
                    port: parseInt(config.mongodb.port),
                    dbName: config.mongodb.database
                },
            });

            // ensures MongoMemoryServer is up
            await mongod.getUri();
        }

        return mongoose.connect(
            connStr,
            {useNewUrlParser: true, useFindAndModify: false},
        )
        .then(() => {
            console.log(`Successfully connected to ${connStr}`);
        })
        .catch((error) => {
            console.error("Error connecting to database: ", error);
            return process.exit(1);
        });
    }

    public static setAutoReconnect() {
        mongoose.connection.on("disconnected", () => DbConnection.connect(process.env.DB_CONN_STR));
    }

    public static async disconnect() {
       await mongoose.connection.close();
    }
}