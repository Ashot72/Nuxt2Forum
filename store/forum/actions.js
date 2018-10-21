import Vue from 'vue'
import {
  FETCHFORUMS,
  FETCHFORUM,
  ADDFORUM,
  UPDATEFORUMBYTOPIC,
  UPDATEFORUM,
  DELETEFORUM,
  DELETEFORUMTOPICID
} from './action-types'
import { DELETETOPICBYFORUM } from '../topic/action-types'
import { STOREFORUMS, ADD } from './mutation-types'
import { FAILED } from '../../store'

let v = new Vue()

export default {
  [FETCHFORUM] (context, { forumId, req }) {
    return v.$forums.fetchForum(forumId, req)
  },
  [FETCHFORUMS] ({ commit, dispatch }) {
    return v.$forums
      .fetchForums()
      .then(({ data }) => {
        const forums = []

        for (let key in data) {
          const forum = data[key]
          forum.id = key
          forums.push(forum)
        }
        commit(STOREFORUMS, forums)
      })
      .catch(e => dispatch(FAILED, e, { root: true }))
  },
  [ADDFORUM] ({ commit, dispatch }, forum) {
    return v.$forums
      .addForum(forum)
      .then(({ data }) => {
        const forumId = data.name
        forum.id = forumId
        commit(ADD, forum)
      })
      .catch(e => dispatch(FAILED, e, { root: true }))
  },
  [UPDATEFORUMBYTOPIC] (context, { forumId, topicId }) {
    return v.$forums.fetchForum(forumId).then(({ data }) => {
      const { topics, topicsId } = data
      if (topicsId) {
        topicsId.push(topicId)
        return v.$forums.updateForumAndTopicId(topics + 1, forumId, topicsId)
      } else {
        v.$forums
          .addForumTopicId(forumId, { 0: topicId })
          .then(() => v.$forums.updateForum(forumId, { topics: 1 }))
      }
    })
  },
  [UPDATEFORUM] ({ dispatch }, forum) {
    return v.$forums
      .updateForum(forum.id, Object.assign({}, forum, { id: null }))
      .catch(e => dispatch(FAILED, e, { root: true }))
  },
  [DELETEFORUM] ({ commit, dispatch }, forumId) {
    return v.$forums
      .fetchForum(forumId)
      .then(({ data }) => {
        const topicsId = data.topicsId

        for (let key in topicsId) {
          const topicId = topicsId[key]
          dispatch(`topic/${DELETETOPICBYFORUM}`, topicId, { root: true })
        }
        return v.$forums.deleteForum(forumId)
      })
      .catch(e => dispatch(FAILED, e, { root: true }))
  },
  [DELETEFORUMTOPICID] (context, { forumId, topicId }) {
    return v.$forums
      .fetchForum(forumId)
      .then(({ data: { topics, topicsId } }) => {
        const newTopicIds = topicsId.filter(t => t !== topicId)
        return v.$forums.updateForumAndTopicId(topics - 1, forumId, newTopicIds)
      })
  }
}
