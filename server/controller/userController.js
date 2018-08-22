import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/users';

const signUp = (req, res) => {
  const errors = req.validationErrors;
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json({ errors });
  }
  const user = req.body;
  // Find user email
  // If exist, return err, else create account
  User.findBy('email', user.email)
    .then((results) => {
      if (results.length >= 1) {
        res.status(409).json({
          message: 'Mail already exists',
        });
      } else {
        user.password = bcrypt.hashSync(user.password, 10);
        const newUser = new User(user.name, user.email, user.password);
        newUser.insert().then((result) => {
          const token = jwt.sign({ id: result.id, email: result.email }, process.env.SECRET, { expiresIn: '1h' });
          res.status(201).json({
            message: 'User has been created',
            User: {
              id: result.id,
              name: result.name,
              email: result.email,
            },
            Token: token,
          });
        });
      }
    });
};

const logIn = (req, res) => {
  const errors = req.validationErrors;
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json({ errors });
  }
  const user = req.body;
  // Check if user exists in the database
  User.findBy('email', user.email)
    .then((results) => {
      if (results.length < 1) {
        return res.status(401).json({
          message: 'Wrong Email - Auth Failed',
        });
      }
      bcrypt.compare(user.password, results[0].password).then((matches) => {
        if (matches) {
          const token = jwt.sign({ id: results[0].userid, email: results[0].email }, process.env.SECRET, { expiresIn: '1h' });
          res.status(200).json({
            message: 'Email Found and Password Matches',
            Token: token,
          });
        } else {
          res.status(401).json({
            message: 'Wrong Password - Auth Failed',
          });
        }
      });
    });
};

export { signUp, logIn };
