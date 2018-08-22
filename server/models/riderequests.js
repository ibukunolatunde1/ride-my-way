import pool from '../config/database';

class RideRequests {
  static createTable() {
    const queryString = `
        DROP TYPE IF EXISTS status;
        CREATE TYPE status AS ENUM ('pending', 'approved', 'declined');
        CREATE TABLE riderequests (
        requestid SERIAL PRIMARY KEY,
        requeststatus status DEFAULT('pending'),
        userid INTEGER REFERENCES users(userid),
        rideid INTEGER REFERENCES rideoffers(rideid),
        initializedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(userid,rideid)
        );
        `;

    return new Promise((resolve, reject) => {
      console.log('Preparing to Create the Ride Request table....');
      pool.query(queryString)
        .then(() => {
          resolve(console.log('Ride Request Table has been created successfully'));
        })
        .catch((err) => {
          if (err.code === '42P01') {
            reject(console.log('Table has already been created'));
          }
          console.log('Table could not be created');
        });
    });
  }

  constructor(userId, rideId) {
    this.userId = userId;
    this.rideId = rideId;
  }

  insert() {
    const data = this;
    const queryString = {
      text: 'INSERT INTO riderequests (userid, rideid) VALUES($1, $2) RETURNING requestid',
      values: [data.userId, data.rideId],
    };

    console.log('Inserting ride request into the database');
    return new Promise((resolve, reject) => {
      pool.query(queryString)
        .then((result) => {
          data.requestId = result.rows[0].requestid;
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  static findBy(rideId) {
    const queryString = {
      text: 'SELECT * FROM riderequests WHERE rideid = $1',
      values: [rideId],
    };
    return new Promise((resolve, reject) => {
      pool.query(queryString)
        .then((results) => {
          resolve(results.rows);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // Can either be approved or rejected --- computer sets it to PENDING by default
  static verify(requestStatus, requestId) {
    const queryString = {
      text: 'UPDATE riderequests SET requeststatus = $1 WHERE requestid = $2 RETURNING requestid, requeststatus, userid, rideid ',
      values: [requestStatus, requestId],
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
}

export default RideRequests;
