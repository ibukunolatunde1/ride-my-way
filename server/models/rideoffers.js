import pool from '../config/database';

class RideOffers {
  static createTable() {
    const queryString = `
            CREATE TABLE rideoffers (
            rideid SERIAL PRIMARY KEY,
            userid INTEGER REFERENCES users(userid),
            origin VARCHAR(255) NOT NULL,
            destination VARCHAR(255) NOT NULL,
            date VARCHAR(15) NOT NULL,
            time VARCHAR(15) NOT NULL,
            slots INTEGER NOT NULL,
            message TEXT,
            initializedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE UNIQUE INDEX IF NOT EXISTS rideoffers_idx
            on rideoffers ("userid", "origin", "destination", "date", "time", "slots", "message");
        `;

    return new Promise((resolve, reject) => {
      console.log('Preparing to Create the Ride Offers table....');
      pool.query(queryString)
        .then(() => {
          resolve(console.log('Ride Offers Table has been created successfully'));
        })
        .catch((err) => {
          if (err.code === '42P01') {
            reject(console.log('Table has already been created'));
          }
          console.log('Table could not be created');
        });
    });
  }

  constructor(userid, origin, destination, date, time, slots, message) {
    this.userid = userid;
    this.origin = origin;
    this.destination = destination;
    this.date = date;
    this.time = time;
    this.slots = slots;
    this.message = message;
  }

  insert() {
    const data = this;
    const queryString = {
      text: 'INSERT INTO rideoffers (userid, origin, destination, date, time, slots, message) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING rideid',
      values: [data.userid, data.origin, data.destination, data.date, data.time, data.slots, data.message],
    };

    console.log('Inserting ride into the database');
    return new Promise((resolve, reject) => {
      pool.query(queryString)
        .then((result) => {
          data.rideid = result.rows[0].rideid;
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  static getAll() {
    const queryString = 'SELECT * FROM rideoffers';
    return new Promise((resolve, reject) => {
      pool.query(queryString)
        .then((results) => {
          resolve(results.rows);
        })
        .catch((error) => {
          console.error(error.code);
          reject(error);
        });
    });
  }

  static findBy(rideid) {
    const queryString = {
      text: 'SELECT * FROM rideoffers WHERE rideid = $1',
      values: [rideid],
    };
    return new Promise((resolve, reject) => {
      pool.query(queryString)
        .then((results) => {
          resolve(results.rows[0]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findByAnd(userid, rideid) {
    const queryString = {
      text: 'SELECT * FROM rideoffers WHERE userid = $1 AND rideid = $2',
      values: [userid, rideid],
    };
    return new Promise((resolve, reject) => {
      pool.query(queryString)
        .then((results) => {
          resolve(results.rows[0]);
        })
        .catch(err => reject(err));
    });
  }

  static delete(rideid) {
    const queryString = {
      text: 'DELETE FROM rideoffers WHERE rideid = $1',
      values: [rideid],
    };

    pool.query(queryString)
      .then(() => {
        console.log(`Ride at ID ${rideid} has been deleted`);
      });
  }
}

export default RideOffers;
