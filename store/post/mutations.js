import {
  STOREPOSTS,
  STORETOPIC,
  UPDATE,
  UPDATEANSWERED,
  REPLY
} from './mutation-types'

export default {
  [STORETOPIC] (state, topic) {
    state.topic = topic
  },
  [STOREPOSTS] (state, posts) {
    state.posts = posts
  },
  [UPDATE] (state, post) {
    const thePost = state.posts.find(p => p.id === post.id)
    thePost.title = post.title
    thePost.content = post.content
  },
  [UPDATEANSWERED] (state, post) {
    const thePost = state.posts.find(p => p.id === post.id)
    thePost.answered = post.answered
  },
  [REPLY] (state, post) {
    state.posts.push(post)
  }
}
