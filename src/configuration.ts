export const CurrencyAPI = {
    url: 'https://currency-api-mock.highbond-s3.com/live',
    apiKey: ''
}

export const PostgresConnection = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
}
