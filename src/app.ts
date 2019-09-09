import "reflect-metadata";

import { ApolloServer } from "apollo-server";
import { lexicographicSortSchema, separateOperations } from "graphql";
import { fieldConfigEstimator, getComplexity, simpleEstimator } from "graphql-query-complexity";
import { buildSchema, buildSchemaSync } from "type-graphql";
import { HumanResolver } from "./resolver/human";

const complexityLimit = 100;

const schema = lexicographicSortSchema(buildSchemaSync({
    resolvers: [HumanResolver],
    emitSchemaFile: true,
}));

const server = new ApolloServer({
    introspection: true,
    playground: true,
    schema,
    plugins: [
        {
            requestDidStart: () => ({
                didResolveOperation({ request, document }) {
                    const complexity = getComplexity({
                        schema,
                        query: request.operationName ?
                            separateOperations(document)[request.operationName] :
                            document,
                        variables: request.variables,
                        estimators: [
                            fieldConfigEstimator(),
                            simpleEstimator({ defaultComplexity: 2 }),
                        ],
                    });
                    if (complexity > complexityLimit) {
                        throw new Error(`Too complicated query. Complexity: ${complexity}`);
                    }
                    global.console.log(`Used complexity: ${complexity}`);
                },
            }),
        },
    ],
});

server.listen(12345);
