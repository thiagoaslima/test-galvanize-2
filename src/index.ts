import fastify from "fastify";
import { productControllers } from "./controllers/productControllers";

const PORT = 3000;

const server = fastify();
server.register(productControllers);
server.listen(PORT, err => {
    if (err) console.log(err);
    console.log(`Server listening on port ${PORT}`);
});