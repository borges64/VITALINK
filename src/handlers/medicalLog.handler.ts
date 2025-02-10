import prisma from "../models/prisma";
import { FastifyRequest, FastifyReply } from "fastify";

export const createMedicalLog = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { doctorId, patientId, description, type } = request.body as any;
        const doctor = await prisma.user.findUnique({
            where: {
                id: doctorId, 
                role: "MEDIC"
            }
        })
        if(!doctor) {
            return reply.code(400).send({ message: "Only doctors can create medical logs" });
        }
        const patient = await prisma.patient.findUnique({ where: { id: patientId } })
        if(!patient) {
            return reply.code(400).send({ message: "Patient not found" });
        }	
        const medicalLog = await prisma.medicalLog.create({
            data: { doctorId, patientId, description, type }
        })
        return reply.code(201).send({
            message: "Medical log created successfully",
            data: medicalLog
        })
    } catch(error) {
        return reply.code(500).send({ message: "Error creating medical log" });
    }
}

export  const getMedicalLogs = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { patientId } = request.params as { patientId: string };
        const logs = await prisma.medicalLog.findMany({
            where: { patientId}, 
            include: {
                doctor: { select: { name: true}}
            }
        })
        return reply.send(logs)
    } catch (error) {
        return reply.code(500).send({ message: "Error getting medical logs" });
    }
}