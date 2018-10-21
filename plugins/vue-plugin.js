import Vue from 'vue'
import { EventBus } from './event-bus'
import { LOADER_EVENT, KEY, STORAGE_KEY } from '../helpers/constants'
import Auth from '../store/plugins/auth'
import Forum from '../store/plugins/forum'

const loader = loading => {
  EventBus.$emit(LOADER_EVENT, loading)
}

Vue.use(Auth, { key: KEY, loader })
Vue.use(Forum, { storageKey: STORAGE_KEY, key: KEY, loader })
