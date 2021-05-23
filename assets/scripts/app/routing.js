import {
  AUTH0_SIGN_IN_CALLBACK_PATH,
  TWITTER_SIGN_IN_CALLBACK_PATH,
  USE_AUTH0
} from './config'
import {
  JUST_SIGNED_IN_URL,
  URL_EXAMPLE_STREET,
  URL_NEW_STREET
} from './constants'

import Authenticate from './auth0'
import { clearDialogs } from '../store/slices/dialogs'
import store from '../store'

const AUTH0_SIGN_IN_CALLBACK_URL = new URL(
  AUTH0_SIGN_IN_CALLBACK_PATH,
  window.location.origin
).href

const TWITTER_SIGN_IN_CALLBACK_URL = new URL(
  TWITTER_SIGN_IN_CALLBACK_PATH,
  window.location.origin
).href

const TWITTER_URL_SIGN_IN_REDIRECT =
  '/services/auth/twitter-sign-in?callbackUri=' +
  TWITTER_SIGN_IN_CALLBACK_URL +
  '&redirectUri=' +
  JUST_SIGNED_IN_URL

var passport = require('passport'),
LdapStrategy = require('passport-ldapauth')
const request = require('request')
const axios = require('axios')

export function goReload() {
  window.location.reload()
}

export function goHome() {
  window.location.href = '/'
}

export function goNewStreet(sameWindow) {
  if (sameWindow) {
    window.location.replace(URL_NEW_STREET)
  } else {
    window.location.href = URL_NEW_STREET
  }
}

export function goExampleStreet() {
  window.location.href = URL_EXAMPLE_STREET
}

export function goTwitterSignIn() {
  const auth0 = Authenticate()
  if (USE_AUTH0) {
    auth0.authorize({
      responseType: 'code',
      connection: 'twitter',
      redirectUri: AUTH0_SIGN_IN_CALLBACK_URL
    })
  } else {
    window.location.href = TWITTER_URL_SIGN_IN_REDIRECT
  }
}

// export function goFacebookSignIn() {
//   const auth0 = Authenticate()
//   auth0.authorize({
//     responseType: 'code',
//     connection: 'facebook',
//     redirectUri: AUTH0_SIGN_IN_CALLBACK_URL
//   })
// }

// export function goGoogleSignIn() {
//   const auth0 = Authenticate()
//   auth0.authorize({
//     responseType: 'code',
//     connection: 'google-oauth2',
//     redirectUri: AUTH0_SIGN_IN_CALLBACK_URL
//   })
// }

// export function goEmailSignIn(email, username, callback) {
//   const auth0 = Authenticate()
//   auth0.passwordlessStart(
//     {
//       send: 'link',
//       email: email,
//       connection: 'email',
//       authParams: {
//         redirectUri: AUTH0_SIGN_IN_CALLBACK_URL,
//         responseType: 'code'
//       }
//     },
//     (err, res) => {
//       callback(err, res)
//     }
//   )
// }


export function goLDAPSignIn(username, password, callback) {

  var credentials = {username: username, password: password}
  // console.log('goLDAPSignIn', credentials)

  // ruft in app app.post("/login", (req, res, next) => { auf
  axios
  .post('/login', credentials)
  .then((response) => {
    if (response.status == 200) {
      // console.log('login response: ', username)
      // den SignInDialog entfernen
      store.dispatch(clearDialogs())
      // wichtig, nach dem LOGIN die Seite neu zu laden
      // Dadurch wird loadSignIn gestartet und auf Basis des LocalStorage das SignIn vervollständigt.
      window.setTimeout(goHome(), 1000)

    }
  })

}


