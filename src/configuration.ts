import * as dotenv from "dotenv";
dotenv.config();

export const CurrencyAPI = {
    url: 'https://currency-api-mock.highbond-s3.com/live',
    apiKey: ''
}

export const PostgresConnection = {
    user: process.env.PGUSER as string,
    host: process.env.PGHOST as string,
    database: process.env.PGDATABASE as string,
    password: process.env.PGPASSWORD as string,
    port: Number(process.env.PGPORT),
}
