import { AUTH } from './getter-types'

export default {
  [AUTH] (state) {
    return state.idToken !== null
  }
}
