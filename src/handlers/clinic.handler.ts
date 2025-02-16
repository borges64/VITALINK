import prisma from "../models/prisma";
import { FastifyRequest, FastifyReply } from "fastify";

export const newClinic = async (req: FastifyRequest, reply: FastifyReply) => {
    const data = req.body as any
    const verifyClinic = await prisma.clinic.findMany({
        where: {
            cnpj: data.cnpj
        }
    })
    if(!verifyClinic) {
        return reply.status(400).send("Clínica já existente na base de dados")        
    }
    const newClinic = await prisma.clinic.create({
        data: {
            name: data.name,
            cnpj: data.cnpj,
            address: data.address,
            phone: data.phone,
            email: data.email,
            moreInfo: data.moreInfo
        }
    })
    console.log("CLINICA CRIADA COM SUCESSO")
    return reply.status(201).send({
        data: newClinic,
        message: "Clínica criada com sucesso"
    })
}