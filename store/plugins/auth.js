import Vue from 'vue'
import x from 'axios'

let axios = x.create({})

const API_URL = 'https://www.googleapis.com/identitytoolkit'
const SIGNUP_URL = '/v3/relyingparty/signupNewUser'
const SIGNIN_URL = '/v3/relyingparty/verifyPassword'

export default {
  install (Vue, { key, loader }) {
    axios.defaults.baseURL = API_URL
    this.key = key

    axios.interceptors.request.use(config => {
      loader(true)
      return config
    })
    axios.interceptors.response.use(
      res => {
        loader(false)
        return res
      },
      e => {
        loader(false)
        return Promise.reject(e)
      }
    )

    Vue.prototype.$auth = this
  },
  signup (email, password) {
    return axios
      .post(`${SIGNUP_URL}?key=${this.key}`, {
        email,
        password,
        returnSecureToken: true
      })
      .then(res => res)
  },
  signin (email, password) {
    return axios
      .post(`${SIGNIN_URL}?key=${this.key}`, {
        email,
        password,
        returnSecureToken: true
      })
      .then(res => res)
  }
}
