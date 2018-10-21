import authPlugin from './auth/plugins'
import { CLEARAUTHDATA } from './auth/mutation-types'

export const FAILED = 'FAILED'
export const CLEARERROR = 'CLEARERROR'
export const FAILEDERROR = 'FAILEDERROR'

export const plugins = authPlugin

export const state = () => ({
  error: ''
})

export const actions = {
  [FAILED] ({ commit }, error) {
    if (error === 'signout') {
      commit(`auth/${CLEARAUTHDATA}`)
    } else {
      commit(FAILEDERROR, error)
    }
  }
}

export const mutations = {
  [CLEARERROR] (state) {
    state.error = ''
  },
  [FAILEDERROR] (state, error) {
    state.error = `${error.message || error}  
        ${error.response ? error.response.data.error.message || error.response.data.error || error.response.data : ''}`
  }
}
