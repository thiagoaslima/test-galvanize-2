import fastify from "fastify";
import { productControllers } from "./controllers/productControllers";
import { startLowDb } from "./lib/lowdb-client";

const PORT = 3000;

startLowDb();

const server = fastify();
server.register(productControllers);
server.listen(PORT, err => {
    if (err) console.log(err);
    console.log(`Server listening on port ${PORT}`);
});