import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import app from '../app';
import user from '../models/users';

chai.use(chaiHttp);

dotenv.config();

let token;
let myToken;
let otherToken;

describe('User Routes API', () => {
  describe('User Sign Up', () => {
    describe('When passed incomplete data', () => {
      it('Should not create a new user when name field is missing', (done) => {
        const myUser = {
          email: 'eden@hazard.com',
          password: 'edenHazard',
        };
        request(app)
          .post('/user/signup')
          .send(myUser)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(Object.keys(res.body.errors).length).to.be.above(0);
            expect(res.body.errors).to.include({ name: 'name is required' });
            done();
          });
      });

      it('Should not create a new user when email field is missing', (done) => {
        const myUser = {
          name: 'Eden',
          password: 'edenHazard',
        };
        request(app)
          .post('/user/signup')
          .send(myUser)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(Object.keys(res.body.errors).length).to.be.above(0);
            expect(res.body.errors).to.include({ email: 'email is required' });
            done();
          });
      });

      it('Should not create a new user when password field is missing', (done) => {
        const myUser = {
          name: 'Eden',
          email: 'eden@hazard.com',
        };
        request(app)
          .post('/user/signup')
          .send(myUser)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(Object.keys(res.body.errors).length).to.be.above(0);
            expect(res.body.errors).to.include({ password: 'password is required' });
            done();
          });
      });

      it('Should not create a new user when fields is blank / !matching-regex', (done) => {
        const myUser = {
          name: 'E',
          email: 'edenhazard.com',
          password: 'eden',
        };
        request(app)
          .post('/user/signup')
          .send(myUser)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(Object.keys(res.body.errors).length).to.be.above(0);
            expect(res.body.errors).to.include({
              name: 'Name is required to be only letters and greater than 2 letters',
              email: 'Enter a valid Email Address',
              password: 'Password is required to be only letters and greater than 2 letters',
            });
            done();
          });
      });
    });

    describe('When Passed Valid Data', () => {
      it('Should create new user when all details have been correctly inputed', (done) => {
        const myUser = {
          name: 'Eden',
          email: 'eden@hazard.com',
          password: 'edenHazard',
        };
        request(app)
          .post('/user/signup')
          .send(myUser)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.errors).to.equal(undefined);
            expect(res.body.message).to.equal('User has been created');
            expect(res.body.User).to.include({
              name: 'Eden',
              email: 'eden@hazard.com',
            });
            expect(res.body.Token).to.be.a('string');
            done();
          });
      });

      it('Should not create new user if email already exists', (done) => {
        const myUser = {
          name: 'Eden',
          email: 'eden@hazard.com',
          password: 'edenHazard',
        };
        request(app)
          .post('/user/signup')
          .send(myUser)
          .end((err, res) => {
            expect(res.status).to.equal(409);
            expect(res.body.errors).to.equal(undefined);
            expect(res.body.message).to.equal('Mail already exists');
            done();
          });
      });
    });
  });

  describe('User Sign In Routes', () => {
    describe('When passed incomplete data', () => {
      it('Should not log the user in when email field is missing', (done) => {
        const myUser = {
          password: 'edenHazard',
        };
        request(app)
          .post('/user/login')
          .send(myUser)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(Object.keys(res.body.errors).length).to.be.above(0);
            expect(res.body.errors).to.include({ email: 'email is required' });
            done();
          });
      });
    });

    describe('When passed complete data', () => {
      it('Should not log the user in if email is incorrect', (done) => {
        const myUser = {
          email: 'hazard@eden.com',
          password: 'edenHazard',
        };
        request(app)
          .post('/user/login')
          .send(myUser)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body).to.include({ message: 'Wrong Email - Auth Failed' });
            done();
          });
      });

      it('Should not log the user in if password is incorrect', (done) => {
        const myUser = {
          email: 'eden@hazard.com',
          password: 'edenHazardous', // If Password is less than 8, it will bring the 400 error - Password must be > 8; Hence 'edenHazardous'
        };
        request(app)
          .post('/user/login')
          .send(myUser)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body).to.include({ message: 'Wrong Password - Auth Failed' });
            done();
          });
      });

      it('Should log the user in once details are correct', (done) => {
        const myUser = {
          email: 'eden@hazard.com',
          password: 'edenHazard',
        };
        request(app)
          .post('/user/login')
          .send(myUser)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.include({ message: 'Email Found and Password Matches' });
            expect(res.body.Token).to.be.a('string');
            token = res.body.Token;
            myToken = `Bearer ${token}`;
            done();
          });
      });
    });
  });
});

