import prisma from "../models/prisma";
import { FastifyRequest, FastifyReply } from "fastify";
import { IUser } from "../models/models";
import pino from "pino";
import { omitBy, isUndefined } from "lodash";
import z from "zod";

const logger = pino()

export const newUser = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const data = req.body as IUser;
        const verifyUser = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })
        // if (verifyUser) {
        //     reply.code(400).send({ message: "Usuário já existente na base de dados" });
        //     return;
        // }

        // if(data.type === "ASSISTENT") {
        //     const { medicId } = req.body as any;
        //     if(!medicId) return reply.status(400).send("Assitentes devem estar associados a um médico")
        //     const medic = await prisma.user.findUnique({
        //         where: { id: medicId }
        //     })
        //     // if(!medic || medic.type !== "MEDIC") {
        //     //     return reply.status(400).send({message: "Médico não encontrado ou ID invalido"})
        //     // }
        //     const newAssistant = await prisma.assistant.create({
        //         data: {
        //             name: data.name,
        //             email: data.email,
        //             password: data.password,
        //             cpf: data.cpf,
        //             address: data.address,
        //             phone: data.phone,
        //             birthDate: data.birthDate,
        //             moreInfo: data.moreInfo,
        //             medicId: medicId
        //         }
        //     });

        //     reply.code(201).send({
        //         message: "Assistente criado com sucesso",
        //         data: newAssistant
        //     });
        //     return;
        // }

        // const newUser = await prisma.user.create({
        //     data: {
        //         name: data.name,
        //         email: data.email,
        //         password: data.password,
        //         type: data.type || "USER",
        //         cpf: data.cpf,
        //         address: data.address,
        //         phone: data.phone,
        //         birthDate: data.birthDate,
        //         moreInfo: data.moreInfo,
        //     }
        // })
        // reply.code(201).send({
        //     message: "Usuário criado com sucesso",
        //     data: newUser
        // })
    } catch (error) {
        logger.error(error)
    }
}

export const getAllUser = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const getAllUser = await prisma.user.findMany()
        console.log("LOADING ALL USERS... AWAIT PLEASE")
        reply.send(getAllUser)
    } catch (error) {
        logger.error(error)
    }
}

// Esquema de validação
const updateUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    type: z.enum(["ADMIN", "USER", "PATIENT", "MEDIC", "ASSISTENT"]).optional(),
    cpf: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    birthDate: z.string().optional(), // Se estiver em formato ISO
    moreInfo: z.string().optional(),
});

export const updateUser = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { id } = req.params as any;
        console.log(id)
        const userExists = await prisma.user.findUnique({ where: { id: id } });
        console.log(userExists)
        if (!userExists) {
            return reply.status(404).send({ message: "User not found" });
        }
        // Valida os dados da requisição
        const parsedData = updateUserSchema.parse(req.body);
        const data = req.body as IUser;
        // Remove campos undefined
        const sanitizedData = omitBy(parsedData, isUndefined);

        await prisma.user.update({
            where: {
                id: id
            },
            data: sanitizedData,
        })
        reply.send("User updated successfully")
    } catch (error) {
        logger.error(error)
    }
}
export const deleteUser = async (req: FastifyRequest, reply: FastifyReply) => {
    try { 
        const { id } = req.params as any;
        const userExists = await prisma.user.findUnique({ where: { id: id } });
        
        if (!userExists) {
            return reply.status(404).send({ message: "User not found" });
        }
        await prisma.user.delete({
            where: {
                id: id
            }
        })
        console.log("USUARIO DELETADO COM SUCESSO")
        reply.send("User deleted successfully")
    } catch (error) {
        logger.error(error)
    }
}