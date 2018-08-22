import jwt from 'jsonwebtoken';

const verify = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth Failed',
    });
  }
};

export default verify;
