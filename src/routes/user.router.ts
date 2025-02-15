import { FastifyInstance } from "fastify";
import { newUser, getAllUser, updateUser,deleteUser } from "../handlers/user.handler";
export default async function UserRoutes(fastify: FastifyInstance) {
    fastify.post("/user/new", newUser)
    fastify.get("/user/list", getAllUser)
    fastify.put("/user/update/:id", updateUser)
    fastify.delete("/user/delete/:id", deleteUser)
}