describe('Ride Offer Routes API', () => {
  describe('Getting rides from an empty ride table', () => {
    it('Should return a NO RIDES YET for getting all rides', (done) => {
      request(app)
        .get('/rides')
        .set('Authorization', myToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('There are no available rides yet');
          done();
        });
    });
  });

  describe('Creating a new Ride', () => {
    describe('When Passed Incomplete Data', () => {
      it('Should not create a new ride if any required field is missing', (done) => {
        const ride = {
          origin: 'Chelsea',
          slots: '3',
          message: 'Getting food',
        };
        request(app)
          .post('/rides')
          .set('Authorization', myToken)
          .send(ride)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(Object.keys(res.body.errors).length).to.be.above(0);
            expect(res.body.errors).to.include({
              destination: 'destination is required',
              date: 'date is required',
              time: 'time is required',
            });
            done();
          });
      });
    });
    describe('When Passed Valid Data', () => {
      it('Should not create a new ride if field are blank/ !matching regex', (done) => {
        const ride = {
          origin: '     ',
          destination: 'Fulham',
          date: '31/04/2018',
          time: '13:00PM',
          slots: 'Hello',
          message: 'Getting food',
        };
        request(app)
          .post('/rides')
          .set('Authorization', myToken)
          .send(ride)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(Object.keys(res.body.errors).length).to.be.above(0);
            expect(res.body.errors).to.include({
              origin: 'Origin is required to be only letters and greater than 2 letters',
              date: 'Enter a valid date(dd/mm/yyyy)',
              time: 'Enter a valid time(hh:mmAM/PM)',
              slots: 'Enter a Number',
            });
            done();
          });
      });
      it('Should create a new ride once all details are correct', (done) => {
        const ride = {
          origin: 'Chelsea',
          destination: 'Fulham',
          date: '30/04/2018',
          time: '12:00PM',
          slots: '2',
          message: 'Getting food',
        };
        request(app)
          .post('/rides')
          .set('Authorization', myToken)
          .send(ride)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.message).to.equal('Ride has been created');
            expect(res.body.Ride).to.include({
              rideId: 1,
              userId: 1,
              origin: 'Chelsea',
              destination: 'Fulham',
              date: '30/04/2018',
              time: '12:00PM',
              slots: '2',
              message: 'Getting food',
            });
            done();
          });
      });
      it('Should not create a ride that already exists by same user', (done) => {
        const ride = {
          origin: 'Chelsea',
          destination: 'Fulham',
          date: '30/04/2018',
          time: '12:00PM',
          slots: '2',
          message: 'Getting food',
        };
        request(app)
          .post('/rides')
          .set('Authorization', myToken)
          .send(ride)
          .end((err, res) => {
            expect(res.status).to.equal(500);
            expect(res.body.message).to.equal('Ride has been created already by you');
            done();
          });
      });
    });
  });

  describe('Getting Rides', () => {
    describe('Get Ride at ID', () => {
      it('return ride at existing rideID', (done) => {
        request(app)
          .get('/rides/1')
          .set('Authorization', myToken)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('Success');
            done();
          });
      });
      it('return error if ID isNaN', (done) => {
        request(app)
          .get('/rides/aa')
          .set('Authorization', myToken)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('You need to enter integer');
            done();
          });
      });
      it('return error if No Ride at ID', (done) => {
        request(app)
          .get('/rides/3')
          .set('Authorization', myToken)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('There is no ride at this ID');
            done();
          });
      });
    });

    describe('Get all Rides', () => {
      it('return all rides', (done) => {
        request(app)
          .get('/rides')
          .set('Authorization', myToken)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('Success');
            expect(res.body.rides).to.be.an('array');
            done();
          });
      });
    });
  });
});

