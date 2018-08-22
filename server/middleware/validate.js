// Functions Used here
const userSignUpValidator = (req, res, next) => {
  // Create a list of Errors
  const errors = {};

  // Get the keys to validate from req.body
  let { name, email, password } = req.body;

  // First thing to do is to check the params if the user ticked them or filled them in json form
  const params = ['name', 'email', 'password'];

  params.forEach((param) => {
    if (req.body[param] === undefined) {
      errors[param] = `${param} is required`;
    }
  });

  function checkValidity(value) {
    const errorMessage = [
      'Name is required to be only letters and greater than 2 letters',
      'Enter a valid Email Address',
      'Password is required to be only letters and greater than 2 letters',
    ];
    let status;
    if (value === name) {
      status = !(/^[a-zA-Z]{2,}/.test(value));
      if (status) errors.name = errorMessage[0];
    }
    if (value === email) {
      status = !(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(value));
      if (status) errors.email = errorMessage[1];
    }
    if (value === password) {
      status = !(/^[a-zA-Z]{8,}/.test(value));
      if (status) errors.password = errorMessage[2];
    }
  }

  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      const value = req.body[key];
      if (value.trim() === '' || value === undefined) {
        errors[key] = `${key} is required`;
      }
      switch (key) {
        case 'name':
          name = name.trim();
          checkValidity(name);
          break;
        case 'email':
          email = email.trim();
          checkValidity(email);
          break;
        case 'password':
          password = password.trim();
          checkValidity(password);
          break;
        default:
          break;
      }
    });
  }

  req.validationErrors = errors;
  req.body = { name, email, password };
  next();
};

const userSignInValidator = (req, res, next) => {
  // Create a list of Errors
  const errors = {};

  // Get the keys to validate from req.body
  let { email, password } = req.body;

  // First thing to do is to check the params if the user ticked them or filled them in json form
  const params = ['email', 'password'];

  params.forEach((param) => {
    if (req.body[param] === undefined) {
      errors[param] = `${param} is required`;
    }
  });

  function checkValidity(value) {
    const errorMessage = [
      'Name is required to be only letters and greater than 2 letters',
      'Enter a valid Email Address',
      'Password is required to be only letters and greater than 2 letters',
    ];
    let status;
    if (value === email) {
      status = !(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(value));
      if (status) errors.email = errorMessage[1];
    }
    if (value === password) {
      status = !(/^[a-zA-Z]{8,}/.test(value));
      if (status) errors.password = errorMessage[2];
    }
  }

  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      const value = req.body[key];
      if (value.trim() === '' || value === undefined) {
        errors[key] = `${key} is required`;
      }
      switch (key) {
        case 'email':
          email = email.trim();
          checkValidity(email);
          break;
        case 'password':
          password = password.trim();
          checkValidity(password);
          break;
        default:
          break;
      }
    });
  }

  req.validationErrors = errors;
  req.body = { email, password };
  next();
};

const rideOfferValidator = (req, res, next) => {
  // Create a list of Errors
  const errors = {};

  // Get the keys to validate from req.body
  let {
    origin, destination, date, time, slots,
  } = req.body;

  // First thing to do is to check the params if the user ticked them or filled them in json form
  const params = ['origin', 'destination', 'date', 'time', 'slots'];

  params.forEach((param) => {
    if (req.body[param] === undefined) {
      errors[param] = `${param} is required`;
    }
  });

  function isDate(myDate) {
    let status = (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(myDate));
    if (status) {
      const dateArray = myDate.split('/');
      const day = parseInt(dateArray[0], 10);
      const month = parseInt(dateArray[1], 10);
      const year = parseInt(dateArray[2], 10);
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (year === 2018) {
        if (month >= 1 && month <= 12) {
          // Use that month to confirm date
          if (day >= 1 && day <= daysInMonth[month - 1]) {
            status = true;
          } else status = false;
        } else status = false;
      } else status = false;
    } else {
      status = false;
    }
    return status;
  }

  function checkValidity(value) {
    const errorMessage = [
      'Origin is required to be only letters and greater than 2 letters',
      'Destination is required to be only letters and greater than 2 letters',
      'Enter a valid date(dd/mm/yyyy)',
      'Enter a valid time(hh:mmAM/PM)',
      'Enter a Number',
    ];
    let status;
    if (value === origin) {
      status = !(/^[A-Za-z]{2,}/.test(value));
      if (status) errors.origin = errorMessage[0];
    }
    if (value === destination) {
      status = !(/^[a-zA-Z]{2,}/.test(value));
      if (status) errors.destination = errorMessage[1];
    }
    if (value === date) {
      status = !isDate(value);
      if (status) errors.date = errorMessage[2];
    }
    if (value === time) {
      status = !(/^(1[0-2]|0?[1-9]):([0-5]?[0-9])(●?[AP]M)?$/.test(value));
      if (status) errors.time = errorMessage[3];
    }
    if (value === slots) {
      status = isNaN(value);
      if (status) errors.slots = errorMessage[4];
    }
  }

  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      const value = req.body[key];
      if (value.trim() === '' || value === undefined) {
        errors[key] = `${key} is required`;
      }
      switch (key) {
        case 'origin':
          origin = origin.trim();
          checkValidity(origin);
          break;
        case 'destination':
          destination = destination.trim();
          checkValidity(destination);
          break;
        case 'date':
          date = date.trim();
          checkValidity(date);
          break;
        case 'time':
          time = time.trim();
          checkValidity(time);
          break;
        case 'slots':
          slots = slots.trim();
          checkValidity(slots);
          break;
        default:
          break;
      }
    });
  }

  req.validationErrors = errors;
  next();
};

export { userSignUpValidator, userSignInValidator, rideOfferValidator };
