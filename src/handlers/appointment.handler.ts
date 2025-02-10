import { P } from "pino";
import prisma from "../models/prisma";
import { FastifyRequest, FastifyReply } from "fastify";
import { request } from "http";

export const createAppointment = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        console.log("CRIANDO CONSULTA")
        const { doctorId, patientId, date } = request.body as any;
        const doctor = await prisma.user.findUnique({
            where: {
                id: doctorId
            }
        })
        console.log(doctor)
        if(!doctor) {
            return reply.code(400).send({ message: "Doctor not found" });
        }
        const patient = await prisma.user.findUnique({
            where: {
                id: patientId
            }
        })
        console.log(patient)
        if(!patient) {
            return reply.code(400).send({ message: "Patient not found" });
        }
        const appointment = await prisma.scheduledConsultation.create({
            data: {
                doctorId,
                patientId,
                date, 
                status: "SCHEDULED"
            }
        })
        console.log("AINDA NADA?")
        console.log("Consulta agendada com sucesso")
        return reply.code(201).send({
            data: appointment,
            message: "Appointment created successfully"
        });
    } catch (error) {
        return reply.code(500).send({ message: "Error creating appointment" });
    }
}

export const getAllAppointments = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const appointments = await prisma.scheduledConsultation.findMany({
            include: {
                doctor: {
                    select: { name: true },
                },
                patient: {
                    select: {   name: true }
                }
            }
        })
        return reply.send(appointments)
    } catch (error) {
        return reply.code(500).send({ message: "Error getting appointments" });
    }
}

export const cancelAppointment = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { id } = request.params as { id: string };
        const appointment = await prisma.scheduledConsultation.findUnique({
            where: { id}
        })
        if(!appointment) {
            return reply.code(404).send({ message: "Appointment not found" });
        }
        await prisma.scheduledConsultation.update({
            where: { id}, 
            data: { status: "CANCELED" }
        })
        return reply.send({ message: "Appointment canceled successfully" });
    } catch (error) {
        return reply.code(500).send({ message: "Error canceling appointment" });
    }
}

export const completedAppointment = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { id } = request.params as { id: string };
        const appointment = await prisma.scheduledConsultation.findUnique({
            where: { id }
        })
        if(!appointment) {
            return reply.code(404).send({ message: "Appointment not found" });
        }
        await prisma.scheduledConsultation.update({
            where: { id }, 
            data: { status: "COMPLETED" }
        })
    } catch (error) {
        return reply.code(500).send({ message: "Error completing appointment" });
    }
}