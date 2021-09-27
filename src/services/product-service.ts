import { Product } from "../types";
import { getClient } from "../lib/postgres-client";

export class ProductService {
  async getProductById(productId: number): Promise<Product | null> {
    let dbClient;

    try {
      dbClient = await getClient();
      const response = await dbClient.query<Product>({
        name: 'find-product-by-id',
        text: 'SELECT * FROM products WHERE id = $1',
        values: [productId]
      });
      const model = response?.rows[0];
      return model ?? null;
    } finally {
      dbClient?.end();
    }
  }
}