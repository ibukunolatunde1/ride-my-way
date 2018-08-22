import { Pool } from 'pg';
import dotenv from 'dotenv';
import config from '../config/config';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const connection = config[env];

let poolConfig;
if(connection.production_connection) {
  poolConfig = new Pool({
    connectionString: process.env[connection.production_connection],
  });
}else {
  poolConfig = new Pool(connection);
}

const pool = poolConfig;

pool.connect((err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Connected');
    }
  });

export default pool;