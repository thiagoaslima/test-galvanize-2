import fastify from "fastify";
import { productRoutes } from "./routes/product-routes";
import { viewCountService } from "./services/view-count-service";

const PORT = 3000;

const server = fastify();
server.register(productRoutes);

server.addHook('onSend', (request, reply, payload, done) => {
    const route = request.url.split('?')[0];
    const successRoute = reply.statusCode >= 200 && reply.statusCode < 300;

    if (route && successRoute) {
        viewCountService.increment(route);
    }

    done(null, payload);
})

server.listen(PORT, err => {
    if (err) console.log(err);
    console.log(`Server listening on port ${PORT}`);
});