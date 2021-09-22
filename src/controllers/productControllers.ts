import fetch from "cross-fetch";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CurrencyAPI } from "../configuration";
import { getLowDbClient } from "../lib/lowdb-client";
import { getClient } from "../lib/postgres-client";
import { CurrencyEnum, Product, ViewCounts } from "../types";

type ProductRequest = FastifyRequest<{
    Params: { productId: string, currency?: CurrencyEnum };
}>

const getProductById = async (productId: string): Promise<Product | null> => {
    let client;

    try {
        client = await getClient();
        const response = await client.query<Product>({
            name: 'find-product-by-id',
            text: 'SELECT * FROM products WHERE id = $1',
            values: [productId]
        });
        const model = response?.rows[0];
        return model ?? null;
    } finally {
        client?.end();
    }
}

const getExchangeRateKey = (currency: CurrencyEnum) => `USD${currency}`;

const getExchangeRate = async (currency: CurrencyEnum): Promise<number> => {
    if (currency === CurrencyEnum.USD) {
        return 1;
    }

    try {
        const response = await fetch(CurrencyAPI.url)
        const data = await response.json();
        const key = getExchangeRateKey(currency);
        const rate = data.quotes[key];
        
        return rate;
    } catch {
        throw new Error('Unable to get exchange rate.')
    }
}

const incrementViewCounts = async (productId: string) => {
    const lowDb = getLowDbClient();

    await lowDb.read();
    const data = lowDb.getState();
    
    data.viewCounts[productId] = data.viewCounts[productId] ?? 0;
    data.viewCounts[productId] += 1;

    await lowDb.write();
}

export const productControllers = async (app: FastifyInstance) => {
    const productRoutes = [
        '/product/:productId',
        '/product/:productId/:currency'
    ];

    productRoutes.forEach(route => {
        app.get(route, async (request: ProductRequest, reply: FastifyReply) => {
            const { productId, currency } = request.params;
            const normalizedCurrency = currency ? currency.toLocaleUpperCase() as CurrencyEnum : CurrencyEnum.USD;

            if (currency && !Object.keys(CurrencyEnum).includes(normalizedCurrency)) {
                reply.code(422);
                return { error: `The currency parameter is invalid.` };
            }

            let product;
            
            try {
                product = await getProductById(productId);
            } catch(error) {
                console.error(error);
                reply.code(500);
                return { error: `Unable to get the product. Please, try again later.` };
            }

            if (!product) {
                reply.code(404);
                return { error: `No product found.` };
            }

            let exchangeRate: number;

            try {
                exchangeRate = await getExchangeRate(normalizedCurrency);
            } catch (error) {
                console.error(error);
                reply.code(500);
                return { error: `Unable to calculate the price on this currency. Please try again later.` };
            }

            // Only increment if the product is shown correctly
            incrementViewCounts(productId);

            reply.code(200);
            return {
                ...product,
                price: Math.round(product.price * exchangeRate * 100) / 100,
                currency: normalizedCurrency
            }
        })
    })

    return app;
}