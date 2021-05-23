const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
// const sendEmail = require('../utils/sendEmail');
const User = require('../db/models/user');


const passport = require('passport'),
LdapStrategy = require('passport-ldapauth')
const axios = require('axios')
const jwt = require('jsonwebtoken');


// @desc      Login user
// @route     POST /login
// @access    Public
exports.login = (req, res, next) => {

  const OPTS = {
    server: {
      url: 'ldaps://geodaten-velbert.de:636',
      bindDN: process.env.BIND_DN,
      bindCredentials: process.env.BIND_CREDENTIALS,
      searchBase: 'dc=geodaten-velbert,dc=de',
      searchFilter: `(&(objectClass=person)(cn=${req.body.username})(memberof=cn=streetmix,ou=groups,dc=geodaten-velbert,dc=de))`,
      usernameField: 'cn'
    }
  };

  passport.use(new LdapStrategy(OPTS));
  passport.authenticate("ldapauth", (err, data, info) => {
    if (err) {
      // console.log('passport.authenticate ldapauth error', err)
      return next(new ErrorResponse('Please provide an username and password', 400));
      // res.redirect('/error/access-denied')
    }
    // data enthält die User-Daten aus dem LDAP
    if (!data) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
    var payload = {userId: data.cn, exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), sub: data.cn}
    var login_token = jwt.sign(payload, process.env.JWT_SECRET);
    // console.log("login_token", login_token); //gibt den login_token aus

    refresh_token = 'hallo'

    // user = {'user_id': data.cn, 'login_token': login_token, 'refresh_token': refresh_token}
    // sendTokenResponse(user, 200, res);

    // await geht hier nicht
    // const user = await User.findOne({ where: { id: data.cn } })
    // console.log('passport.authenticate erfolgreich, setze cookies: ', data.cn)

    const cookieOptions = { maxAge: 9000000000, sameSite: 'strict', expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000) }
    res.cookie('user_id', data.cn, cookieOptions)
    res.cookie('login_token', login_token, cookieOptions)
    res.cookie('refresh_token', refresh_token, cookieOptions)


    // res.status(200).json({"user_id": decoded.userId, "flags": [], "roles": ['USER']});
    // erst mit redirect werden die cookies tatsächlich gesetzt
    res.redirect('/services/auth/just-signed-in')

  })(req, res, next);

};

