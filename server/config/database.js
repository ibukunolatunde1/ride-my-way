import { Client } from 'pg';
import dotenv from 'dotenv';
import config from './config';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const connection = config[env];

let poolConfig;
if (connection.production_connection) {
  poolConfig = new Client({
    connectionString: process.env[connection.production_connection],
  });
} else {
  poolConfig = new Client(connection);
}

const pool = poolConfig;

pool.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected To DB');
  }
});

export default pool;
