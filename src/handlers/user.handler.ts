import prisma from "../models/prisma";
import { FastifyRequest, FastifyReply } from "fastify";
import pino from "pino";

const logger = pino()

export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { name, email, password, role } = request.body as any;

    const verifyUser = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (verifyUser) {
        reply.code(400).send({
            message: "User already exists"
        });
        return;
    }

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password,
            role: role
        }
    });
    return {
        message: "User created successfully",
        user: logger.info(user)
    };
    } catch (error) {
        logger.error(error)
        return reply.code(500).send({ message: "Error creating user" });
    }
}

export const updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { name, email, role } = request.body as any;

      // Verifica se o usuário existe
      const existingUser = await prisma.user.findUnique({ where: { id } });
      if (!existingUser) {
        return reply.code(404).send({ message: "User not found" });
      }

      // Atualiza os dados
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { name, email, role },
      });

      return reply.send(updatedUser);
    } catch (error) {
      return reply.code(500).send({ message: "Error updating user" });
    }
  };

export const getUsers = async (request: FastifyRequest, reply: FastifyReply) => {
    const users = await prisma.user.findMany();
    return users;
}