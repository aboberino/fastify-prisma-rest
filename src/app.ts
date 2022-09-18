import Fastify, { FastifyReply, FastifyRequest } from "fastify"
import fjwt, { JWT } from "@fastify/jwt"
import swagger from '@fastify/swagger'
import { withRefResolver } from "fastify-zod"
import userRoutes from "./modules/user/user.route"
import productRoutes from "./modules/product/product.route"
import { userSchemas } from "./modules/user/user.schema"
import { productSchemas } from "./modules/product/product.schema"
import { version } from '../package.json'

export const server = Fastify()

declare module 'fastify' {
    export interface FastifyInstance {
        authenticate: any
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: {
            id: number
            email: string,
            name: string,
        }
    }
}

server.register(fjwt, {
    secret: 'nabzn6be0vrfef4eFE848f484ef48oer440iuE8f988z89f7e7Ff1eZFEZ0f'
})

server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify()
    } catch (e) {
        return reply.send(e)
    }
})

server.get('/healthcheck', async () => {
    return { status: 'ok' }
})

async function main() {
    
    for (const schema of [...userSchemas, ...productSchemas]) {
        server.addSchema(schema)
    }

    server.register(swagger, withRefResolver({
        routePrefix: '/docs',
        exposeRoute: true,
        staticCSP: true,
        openapi: {
            info: {
                title: 'Fastify API',
                description: 'API documentation',
                version: version
            }
        }
    }))

    server.register(userRoutes, { prefix: 'api/users' })
    server.register(productRoutes, { prefix: 'api/products' })
    
    try {
        await server.listen({port: 3000, host: '0.0.0.0'})
        console.log('Server running on port 3000')
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

main()