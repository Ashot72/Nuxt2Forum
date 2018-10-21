import { STOREFORUM, STORETOPICS, ADD } from './mutation-types'

export default {
  [STOREFORUM] (state, forum) {
    state.forum = forum
  },
  [STORETOPICS] (state, topics) {
    state.topics = topics
  },
  [ADD] (state, topic) {
    state.topics.unshift(topic)
  }
}
