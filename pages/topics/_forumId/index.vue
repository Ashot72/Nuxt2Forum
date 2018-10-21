<template>
  <div>
    <div class="mt-3 mb-1 links">
      <add-topic class="px-1" :forumId="$route.params.forumId" ></add-topic>
      <edit-forum v-show="forum.creator === email" class="px-1" :form="forum">
        <template>Edit Forum '{{ forum.name }}'</template>                
      </edit-forum>
      <b-link v-show="forum.creator === email" @click="deleteConfirm()" class="px-1">Delete forum</b-link>
    </div>    
    <b-container fluid>    
      <b-row class="header">
        <b-col cols="7" sm="6">Topics</b-col>
        <b-col class="d-none d-sm-block" sm="2">Replies/Views</b-col>
        <b-col cols="5" sm="4">Lastest Post</b-col>
      </b-row>
      <b-row  class="mt-2" v-for="topic in topics" :key="topic.id">
        <b-col cols="7" sm="6">
          <b-link :to="params(topic.id)">{{ topic.title }}</b-link>
          <div>by {{ topic.creator }}</div>
          <div>{{ topic.createdDate | formatDate }}</div>
          <b-col cols="12" class="d-sm-none pl-0">
            <span>Replies: <b-link :to="params(topic.id)">{{ topic.replies }}</b-link></span> 
            <span>Views: <b-link :to="params(topic.id)">{{ topic.views }}</b-link></span>
          </b-col>
        </b-col>
        <b-col class="d-none d-sm-block" sm="2">
          <div>Replies: <b-link :to="params(topic.id)">{{ topic.replies }}</b-link></div>
          <div>Views: <b-link :to="params(topic.id)">{{ topic.views }}</b-link></div>
        </b-col>
        <b-col cols="5" sm="4">
          <div> by {{ topic.creator }} </div>
          <div>{{ topic.createdDate | formatDate }}</div>
        </b-col>
      </b-row>  
    </b-container>
    <app-confirm @onConfirm="deleteForum" ref="deleteModal">
      Delete Forum
      <p slot="content">Are you sure you want to delete forum '{{ forum.name }}' ?</p>
      <template slot="action">Yes</template>
      <template slot="close">No</template>
    </app-confirm>         
  </div>
</template>

<script>
import AddTopic from '@/components/topics/AddTopic';
import EditForum from '@/components/forums/EditForum';
import Confirm from '@/components/shared/Confirm';

import { mapState, mapActions } from 'vuex';
import { AUTH } from '@/store/auth/getter-types';
import { DELETEFORUM } from '@/store/forum/action-types';
import { FETCHTOPICSFORUM, FETCHTOPICS } from '@/store/topic/action-types';

export default {
  name: 'topics',
  props: ['forumId'],
  asyncData(context) {
    // used only to generate static pages
    if (context.payload) {
      const {
        store,
        params,
        req,
        payload: { forumId, topics, forum },
      } = context;

      return {
        forumId,
        forum,
        topics: topics.sort((a, b) => {
          const dateA = new Date(a.createdDate).getTime();
          const dateB = new Date(b.createdDate).getTime();
          return dateB > dateA ? 1 : -1;
        }),
      };
    }
  },
  async fetch(context) {
    if (!context.payload) {
      const { store, params, req } = context;
      await store.dispatch(`topic/${FETCHTOPICS}`, {
        forumId: params.forumId,
        req,
      });

      await store.dispatch(`topic/${FETCHTOPICSFORUM}`, {
        forumId: params.forumId,
        req,
      });
    }
  },
  computed: {
    ...mapState('topic', ['forum', 'topics']),
    ...mapState('auth', ['email']),
  },
  methods: {
    ...mapActions('forum', { delete: DELETEFORUM }),
    params(topicId) {
      return {
        name: 'posts-forumId-topicId',
        params: { forumId: this.forumId, topicId },
      };
    },
    deleteConfirm() {
      this.$refs.deleteModal.show();
    },
    deleteForum(del) {
      if (del) {
        this.delete(this.forumId).then(() => {
          this.$refs.deleteModal.hide();
          setTimeout(() => this.$router.replace('/'), 150);
        });
      } else {
        this.$refs.deleteModal.hide();
      }
    },
  },
  components: {
    addTopic: AddTopic,
    editForum: EditForum,
    appConfirm: Confirm,
  },
};
</script>

<style scoped>
.links {
  display: flex;
}
</style>
