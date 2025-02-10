import { FastifyInstance } from "fastify";
import { createUser, getUsers, updateUser } from "../handlers/user.handler";
export default async function UserRoutes(fastify: FastifyInstance) {
    fastify.post("/user/new", createUser)
    fastify.get("/user/list", getUsers)
    fastify.put("/user/update/:id", updateUser)
}