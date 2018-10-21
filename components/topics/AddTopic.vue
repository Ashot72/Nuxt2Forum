<template>
  <div>
    <b-link @click="showModal">Add New Topic</b-link>
    <app-form @onAction="submit" ref="modal">
      Add New Topic
      <template slot="action">Add</template>
      <template slot="close">Cancel</template>
    </app-form>
   </div>
</template>

<script>
import Form from '@/components/shared/Form';
import { ADDTOPIC } from '@/store/topic/action-types';

export default {
  name: 'addTopic',
  props: ['forumId'],
  methods: {
    submit(form) {
      if (form) {
        form.forumId = this.forumId;
        this.$store
          .dispatch(`topic/${ADDTOPIC}`, form)
          .then(() => this.$refs.modal.hide());
      } else {
        this.$refs.modal.hide();
      }
    },
    showModal() {
      const form = {
        forumId: 0,
        title: '',
        content: '',
        views: 0,
        replies: 0,
        creator: this.$store.state.auth.email,
      };
      this.$refs.modal.show(form);
    },
  },
  components: {
    appForm: Form,
  },
};
</script>