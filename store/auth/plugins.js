import { AUTHDATA, CLEARAUTHDATA } from './mutation-types'
import { STORAGE_KEY } from '@/helpers/constants'
import Cookie from 'js-cookie'

const localStoragePlugin = store => {
  store.subscribe(
    (mutation, { auth: { idToken, refreshToken, email, expiresIn } }) => {
      if (mutation.type === `auth/${AUTHDATA}`) {
        if (process.client) {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ idToken, refreshToken, email, expiresIn })
          )
        }

        Cookie.set('idToken', idToken)
        Cookie.set('refreshToken', refreshToken)
        Cookie.set('email', email)
        Cookie.set('expiresIn', expiresIn)
      }

      if (mutation.type === `auth/${CLEARAUTHDATA}`) {
        if (process.client) {
          localStorage.removeItem(STORAGE_KEY)
        }
        Cookie.remove('idToken')
        Cookie.remove('refreshToken')
        Cookie.remove('email')
        Cookie.remove('expiresIn')
      }
    }
  )
}

export default [localStoragePlugin]
