import { getClient } from "../lib/postgres-client";

export const viewCountService = {
  async increment(route: string): Promise<void> {
    const client = await getClient();

    try {
      await client.query('BEGIN')
      
      const insertRouteIfNotExists = 'INSERT INTO viewcounts VALUES ($1, 0) ON CONFLICT(ID) DO NOTHING;'
      await client.query(insertRouteIfNotExists, [route]);
      
      const updateCount = 'UPDATE viewcounts SET views = views + 1 WHERE id = $1;'
      await client.query(updateCount, [route]);

      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.end();
    }
  }
}