import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  development: {
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.PASSWORD,
    port: process.env.MY_PORT,
  },
  test: {
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DB_TEST,
    password: process.env.PASSWORD,
    port: process.env.MY_PORT,
  },
  production: {
    production_connection: 'DATABASE_URL',
  },
};

export default dbConfig;
