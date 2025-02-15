import Fastify from "fastify"
import UserRoutes from "./routes/user.router";
// import { appointmentRoutes } from "./routes/appointment.router";

const server = Fastify();

server.register(UserRoutes)
// server.register(appointmentRoutes)

server.listen({
    port: 3000
}, (err, address) => {
    if(err) {
        console.log(err);
        process.exit(1)
    }
    console.log(`Server online ✅ - ${address}`)
})