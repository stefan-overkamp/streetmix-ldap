
const config = require('config')
const logger = require('../lib/logger.js')()
const jsonwebtoken = require('jsonwebtoken');
const { User } = require('./db/models')


const jwtCheck = (req, res, next) => {
    if (req.cookies && req.cookies.login_token) {
      try {

        // wenn PUT und GET request auf api/v1/streets/street_id durchlassen

        var decoded = jsonwebtoken.verify(req.cookies.login_token, process.env.JWT_SECRET);
        // Check if token has expired
        const currentDate = new Date()
        const expDate = new Date(decoded.exp * 1000)
        // Set the expiration date to one day early so that tokens don't wait till the last moment to refresh
        expDate.setDate(expDate.getDate() - 1)
        if (currentDate >= expDate) {
          // console.log('Token ist abgelaufen', expDate)
          return null
          // await refreshLoginToken(signInData.refreshToken)
        } else {
          // console.log('jwtCheck decoded', decoded)
          req.user = {id: decoded.userId, sub: decoded.sub } // einen user aus dem jwt exktrahieren
          req.params.user_id = decoded.userId
          // FALSCH:  wichtig, den Status zu setzen und flags und roles!!!
          // res.status(200).json({"user_id": decoded.userId, "flags": [], "roles": ['USER', 'ADMIN']});
          // Das führt dazu, dass die einzelnen api-Aufrufe nur noch diesen response zurückgeben
          // RICHTIG: Es muss return next() heissen und nicht next() !!!!
          return next()
        }
      } catch (error) {
        // console.log('Error parsing jwt token ', error)
        return null
      }
    }
    return next()
}

const wrappedCheck = (req, res, next) => {
  const handleErrorNext = (err) => {
    if (err) {
      if (
        err.name === 'UnauthorizedError' &&
        err.inner.name === 'TokenExpiredError' &&
        req.cookies.login_token
      ) {
        if (req.method === 'POST' || req.method === 'PUT') {
          logger.error(
            `Expired token ${req.cookies.login_token} sent for authenticated route - ${req.method} ${req.url}`
          )
          logger.error(err)
        }

        return next()
      }
    }
    next(err)
  }

  jwtCheck(req, res, handleErrorNext)
}

module.exports = wrappedCheck
