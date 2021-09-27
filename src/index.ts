import fastify from "fastify";
import { productRoutes } from "./routes/product-routes";
import { viewCountService } from "./services/view-count-service";

const PORT = 3000;

const server = fastify();
server.register(productRoutes);

server.listen(PORT, err => {
    if (err) console.log(err);
    console.log(`Server listening on port ${PORT}`);
});