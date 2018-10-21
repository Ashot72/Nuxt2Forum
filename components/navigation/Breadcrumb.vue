<template>
  <b-breadcrumb :items="items" class="nav"/>
</template>

<script>
import { FETCHFORUM } from '@/store/forum/action-types';
import { FETCHTOPIC } from '@/store/topic/action-types';

export default {
  data() {
    return {
      items: [],
    };
  },
  watch: {
    $route(to, from) {
      switch (to.name) {
        case 'index':
          this.genForumsItems();
          break;
        case 'topics-forumId':
          this.genTopicsItems(to.params.forumId);
          break;
        case 'posts-forumId-topicId':
          const { forumId, topicId } = to.params;
          this.genPostsItems(forumId, topicId);
          break;
      }
    },
  },
  methods: {
    getForumName(forumId) {
      return this.$store.dispatch(`forum/${FETCHFORUM}`, { forumId });
    },
    getTopicName(topicId) {
      return this.$store.dispatch(`topic/${FETCHTOPIC}`, { topicId });
    },
    genForumsItems() {
      this.items = [{ text: 'Home' }];
    },
    genTopicsItems(forumId) {
      this.getForumName(forumId).then(({ data }) => {
        this.items = [
          { text: 'Home', to: { name: 'index' } },
          { text: data.name },
        ];
      });
    },
    genPostsItems(forumId, topicId) {
      Promise.all([
        this.getForumName(forumId),
        this.getTopicName(topicId),
      ]).then(([{ data: fData }, { data: tData }]) => {
        this.items = [
          { text: 'Home', to: { name: 'index' } },
          {
            text: fData.name,
            to: { name: 'topics-forumId', params: { forumId } },
          },
          { text: tData.title },
        ];
      });
    },
  },
  created() {
    const params = this.$route.params;
    if (params.topicId) {
      const { forumId, topicId } = params;
      this.genPostsItems(forumId, topicId);
    } else if (params.forumId) {
      this.genTopicsItems(params.forumId);
    } else {
      this.genForumsItems();
    }
  },
};
</script>

<style scoped>
.breadcrumb {
  background-color: white;
  padding: 0.75rem 1rem 0 1rem;
}
.nav {
  height: 32px;
}
</style>
