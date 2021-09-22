import { Client } from 'pg';
import { PostgresConnection } from '../configuration';

const getClient = async () => {
  const client = new Client(PostgresConnection);
  await client.connect();
  return client;
}

export { getClient };
