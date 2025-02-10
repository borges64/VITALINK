import { FastifyInstance } from 'fastify';
import { createAppointment, getAllAppointments, completedAppointment, cancelAppointment } from '../handlers/appointment.handler';

export async function appointmentRoutes(fastify: FastifyInstance) {
    fastify.post('/appointments', createAppointment);
    fastify.get('/appointments', getAllAppointments);
    fastify.put('/appointments/:id/completed', completedAppointment);
    fastify.put('/appointments/:id/cancel', cancelAppointment);
}