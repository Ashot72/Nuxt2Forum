import { STOREFORUMS, ADD } from './mutation-types'

export default {
  [STOREFORUMS] (state, forums) {
    state.forums = forums
  },
  [ADD] (state, forum) {
    state.forums.push(forum)
  }
}
