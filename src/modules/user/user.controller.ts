import { FastifyReply, FastifyRequest } from "fastify"
import { server } from "../../app"
import { verifyPassword } from "../../utils/hash"
import { CreateUserInput, LoginRequest } from './user.schema'
import { createUser, findUserByEmail, findUsers } from "./user.service"

export async function registerUserHandler(request: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) {
    const body = request.body

    try {
        const user = await createUser(body)
        return reply.code(201).send(user)
    } catch (e) {
        console.log(e)
        return reply.code(500).send(e)
    }
}

export async function loginHandler(request: FastifyRequest<{ Body: LoginRequest }>, reply: FastifyReply) {
    const body = request.body

    const user = await findUserByEmail(body.email)

    if (!user) {
        return reply.code(401).send({ message: 'Invalid email or password' })
    }

    const correctPassword = verifyPassword({
        testingPassword: body.password,
        salt: user.salt,
        hash: user.password
    })

    if (correctPassword) {
        const { password, salt, ...rest } = user

        return { accessToken: server.jwt.sign(rest) }
    }


    return reply.code(401).send({ message: 'Invalid email or password' })
}

export async function getUsersHandler(){
    const users = await findUsers()
    return users
}