import rides from './rideoffers';
import requests from './riderequests';
import user from './users';
import pool from '../config/database';

pool.query('DROP TABLE IF EXISTS friends; DROP TABLE IF EXISTS riderequests; DROP TABLE IF EXISTS rideoffers; DROP TABLE IF EXISTS users;')
  .then(() => {
    user.createTable()
      .then(() => {
        rides.createTable()
          .then(() => {
            requests.createTable();
          });
      });
  });
