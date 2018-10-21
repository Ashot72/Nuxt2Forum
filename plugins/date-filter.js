import Vue from 'vue'
import moment from 'moment'

Vue.filter('formatDate', value => {
  if (value) return moment(value).format('MMMM Do YYYY, h:mm:ss a')
})
