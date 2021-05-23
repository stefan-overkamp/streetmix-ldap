import './SignInDialog.scss'

import {
  goEmailSignIn,
  goFacebookSignIn,
  goGoogleSignIn,
  goLDAPSignIn,
  goTwitterSignIn
} from '../app/routing'

import Dialog from './Dialog'
import { FormattedMessage } from 'react-intl'
import Icon from '../ui/Icon'
import LoadingSpinner from '../ui/LoadingSpinner'
import React from 'react'

export default class SignInDialog extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      username: '',
      password: '',
      emailSent: false,
      sendingEmail: false,
      error: false,
      signingIn: false
    }

    this.usernameInputEl = React.createRef()
  }

  componentDidMount = () => {
    this.usernameInputEl.current.focus()
  }

  handleChange = (event) => {
    const target = event.target
    const name = target.name
    const value = target.value

    this.setState({
      [name]: value
    })
  }

  handleGoEmailSignIn = (error, res) => {
    if (error) {
      // console.error('handleGoEmailSignIn', error)
      return
    }

    this.setState({
      sendingEmail: false,
      emailSent: true,
      // Reset error state
      error: false
    })
  }

  handleEmailResend = (event) => {
    event.preventDefault()

    this.setState({
      emailSent: false
    })
  }

  handleLDAPSignIn = (event) => {
    // console.log('handleLDAPSignIn')
    event.preventDefault()

    this.setState({
      signingIn: true
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()

    // Note: we don't validate the input here;
    // we let HTML5 <input type="email" required /> do validation

    this.setState({
      // sendingEmail: true
      signingIn: true
    })

    goLDAPSignIn(this.state.username, this.state.password, this.handleLDAPSignIn)

  }

  renderErrorMessage = () => {
    return (
      <p className="sign-in-error-message">
        <FormattedMessage
          id="dialogs.sign-in.email-invalid"
          defaultMessage="Oops! That didn’t look like a valid email address. Please try again."
        />
      </p>
    )
  }

  renderSignInWaiting = () => {
    return (
      <Dialog>
        {() => (
          <div className="sign-in-dialog">
            <header>
              <h1 className="sign-in-loading-message">
                <FormattedMessage
                  id="dialogs.sign-in.loading-message"
                  defaultMessage="Signing you in…"
                />
              </h1>
            </header>
            <div
              className="dialog-content sign-in-loading"
              aria-live="polite"
              aria-busy="true"
            >
              <LoadingSpinner />
            </div>
          </div>
        )}
      </Dialog>
    )
  }

  renderEmailSent = () => {
    return (
      <Dialog>
        {() => (
          <div className="sign-in-dialog">
            <header>
              <h1 className="sign-in-loading-message">
                <FormattedMessage
                  id="dialogs.sign-in.loading-message"
                  defaultMessage="Signing you in…"
                />
              </h1>
            </header>
            <div className="dialog-content sign-in-email-sent">
              <p>
                <FormattedMessage
                  id="dialogs.sign-in.sent-message-with-email"
                  defaultMessage="We’ve sent an email to {email}. Please follow the instructions there to continue signing in!"
                  values={{
                    email: (
                      <span className="sign-in-email">{this.state.email}</span>
                    )
                  }}
                />
              </p>
              <p className="sign-in-resend">
                <FormattedMessage
                  id="dialogs.sign-in.email-unreceived"
                  defaultMessage="Didn’t receive it?"
                />
                <br />
                <a onClick={this.handleEmailResend}>
                  <FormattedMessage
                    id="dialogs.sign-in.resend-email"
                    defaultMessage="Resend email"
                  />
                </a>
              </p>
            </div>
          </div>
        )}
      </Dialog>
    )
  }

  render () {
    const { sendingEmail, emailSent, signingIn } = this.state

    if (sendingEmail || signingIn) {
      return this.renderSignInWaiting()
    } else if (emailSent) {
      return this.renderEmailSent()
    }

    return (
      <Dialog>
        {(closeDialog) => (
          <div className="sign-in-dialog">
            <header>
              <h1>
                <FormattedMessage
                  id="dialogs.sign-in.heading"
                  defaultMessage="Sign in / Sign up"
                />
              </h1>
            </header>
            <div className="dialog-content">
              <p>
                <FormattedMessage
                  id="dialogs.sign-in.description"
                  defaultMessage="Save your first design or sign in to access your past designs."
                />
              </p>

              <form onSubmit={this.handleSubmit}>
                <label
                  htmlFor="sign-in-username-input"
                  className="sign-in-username-label"
                >
                  <FormattedMessage
                    id="dialogs.sign-in.username-label"
                    defaultMessage="Username"
                  />
                </label>

                <input
                  type="text"
                  id="sign-in-username-input"
                  ref={this.usernameInputEl}
                  value={this.state.username}
                  className={
                    'sign-in-input ' +
                    (this.state.error ? 'sign-in-input-error' : '')
                  }
                  name="username"
                  onChange={this.handleChange}
                  placeholder="Erwin"
                  required={true}
                />

                <label
                  htmlFor="sign-in-password-input"
                  className="sign-in-password-label"
                >
                  <FormattedMessage
                    id="dialogs.sign-in.password-label"
                    defaultMessage="Username"
                  />
                </label>

                <input
                  type="password"
                  id="sign-in-password-input"
                  ref={this.passwordInputEl}
                  value={this.state.password}
                  className={
                    'sign-in-input ' +
                    (this.state.error ? 'sign-in-input-error' : '')
                  }
                  name="password"
                  onChange={this.handleChange}
                  placeholder="geheim"
                  required={true}
                />


                {this.state.error && this.renderErrorMessage()}


                <button
                  type="submit"
                  className="button-primary sign-in-button sign-in-email-button"
                >
                <FormattedMessage
                    id="dialogs.sign-in.button.email"
                    defaultMessage="Continue with email"
                  />
                </button>
              </form>


            </div>

            <footer>
              <p className="sign-in-disclaimer">
                <FormattedMessage
                  id="dialogs.sign-in.tos"
                  defaultMessage="By clicking one of these buttons, I agree to the {privacyLink}."
                  values={{
                    privacyLink: (
                      <a href="https://geodaten-velbert.de/privacy-policy/" target="_blank">
                        <FormattedMessage
                          id="dialogs.sign-in.privacy-link-label"
                          defaultMessage="privacy policy"
                        />
                      </a>
                    )
                  }}
                />
              </p>
            </footer>
          </div>
        )}
      </Dialog>
    )
  }
}
