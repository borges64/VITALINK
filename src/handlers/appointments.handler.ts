import prisma from "../models/prisma";
import { FastifyRequest, FastifyReply } from "fastify";

export const createAppointment = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { date, userId, medicId, moreInfo } = req.body as { date: string, userId: string, medicId: string, moreInfo: string };

        const medic = await prisma.user.findUnique({
            where: { id: medicId }
        })

        if (!medic || (medic.type !== "ASSISTENT" && medic.type !== "ADMIN" && medic.type !== "MEDIC")) {
            return reply.status(400).send({ message: "Medico não identificado ou você não tem permissão para fazer agendamento" });
        }

        const newAppointment = await prisma.appointment.create({
            data: {
                date: new Date(date),
                userId,
                medicId,
                moreInfo
            },
            include: {
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
            include: {
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
    } catch (error) {
        console.log(error)
    }
}

// export const deleteAppointment = async (req: FastifyRequest, reply: FastifyReply) => {
//     try {
//         const { id } = req.params as { id: any };
//         const { userId } = req.body as { userId: any };

//         // Verifica se o usuário é um médico, administrador ou assistente
//         const user = await prisma.user.findUnique({
//             where: { id: userId }
//         });

//         if (!user || (user.type !== "ASSISTENT" && user.type !== "ADMIN" && user.type !== "MEDIC")) {
//             return reply.status(403).send({ message: "Você não tem permissão para desmarcar esta consulta" });
//         }

//         const appointment = await prisma.appointment.findUnique({
//             where: { id: id }
//         });

//         if (!appointment) {
//             return reply.status(404).send({ message: "Consulta não encontrada" });
//         }

//         // Deleta a consulta
//         await prisma.appointment.delete({
//             where: { id: id }
//         });

//         return reply.send({ message: "Consulta desmarcada com sucesso" });
//     } catch (error) {
//         return console.log(error)
//     }
// }