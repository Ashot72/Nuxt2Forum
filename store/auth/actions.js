import Vue from 'vue'
import { AUTHDATA, CLEARAUTHDATA } from './mutation-types'
import {
  SIGNUP,
  SIGNIN,
  SIGNOUT,
  AUTOSIGNIN,
  FETCHFORUMS
} from './action-types'
import { STORAGE_KEY } from '@/helpers/constants'
import { FAILED } from '@/store'

let v = new Vue()
let loaded = false

export default {
  [SIGNUP] ({ commit, dispatch }, { email, password }) {
    return v.$auth
      .signup(email, password)
      .then(({ data }) => commit(AUTHDATA, data))
      .then(() => v.$forums.addUser({ email }))
      .catch(e => dispatch(FAILED, e, { root: true }))
  },
  [SIGNIN] ({ commit, dispatch }, { email, password }) {
    return v.$auth
      .signin(email, password)
      .then(({ data }) => commit(AUTHDATA, data))
      .catch(e => dispatch(FAILED, e, { root: true }))
  },
  [SIGNOUT] ({ commit }) {
    commit(CLEARAUTHDATA)
  },
  [AUTOSIGNIN] ({ commit }, context) {
    if (process.client) {
      const storage = localStorage.getItem(STORAGE_KEY)
      if (storage) {
        if (!loaded) {
          const vueForum = JSON.parse(storage)
          commit(AUTHDATA, vueForum)
          loaded = true
        }
      } else {
        if (Object.keys(context.params).length !== 0) {
          context.redirect('/')
        }
      }
    } else {
      const { req } = context
      if (req) {
        const idToken = fromCookie(req, 'idToken')
        const refreshToken = fromCookie(req, 'refreshToken')
        const email = fromCookie(req, 'email')
        const expiresIn = fromCookie(req, 'expiresIn')

        if (idToken && refreshToken && email && expiresIn) {
          commit(AUTHDATA, { idToken, refreshToken, email, expiresIn })
        } else {
          context.redirect('/')
        }
      }
    }
  }
}

const fromCookie = (req, name) => {
  return req.headers.cookie
    ? req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith(`${name}=`))
        .split('=')[1]
    : null
}
