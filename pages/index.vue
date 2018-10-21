<template>
  <div>
    <div v-show="isAuth" class="mt-3 mb-1">
    <add-forum></add-forum>   
    </div>  
    <b-container fluid>   
      <b-row class="header">
        <b-col cols="7" sm="6">Name</b-col>
        <b-col class="d-none d-sm-block" sm="2">Topics/Posts</b-col>
        <b-col cols="5" sm="4">Last Post</b-col>
      </b-row>
      <b-row class="mt-2" v-for="forum in forums" :key="forum.id">
        <b-col cols="7" sm="6">
          <b-link @click="checkAuth(forum.id)">{{ forum.name }}</b-link>
          <div>{{ forum.description }}</div>
          <b-col cols="12" class="d-sm-none pl-0">
            <span>Topics: <b-link @click="checkAuth(forum.id)">{{ forum.topics }}</b-link></span> 
            <span >Posts: <b-link @click="checkAuth(forum.id)">{{ forum.posts }}</b-link></span>
          </b-col>
        </b-col>
        <b-col class="d-none d-sm-block" sm="2">
          <div>Topics: <b-link @click="checkAuth(forum.id)">{{ forum.topics }}</b-link></div>
          <div>Posts: <b-link @click="checkAuth(forum.id)">{{ forum.posts }}</b-link></div>
        </b-col>
        <b-col cols="5" sm="4">
          <div><b-link @click="checkAuth" :to="{ name: `posts-forumId-topicId`, params: { forumId : forum.id, topicId: forum.lastTopicId }, hash: '#last' }">{{ forum.lastPost }}</b-link></div>
          <div v-show="forum.lastPoster">by {{ forum.lastPoster }}</div>
          <div>{{ forum.lastPostedDate | formatDate }}</div>
         </b-col>
     </b-row>         
    </b-container>  
    <app-confirm @onConfirm="closeDialog" ref="modal">
      Infromation
      <p slot="content">You must sign in to view topics and posts. Please signin.</p>
      <template slot="action">OK</template>
    </app-confirm>
    </div>
</template>

<script>
import AddForum from '@/components/forums/AddForum';
import Confirm from '@/components/shared/Confirm';

import { AUTH } from '@/store/auth/getter-types';
import { FETCHFORUMS } from '@/store/forum/action-types';

export default {
  name: 'forums',
  async fetch({ store }) {
    await store.dispatch(`forum/${FETCHFORUMS}`);
  },
  computed: {
    forums() {
      return this.$store.state.forum.forums;
    },
    isAuth() {
      return this.$store.getters[`auth/${AUTH}`];
    },
  },
  methods: {
    params(forumId) {
      return { name: 'topics-forumId', params: { forumId } };
    },
    closeDialog() {
      this.$refs.modal.hide();
    },
    checkAuth(forumId) {
      if (!this.isAuth) {
        this.$refs.modal.show();
      } else {
        this.$router.push(`/topics/${forumId}`);
      }
    },
  },
  components: {
    addForum: AddForum,
    appConfirm: Confirm,
  },
};
</script>

