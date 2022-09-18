import { CreateProductInput } from './product.schema'
import prisma from "../../utils/prisma"

export async function createProduct(data: CreateProductInput & { ownerId: number }) {

    return prisma.product.create({
        data
    })
}

export function getProducts() {
    return prisma.product.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            price: true,
            createdAt: true,
            updatedAt: true,
            owner: {
                select: {
                    name: true,
                    id: true,
                }
            },

        }
    })
}