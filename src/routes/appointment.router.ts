import { FastifyInstance } from 'fastify';
import { createAppointment, getAppointments } from '../handlers/appointments.handler';

export async function appointmentRoutes(fastify: FastifyInstance) {
    fastify.post('/appointments/new', createAppointment);
    fastify.get('/appointments/get', getAppointments)
}