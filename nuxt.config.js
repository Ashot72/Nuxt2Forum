const pkg = require('./package')
const axios = require('axios')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: 'Nuxt.js 2.0 Forums',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Kavivanar'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: ['~node_modules/animate.css/animate.css'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/autosignin.js',
    '~plugins/event-bus.js',
    '~plugins/vuelidate.js',
    '~plugins/vue-plugin.js',
    '~plugins/date-filter.js'
  ],

  router: {
    extendRoutes (routes, resolve) {
      for (const route of routes) {
        route.props = /:/.test(route.path)
      }
      routes.push({
        path: '*',
        component: resolve(__dirname, 'pages/index.vue')
      })
    },
    scrollBehavior (to, from, savedPosition) {
      let position = { x: 0, y: 0 }

      if (to.hash) {
        position = { selector: to.hash }
      }

      if (savedPosition) {
        position = savedPosition
      }

      return new Promise(resolve => {
        setTimeout(() => resolve(position), 2000)
      })
    }
  },
  /*
  ** Nuxt.js modules
  */
  modules: ['bootstrap-vue/nuxt', '@nuxtjs/moment'],

  transition: {
    enterActiveClass: 'animated fadeInRight',
    leaveActiveClass: 'animated fadeOutLeft',
    mode: 'out-in'
  },

  env: {
    baseUrl: process.env.BASE_URL || 'https://vue-forums.firebaseio.com'
  },
  generate: {
    routes: function () {
      const routes = []
      let i = 0, postsLength = 0
      const url = 'https://vue-forums.firebaseio.com'

      return new Promise(resolve => {
        const forums = axios.get(`${url}/forums.json`)
        const posts = axios.get(`${url}/posts.json`)

        Promise.all([forums, posts]).then(([f, p]) => {
          const posts = axios.get(`${url}/posts.json?`)
          postsLength = Object.keys(p.data).length

          for (const forumKey in f.data) {
            const forum = axios.get(`${url}/forums/${forumKey}.json`)
            const topics = axios.get(
              `${url}/topics.json?orderBy="forumId"&equalTo="${forumKey}"`
            )

            Promise.all([forum, topics]).then(([f, t]) => {
              const topicResults = []
              for (const topicKey in t.data) {
                const tp = t.data[topicKey]
                tp.id = topicKey
                topicResults.push(tp)

                const topic = axios.get(`${url}/topics/${topicKey}.json`)
                const posts = axios.get(
                  `${url}/posts.json?orderBy="topicId"&equalTo="${topicKey}"`
                )

                Promise.all([topic, posts]).then(([t, p]) => {
                  const postResults = []
                  for (const postKey in p.data) {
                    postResults.push(p.data[postKey])
                    i++
                  }
                  routes.push({
                    route: `/posts/${forumKey}/${topicKey}`,
                    payload: { topic: t.data, posts: postResults }
                  })
                  if (i === postsLength) {
                    resolve(routes)
                  }
                })
              }
              routes.push({
                route: `/topics/${forumKey}`,
                payload: {
                  forumId: forumKey,
                  forum: f.data,
                  topics: topicResults
                }
              })
            })
          }
        })
      })
    }
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {}
  }
}
