import request from '../models/riderequests';
import ride from '../models/rideoffers';


const createRequest = (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(404).json({
      message: 'You need to enter integer',
    });
  }
  const rideId = parseInt(req.params.id, 10);
  const userId = parseInt(req.decoded.id, 10);
  ride.findBy(rideId)
    .then((result) => {
      if (userId !== result.userid) {
        const newRequest = new request(userId, rideId);
        newRequest.insert()
          .then( data => res.status(200).json({
            message: 'Ride Request has been created',
            details: data,
          }))
          .catch((error) => {
            if (error.code === '23505') {
              return res.status(409).json({
                message: 'You have requested for the ride already',
              });
            }
            return res.status(500).json({
              message: 'Unable to create ride request',
            });
          });
      } else {
        return res.status(400).json({
          message: 'You cannot request for a ride you created',
        });
      }
    })
    .catch(err => res.status(404).json({
      message: 'Requested ride does not exist',
    }));
};

const getRequests = (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(404).json({
      message: 'You need to enter integer',
    });
  }
  const rideId = parseInt(req.params.id, 10);
  const userId = parseInt(req.decoded.id, 10);
  ride.findBy(rideId)
    .then((result) => {
      if (userId === result.userid) {
        request.findBy(rideId)
          .then((result) => {
            if (result.length === 0) {
              return res.status(200).json({
                status: 'success',
                message: 'No requests have been made for this ride',
              });
            }
            return res.status(200).json({
              status: 'success',
              requests: result,
            });
          })
          .catch((err) => {
          });
      } else {
        return res.status(403).json({
          status: 'error',
          message: 'You are not authorized to view these ride requests',
        });
      }
    })
    .catch(err => res.status(404).json({
      message: 'Requested ride does not exist',
    }));
};

const verifyRequest = (req, res) => {
  const { requestId, rideId } = req.params;
  const { status } = req.body;
  const userId = req.decoded.id;
  if (isNaN(requestId) || isNaN(rideId)) {
    return res.status(404).json({
      message: 'You need to enter integer',
    });
  }
  ride.findBy(rideId)
    .then((result) => {
      if (userId === result.userid) {
        if (status === 'approved' || status === 'declined') {
          request.verify(status, requestId)
            .then(data => res.status(200).json({
              status: `Ride request has been ${status}`,
              details: data,
            }))
            .catch(err => res.status(500).json({
              status: 'Error',
              message: 'Unable to process request',
            }));
        } else {
          return res.status(400).json({
            message: 'Bad request',
          });
        }
      } else {
        return res.status(403).json({
          status: 'error',
          message: 'You are not authorized to view these ride requests',
        });
      }
    })
    .catch(() => res.status(404).json({
      message: 'Requested ride does not exist',
    }));
};

export { getRequests, createRequest, verifyRequest };
