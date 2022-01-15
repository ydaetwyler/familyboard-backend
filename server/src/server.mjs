import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { makeExecutableSchema } from '@graphql-tools/schema'

import typeDefs from './schema/schema.mjs'
import resolvers from './resolvers/resolvers.mjs'

import connect from './utils/db.mjs'
import Auth from './utils/Auth.mjs'
import AuthSubscription from './utils/AuthSubscription.mjs'

dotenv.config()

// Connect to MongoDB
connect()

const app = express()

const frontBaseUrl = process.env.FRONT_BASE_URL

const corsOptions = {
    credentials: true,
    origin: frontBaseUrl
}

app.use(cookieParser())

const httpServer = createServer(app)

const schema = makeExecutableSchema({ typeDefs, resolvers })

const subscriptionServer = SubscriptionServer.create(
    { 
        schema, 
        execute, 
        subscribe,
        onConnect(connectionsParams, webSocket, context) {
            AuthSubscription(webSocket) 
        }        
    },
    { 
        server: httpServer, 
        path: '/dashboard' 
    }
)

const server = new ApolloServer({ 
    schema,
    formatError: (err) => {
        // Don't give the specific errors to the client
        if (err.message.startsWith('Database Error: ')) {
            return new Error('Internal server error');
        }
        if (err.message.startsWith('Mongo')) {
            return new Error('Internal server error');
        }
        // Otherwise return the original error
        return err;
    },
    cors: corsOptions,
    context: ({ req, connection }) => {
        if (connection) {
            return connection.context
        } else {
            return Auth({ req })
        }
    },
    playground: process.env.NODE_ENV === 'development' ? true : false,
    introspection: true,
    tracing: true,
    path: '/',
    plugins: [{
        async serverWillStart() {
            return {
                async drainServer() {
                    subscriptionServer.close()
                }
            }
        }
    }]
})

await server.start()

server.applyMiddleware({
    app,
    path: '/dashboard',
    cors: corsOptions,
    onHealthCheck: () => {
        new Promise((resolve, reject) => {
            (mongoose.connection.readyState > 0)
            ? resolve()
            : reject()
        })
    }
})

httpServer.listen({ port: process.env.PORT }, () => {
    console.log(`
        🚀  Server is running!
        🔉  Listening on port ${process.env.PORT}
        📭  Query at https://studio.apollographql.com/dev
    `)
})
