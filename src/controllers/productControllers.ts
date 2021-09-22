import { FastifyInstance } from "fastify";

export const productControllers = async (app: FastifyInstance) => {
    console.log('TEST');
    return app;
}