import ride from '../models/rideoffers';

const createRide = (req, res) => {
  const errors = req.validationErrors;
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json({ errors });
  }
  const userId = req.decoded.id;
  const {
    origin, destination, date, time, slots, message,
  } = req.body;
  const newRide = new ride(userId, origin, destination, date, time, slots, message);
  newRide.insert()
    .then((result) => {
      res.status(201).json({
        message: 'Ride has been created',
        Ride: {
          rideId: result.rideid,
          userId,
          origin,
          destination,
          date,
          time,
          slots,
          message,
        },
      });
    })
    .catch((error) => {
      if (error.code = '23505') {
        return res.status(500).json({
          message: 'Ride has been created already by you',
        });
      }

      res.status(500).json({
        message: 'Ride coudlnt be created',
      });
    });
};

const getAllRides = (req, res) => {
  ride.getAll()
    .then((results) => {
      if (results.length === 0) {
        return res.status(200).json({
          status: 'Success',
          message: 'There are no available rides yet',
        });
      }
      res.status(200).json({
        status: 'Success',
        rides: results,
      });
    });
};

const getRideAtId = (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(404).json({
      message: 'You need to enter integer',
    });
  }
  ride.findBy(req.params.id)
    .then((result) => {
      if (result === undefined) {
        return res.status(404).json({
          message: 'There is no ride at this ID',
        });
      }
      res.status(200).json({
        status: 'Success',
        ride: result,
      });
    })
    .catch(e => res.status(404).json({
      message: 'There is no ride at this ID',
    }));
};


export { createRide, getAllRides, getRideAtId };
