import Vue from 'vue'
import Cookie from 'js-cookie'
import x from 'axios'

let axios = x.create({})

const API_URL = process.env.baseUrl
const REFRESHTOKEN_URL = 'https://securetoken.googleapis.com/v1/token'

export default {
  install (Vue, { storageKey, key, loader, signout }) {
    axios.defaults.baseURL = API_URL
    this.key = key
    this.storageKey = storageKey
    this.signout = signout
    this.auth = true
    this.fromCookie = {}

    axios.interceptors.request.use(config => {
      if (this.auth) {
        config.url = this.constructURL(config)
      }

      this.auth = true
      loader(true)
      return config
    })
    axios.interceptors.response.use(
      res => {
        loader(false)
        return res
      },
      ({ response }) => {
        loader(false)
        if (this._isInvalidToken(response)) {
          return this._refreshToken(response.config)
        }
      }
    )

    Vue.prototype.$forums = this
  },
  constructURL (config) {
    const index = config.url.indexOf('auth')
    if (index !== -1) {
      config.url = config.url.substring(0, index - 1)
    }
    const separator = config.url.indexOf('?') === -1 ? '?' : '&'
    return `${config.url}${separator}auth=${this.getIdToken()}`
  },
  fetchForums () {
    this.auth = false
    return axios.get('/forums.json')
  },
  fetchForum (id, req) {
    if (req) {
      this._extractCookies(req)
    }

    return axios.get(`/forums/${id}.json`)
  },
  addForum (forum) {
    return axios.post('/forums.json', forum)
  },
  addForumTopicId (id, topicId) {
    return axios.patch(`/forums/${id}/topicsId.json`, topicId)
  },
  updateForumAndTopicId (topics, id, topicsId) {
    return axios.patch(`/forums/${id}.json`, {
      topics,
      topicsId
    })
  },
  updateForum (id, forum) {
    return axios.patch(`/forums/${id}.json`, forum)
  },
  deleteForumTopicId (id, topicId) {
    return axios.patch(`/forums/${id}/topicsId.json`, topicId)
  },
  deleteForum (id) {
    return axios.delete(`/forums/${id}.json`)
  },
  fetchTopics (forumId, req) {
    if (req) {
      this._extractCookies(req)
    }
    return axios.get(`/topics.json?orderBy="forumId"&equalTo="${forumId}"`)
  },
  fetchPost (id) {
    return axios.get(`/posts/${id}.json`)
  },
  fetchTopic (id, req) {
    if (req) {
      this._extractCookies(req)
    }
    return axios.get(`/topics/${id}.json`)
  },
  addTopic (topic) {
    return axios.post('/topics.json', topic)
  },
  updateTopic (id, topic) {
    return axios.patch(`/topics/${id}.json`, topic)
  },
  addTopicPostId (id, postId) {
    return axios.patch(`/topics/${id}/postsId.json`, postId)
  },
  updateTopicAndPostId (replies, id, postsId) {
    return axios.patch(`/topics/${id}.json`, {
      replies,
      postsId
    })
  },
  deleteTopic (id) {
    return axios.delete(`/topics/${id}.json`)
  },
  fetchPosts ({ topicId, req }) {
    if (req) {
      this._extractCookies(req)
    }
    return axios.get(`/posts.json?orderBy="topicId"&equalTo="${topicId}"`)
  },
  addPost (post) {
    return axios.post('/posts.json', post)
  },
  updatePost (id, post) {
    return axios.patch(`/posts/${id}.json`, post)
  },
  deletePost (id) {
    return axios.delete(`/posts/${id}.json`)
  },
  deleteTopicPostId (id, postId) {
    return axios.delete(`/topics/${id}/postsId.json`, postId)
  },
  addUser (email) {
    this.auth = false
    return axios.post('/users.json', email)
  },
  getIdToken () {
    if (process.server) {
      return this.fromCookie.idToken || null
    } else {
      const storage = localStorage.getItem(this.storageKey)
      return storage ? JSON.parse(storage).idToken : null
    }
  },
  _refreshToken (req) {
    this.auth = false

    let storage
    if (process.client) {
      storage = localStorage.getItem(this.storageKey)
      if (!storage) {
        return Promise.reject('signout')
      }
    }

    return axios
      .post(`${REFRESHTOKEN_URL}?key=${this.key}`, {
        grant_type: 'refresh_token',
        refresh_token: process.server
          ? this.fromCookie.refreshToken
          : JSON.parse(storage).refreshToken
      })
      .then(({ data }) => {
        this._storeToken(data)
        return this._retry(req)
      })
      .catch(() => Promise.reject('signout'))
  },
  _retry (req) {
    return axios(req)
  },
  _storeToken ({ id_token, refresh_token, expires_in }) {
    if (process.server) {
      Cookie.set('idToken', id_token)
      Cookie.set('refreshToken', refresh_token)

      this.fromCookie = { idToken: id_token, refreshToken: refresh_token }
    } else {
      const storage = JSON.parse(localStorage.getItem(this.storageKey))
      localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          idToken: id_token,
          refreshToken: refresh_token,
          email: storage.email,
          expiresIn: expires_in
        })
      )
    }
  },
  _isInvalidToken ({ status }) {
    return status === 401
  },
  _extractCookies (req) {
    const idToken = this._fromCookie(req, 'idToken')
    const refreshToken = this._fromCookie(req, 'refreshToken')
    const email = this._fromCookie(req, 'email')

    if (idToken !== null && refreshToken !== null && email !== null) {
      this.fromCookie = { idToken, refreshToken, email }
    }
  },
  _fromCookie (req, name) {
    return req.headers.cookie
      ? req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith(`${name}=`))
          .split('=')[1]
      : null
  }
}
