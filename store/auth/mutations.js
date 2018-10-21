import { AUTHDATA, CLEARAUTHDATA } from './mutation-types'

export default {
  [AUTHDATA] (state, { idToken, refreshToken, email, expiresIn }) {
    state.idToken = idToken
    state.refreshToken = refreshToken
    state.email = email
    state.expiresIn = expiresIn
  },
  [CLEARAUTHDATA] (state) {
    state.idToken = null
    state.refreshToken = null
    state.email = null
    state.expiresIn = null
  }
}
