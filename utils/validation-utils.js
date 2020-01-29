const validator = require('validator')
const jwt = require('jsonwebtoken')
const BuhurtError = require('./BuhurtError')

function checkUserExists(document) {
    if (document !== null) {
      throw new BuhurtError('User with such email already exists', 406)
    }   
}

function isValidEmail(email) {
 if (!validator.isEmail(email)) {
   throw new BuhurtError('Email is not valid', 406)
 }

}

function isValidName(name) {
 if (!validator.isAlphanumeric(name)) {
   throw new BuhurtError('Name is not valid', 400 )
}
}

function isValidPassword(pass) {
    if (!validator.isAscii(pass)) {
        throw new BuhurtError('Password is not valid', 400)
    }
}

function isTokenValid(token) {
  const email = jwt.verify(token,'blablabla').email
  if (email === null) {
    throw new BuhurtError('Token is not valid', 401)
  } else {
    return email
  }
}

module.exports = {
    checkUserExists:checkUserExists,
    isValidEmail:isValidEmail,
    isValidName:isValidName,
    isValidPassword:isValidPassword,
    isTokenValid

}