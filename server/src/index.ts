import "reflect-metadata";
import { buildSchema } from "type-graphql";

(async () => {
    try {
        const schema = await buildSchema({
            resolvers: [__dirname + "/resolvers/**/*.resolver.{ts,js}"],
        });
    } catch (error) {
        console.error(error)
    }
})()