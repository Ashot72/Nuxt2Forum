import Vue from 'vue'
import { UPDATEFORUM } from '../forum/action-types'
import {
  FETCHTOPIC,
  ADDTOPICPOSTID,
  UPDATETOPIC,
  DELETETOPICPOSTID
} from '../topic/action-types'
import {
  FETCHPOSTS,
  FETCHPOSTSTOPIC,
  ADDPOST,
  UPDATEPOST,
  REPLYPOST,
  DELETEPOST,
  DELETEPOSTBYTOPIC,
  ISANSWER
} from './action-types'
import {
  STOREPOSTS,
  STORETOPIC,
  UPDATE,
  UPDATEANSWERED,
  REPLY
} from './mutation-types'
import { FAILED } from '../../store'

let v = new Vue()

export default {
  [FETCHPOSTS] ({ commit, dispatch }, { topicId, req }) {
    dispatch(`topic/${FETCHTOPIC}`, { topicId, req }, { root: true })
      .then(({ data }) => {
        dispatch(
          `topic/${UPDATETOPIC}`,
          { id: topicId, topic: { views: data.views + 1 } },
          { root: true }
        )
      })
      .catch(e => dispatch(FAILED, e, { root: true }))

    return v.$forums
      .fetchPosts({ topicId, req })
      .then(({ data }) => {
        const posts = []

        for (let key in data) {
          const post = data[key]
          post.id = key
          posts.push(post)
        }
        commit(STOREPOSTS, posts)
      })
      .catch(e => dispatch(FAILED, e, { root: true }))
  },
  [FETCHPOSTSTOPIC] ({ commit, dispatch }, { topicId, req }) {
    return dispatch(
      `topic/${FETCHTOPIC}`,
      { topicId, req },
      {
        root: true
      }
    ).then(({ data }) => {
      data.id = topicId
      commit(STORETOPIC, data)
    })
  },
  [ADDPOST] ({ dispatch }, { post, topicAdded }) {
    const { forumId, topicId, title, content, creator, createdDate } = post

    return v.$forums
      .addPost({
        forumId,
        topicId,
        title,
        content,
        creator,
        createdDate,
        answered: false
      })
      .then(({ data }) => {
        const postId = data.name
        post.id = topicAdded ? topicId : postId
        return postId
      })
      .then(postId =>
        dispatch(`topic/${ADDTOPICPOSTID}`, { topicId, postId }, { root: true })
      )
      .then(() => v.$forums.fetchForum(forumId))
      .then(({ data }) => data.posts)
      .then(posts =>
        dispatch(
          `forum/${UPDATEFORUM}`,
          {
            id: forumId,
            lastPost: title,
            lastPostedDate: createdDate,
            lastPoster: creator,
            lastTopicId: post.topicId,
            posts: posts + 1
          },
          { root: true }
        )
      )
      .then(() => post)
      .catch(e => dispatch(FAILED, e, { root: true }))
  },
  [ISANSWER] ({ commit, dispatch }, post) {
    const clone = Object.assign({}, post, { answered: !post.answered })
    const { id, answered } = clone

    return v.$forums
      .updatePost(post.id, { answered })
      .then(() => commit(UPDATEANSWERED, clone))
      .catch(e => dispatch(FAILED, e, { root: true }))
  },
  [UPDATEPOST] ({ commit, dispatch }, post) {
    const { id, title, content } = post

    return v.$forums
      .updatePost(id, { title, content })
      .then(() => commit(UPDATE, post))
      .catch(e => dispatch(FAILED, e, { root: true }))
  },
  [REPLYPOST] ({ commit, dispatch }, post) {
    post.createdDate = new Date()

    return dispatch(ADDPOST, { post, topicAdded: false })
      .then(() =>
        dispatch(
          `topic/${FETCHTOPIC}`,
          { topicId: post.topicId },
          { root: true }
        )
      )
      .then(({ data }) =>
        dispatch(
          `topic/${UPDATETOPIC}`,
          { id: post.topicId, topic: { replies: data.replies + 1 } },
          { root: true }
        )
      )
      .then(() => commit(REPLY, post))
      .catch(e => dispatch(FAILED, e, { root: true }))
  },
  [DELETEPOST] ({ dispatch }, { id, forumId, topicId }) {
    return v.$forums
      .fetchTopic(topicId)
      .then(() => {
        dispatch(
          `topic/${DELETETOPICPOSTID}`,
          { topicId, postId: id },
          { root: true }
        )
        return v.$forums
          .deletePost(id)
          .then(() =>
            v.$forums
              .fetchForum(forumId)
              .then(({ data: { posts } }) =>
                v.$forums.updateForum(forumId, { posts: posts - 1 })
              )
          )
          .then(() => dispatch(FETCHPOSTS, { topicId }))
      })
      .catch(e => dispatch(FAILED, e, { root: true }))
  },
  [DELETEPOSTBYTOPIC] (context, topicId) {
    return v.$forums.fetchTopic(topicId).then(({ data }) => {
      const postsId = data.postsId

      for (let key in postsId) {
        const pid = postsId[key]
        v.$forums.deletePost(pid)
      }
    })
  }
}