describe('Ride Request Routes API', () => {
  // Create a new user before doing all these
  before((done) => {
    const other = {
      name: 'Cristiano',
      email: 'cristiano@ronaldo.com',
      password: 'cristianoRonaldo',
    };
    const newUser = new user(other.name, other.email, other.password);
    newUser.insert();
    otherToken = jwt.sign({ id: '2', email: other.email }, process.env.SECRET, { expiresIn: '1h' });
    otherToken = `Bearer ${otherToken}`;
    done();
  });
  describe('Creating a new Request', () => {
    it('Should return an error if the ID param is not an integer', (done) => {
      request(app)
        .post('/rides/a/requests')
        .set('Authorization', myToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.include({ message: 'You need to enter integer' });
          done();
        });
    });
    it('Should not create a ride for at non-existing ID', (done) => {
      request(app)
        .post('/rides/8/requests')
        .set('Authorization', myToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.include({ message: 'Requested ride does not exist' });
          done();
        });
    });
    it('Should not create a ride request for the owner of the ride', (done) => {
      request(app)
        .post('/rides/1/requests')
        .set('Authorization', myToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.include({ message: 'You cannot request for a ride you created' });
          done();
        });
    });

    it('Should create a ride request for non-owner', (done) => {
      console.log(otherToken);
      request(app)
        .post('/rides/1/requests')
        .set('Authorization', otherToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.include({ message: 'Ride Request has been created' });
          expect(res.body.details.userId).to.equal(2);
          done();
        });
    });
    it('Should not create request for same user if created before', (done) => {
      request(app)
        .post('/rides/1/requests')
        .set('Authorization', otherToken)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body).to.include({ message: 'You have requested for the ride already' });
          done();
        });
    });
  });
  describe('Getting Ride Requests', () => {
    it('Should return an error if the ID param is not an integer', (done) => {
      request(app)
        .get('/users/rides/a/requests')
        .set('Authorization', myToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.include({ message: 'You need to enter integer' });
          done();
        });
    });
    it('Should not get ride request for a non-existing ID', (done) => {
      request(app)
        .get('/users/rides/8/requests')
        .set('Authorization', myToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.include({ message: 'Requested ride does not exist' });
          done();
        });
    });
    it('Should not allow a non-owner view riderequests', (done) => {
      request(app)
        .get('/users/rides/1/requests')
        .set('Authorization', otherToken)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.include({ message: 'You are not authorized to view these ride requests' });
          done();
        });
    });
    it('Should get all ride requests', (done) => {
      request(app)
        .get('/users/rides/1/requests')
        .set('Authorization', myToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.include({ status: 'success' });
          done();
        });
    });
    describe('Getting Ride request for ride that has not been requested for', () => {
      it('Create a new ride first', (done) => {
        const ride = {
          origin: 'London',
          destination: 'Fulham',
          date: '30/04/2018',
          time: '12:00PM',
          slots: '2',
          message: 'Getting food',
        };
        request(app)
          .post('/rides')
          .set('Authorization', myToken)
          .send(ride)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.Ride.rideId).to.equal(3);
            done();
          });
      });
      it('Should tell user no ride request yet', (done) => {
        request(app)
          .get('/users/rides/3/requests')
          .set('Authorization', myToken)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.include({ message: 'No requests have been made for this ride' });
            done();
          });
      });
    });
  });
  // describe('Updating a Ride Request');
});
