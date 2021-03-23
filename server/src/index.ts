import "reflect-metadata";
import "dotenv/config";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { createConnection } from 'typeorm';

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
            context: ({req, res}) => ({req, res})
        });
        // Create express server
        const app = express();
        apolloServer.applyMiddleware({ app });
        app.listen(process.env.PORT,() => {
            console.log(`Server listen on ${process.env.PORT}`)
        });
    } catch (error) {
        console.error(error)
    }
})()