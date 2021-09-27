import { FastifyRequest, FastifyInstance, FastifyReply } from "fastify";
import { CurrencyAPI } from "../configuration";
import { ProductController } from "../controllers/product-controller";
import { ExchangeService } from "../services/exchange-service";
import { ProductService } from "../services/product-service";
import { CurrencyEnum } from "../types";

type ProductRequest = FastifyRequest<{
  Params: { productId: string };
  Querystring: { currency?: CurrencyEnum }
}>

const productService = new ProductService();
const exchangeService = new ExchangeService(CurrencyAPI.url);
const productController = new ProductController(productService, exchangeService);

export const productRoutes = async (app: FastifyInstance) => {
  app.get('/product/:productId', async (request: ProductRequest, reply: FastifyReply) => {
      const { productId } = request.params;
      const { currency } = request.query;
      const normalizedCurrency = currency?.toLocaleUpperCase() as CurrencyEnum ?? CurrencyEnum.USD;

      const {statusCode, error, data } = await productController.getProduct(Number(productId), { currency: normalizedCurrency });

      reply.code(statusCode);

      if (error) {
        return { error };
      }

      return data;
  })

  return app;
}