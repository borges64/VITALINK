import prisma from "../models/prisma";
import { FastifyRequest, FastifyReply } from "fastify";

export const createAppointment = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { date, userId, medicId, moreInfo} = req.body as { date: string, userId: string, medicId: string, moreInfo: string };
        
        const medic = await prisma.user.findUnique({
            where: { id: medicId }
        })

        // if(medic?.type !== "ASSISTENT" || "ADMIN" || "MEDIC") {
        //     return reply.status(400).send({ message: "Medico não identificado ou você não tem permissão para fazer agendamento"})
        // }

        const newAppointment = await prisma.appointment.create({
            data: {
                date: new Date(date),
                userId,
                medicId,
                moreInfo
            }, 
            include : {
                user: {
                    select: {
                        name: true
                    }
                },
                medic: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return reply.send(newAppointment);

    } catch (error) {
        console.log(error)
    }
}

export const getAppointments = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const appointment = await prisma.appointment.findMany({
            include : {
                user: {
                    select: {
                        name: true
                    }
                },
                medic: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return reply.send(appointment)
    } catch(error) {
        console.log(error)
    }    
}