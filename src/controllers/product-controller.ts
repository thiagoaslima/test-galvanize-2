import { ExchangeService } from "../services/exchange-service";
import { ProductService } from "../services/product-service";
import { CurrencyEnum, Product } from "../types";

export class ProductController {
    constructor(
        private productService: ProductService,
        private exchangeService: ExchangeService
    ) { }

    async getProduct(
        productId: number,
        { currency }: { currency: CurrencyEnum }
    ): Promise<{ statusCode: number, error?: string, data?: Product & { currency: CurrencyEnum } }> {
        if (Number.isNaN(productId)) {
            return {
                statusCode: 422,
                error: `The productId parameter is invalid.`
            };
        }

        if (!ExchangeService.isValidCurrency(currency)) {
            return {
                statusCode: 422,
                error: `The currency parameter is invalid.`
            };
        }

        let product;

        try {
            product = await this.productService.getProductById(productId);
        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                error: `Unable to get the product. Please, try again later.`
            };
        }

        if (!product) {
            return {
                statusCode: 404,
                error: `No product found.`
            };
        }

        let convertedPrice: number;

        try {
            convertedPrice = await this.exchangeService.convertPrice(product.price, currency);
        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                error: `Unable to calculate the price on the specified currency. Please try again later.`
            };
        }

        return {
            statusCode: 200,
            data: {
                ...product,
                price: Math.round(convertedPrice * 100) / 100,
                currency
            }
        }
    }
}

