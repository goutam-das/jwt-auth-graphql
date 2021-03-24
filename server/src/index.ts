import "reflect-metadata";
import "dotenv/config";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { refreshToken } from './routers/refreshToken';

(async () => {
    try {
        // DB Connection
        await createConnection();
        console.log('DB Connected!');
        // Build GraphQL schema
        const schema = await buildSchema({
            resolvers: [__dirname + "/resolvers/**/*.resolver.{ts,js}"],
        });
        // Create ApolloServer
        const apolloServer = new ApolloServer({
            schema,
            context: ({ req, res }) => ({ req, res })
        });
        // Create express server
        const app = express();
        // Middlewares
        app.use(cookieParser());
        // cors
        app.use(cors({
            origin: '',
            credentials: true
        }));
        // Express routes
        app.post('/refresh_token', refreshToken);
        // Apollo server middlewares
        apolloServer.applyMiddleware({ app, cors: false });
        app.listen(process.env.PORT, () => {
            console.log(`Server listen on ${process.env.PORT}`)
        });
    } catch (error) {
        console.error(error)
    }
})()