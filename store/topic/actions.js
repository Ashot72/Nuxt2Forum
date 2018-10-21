import Vue from 'vue'
import {
  FETCHFORUM,
  UPDATEFORUMBYTOPIC,
  DELETEFORUMTOPICID
} from '../forum/action-types'
import {
  FETCHTOPICSFORUM,
  FETCHTOPICS,
  FETCHTOPIC,
  ADDTOPIC,
  UPDATETOPIC,
  ADDTOPICPOSTID,
  DELETETOPICBYFORUM,
  DELETETOPIC,
  DELETETOPICPOSTID
} from './action-types'
import { ADDPOST, DELETEPOSTBYTOPIC } from '../post/action-types'
import { STOREFORUM, STORETOPICS, ADD } from './mutation-types'
import { FAILED } from '../../store'

let v = new Vue()

export default {
  [FETCHTOPIC] (context, { topicId, req }) {
    return v.$forums.fetchTopic(topicId, req)
  },
  [ADDTOPICPOSTID] (context, { topicId, postId }) {
    return v.$forums.fetchTopic(topicId).then(({ data }) => {
      const postsId = data.postsId
      let index = 0

      if (postsId) {
        index = postsId.length
      }
      return v.$forums.addTopicPostId(topicId, { [index]: postId })
    })
  },
  [FETCHTOPICS] ({ commit, dispatch }, { forumId, req }) {
    return v.$forums
      .fetchTopics(forumId, req)
      .then(({ data }) => {
        const topics = []

        for (let key in data) {
          const topic = data[key]
          topic.id = key
          topics.push(topic)
        }
        commit(
          STORETOPICS,
          topics.sort((a, b) => {
            const dateA = new Date(a.createdDate).getTime()
            const dateB = new Date(b.createdDate).getTime()
            return dateB > dateA ? 1 : -1
          })
        )
      })
      .catch(e => dispatch(FAILED, e, { root: true }))
  },
  [FETCHTOPICSFORUM] ({ commit, dispatch }, { forumId, req }) {
    return dispatch(`forum/${FETCHFORUM}`, { forumId, req }, { root: true })
      .then(({ data }) => {
        data.id = forumId
        commit(STOREFORUM, data)
      })
      .catch(e => dispatch(FAILED, e, { root: true }))
  },
  [ADDTOPIC] ({ commit, dispatch }, topic) {
    const now = new Date()
    topic.createdDate = now
    topic.lastPoster = topic.creator
    topic.lastPostedDate = now

    return v.$forums
      .addTopic(topic)
      .then(({ data }) => {
        topic.topicId = data.name
        topic.id = data.name
        return dispatch(
          `forum/${UPDATEFORUMBYTOPIC}`,
          { forumId: topic.forumId, topicId: topic.id },
          { root: true }
        )
      })
      .then(() => {
        dispatch(
          `post/${ADDPOST}`,
          { post: topic, topicAdded: true },
          { root: true }
        )
      })
      .then(() => commit(ADD, topic))
      .catch(e => dispatch(FAILED, e, { root: true }))
  },
  [UPDATETOPIC] ({ dispatch }, payload) {
    const { id, topic } = payload

    return v.$forums
      .updateTopic(id, topic)
      .catch(e => dispatch(FAILED, e, { root: true }))
  },
  [DELETETOPICBYFORUM] ({ dispatch }, topicId) {
    return v.$forums.fetchTopic(topicId).then(({ data }) => {
      const postsId = data.postsId

      for (let key in postsId) {
        dispatch(`post/${DELETEPOSTBYTOPIC}`, topicId, { root: true })
      }
      return v.$forums.deleteTopic(topicId)
    })
  },
  [DELETETOPIC] ({ commit, dispatch }, { forumId, topicId }) {
    return dispatch(`post/${DELETEPOSTBYTOPIC}`, topicId, { root: true })
      .then(() => v.$forums.fetchTopic(topicId))
      .then(({ data }) => {
        v.$forums.deleteTopic(topicId)
        return data.postsId.length
      })
      .then(postsIdLen =>
        v.$forums
          .fetchForum(forumId)
          .then(({ data: { posts } }) =>
            v.$forums.updateForum(forumId, { posts: posts - postsIdLen })
          )
          .then(() => {
            dispatch(
              `forum/${DELETEFORUMTOPICID}`,
              { forumId, topicId },
              { root: true }
            )
          })
      )
      .catch(e => dispatch(FAILED, e, { root: true }))
  },
  [DELETETOPICPOSTID] (context, { topicId, postId }) {
    return v.$forums
      .fetchTopic(topicId)
      .then(({ data: { replies, postsId } }) => {
        const newPostIds = postsId.filter(t => t !== postId)
        return v.$forums.updateTopicAndPostId(replies - 1, topicId, newPostIds)
      })
  }
}
