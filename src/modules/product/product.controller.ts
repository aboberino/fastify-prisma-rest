import { CreateProductInput } from './product.schema';
import { FastifyReply, FastifyRequest } from 'fastify'
import { createProduct, getProducts } from './product.service'

export async function createProductHandler(request: FastifyRequest<{ Body: CreateProductInput }>, reply: FastifyReply) {
    const product = await createProduct({
        ...request.body,
        ownerId: request.user.id
    })

    return product
}

export async function getProductHandler() {
    const products = await getProducts()
    return products
}
