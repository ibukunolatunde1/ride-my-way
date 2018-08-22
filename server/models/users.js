import pool from '../config/database';

class User {
  static createTable() {
    const queryString = `
        CREATE TABLE users (
            userid SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            initializedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `;

    return new Promise((resolve, reject) => {
      console.log('Preparing to Create the Users table....');
      pool.query(queryString)
        .then(() => {
          resolve(console.log('User Table has been created successfully'));
        })
        .catch((err) => {
          if (err.code === '42P01') {
            reject(console.log('Table has already been created'));
          }
          console.log('Table could not be created');
        });
    });
  }

  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  insert() {
    const data = this;
    const queryString = {
      text: 'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING userid',
      values: [data.name, data.email, data.password],
    };
    console.log(`Inserting User ${data.email} into the database`);
    return new Promise((resolve, reject) => {
      pool.query(queryString)
        .then((result) => {
          data.id = result.rows[0].userid;
          resolve(data);
        })
        .catch(err => reject(err));
    });
  }

  // Must Be email or userid
  static findBy(type, value) {
    const query = {
      text: `SELECT * FROM users WHERE ${type} = $1`,
      values: [value],
    };

    if (type === 'email' || type === 'userid') {
      return new Promise((resolve, reject) => {
        pool.query(query)
          .then((res) => {
            resolve(res.rows);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  }
}

export default User;
