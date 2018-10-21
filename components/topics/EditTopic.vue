<template>
  <div>
    <b-link @click="showModal">Edit Topic</b-link>
    <app-form @onAction="submit" ref="modal">
      <slot></slot>
      <template slot="action">Update</template>
      <template slot="close">Cancel</template>
    </app-form>
   </div>
</template>

<script>
import Form from '@/components/shared/Form';
import { UPDATETOPIC } from '@/store/topic/action-types';

export default {
  name: 'editTopic',
  props: {
    form: {
      type: Object,
      default: () => ({
        id: '',
        forumId: '',
        title: '',
        content: '',
      }),
    },
  },
  methods: {
    submit(form) {
      if (form) {
        this.$store
          .dispatch(`topic/${UPDATETOPIC}`, {
            id: form.id,
            topic: { title: form.title },
          })
          .then(() => {
            this.$refs.modal.hide();
            setTimeout(
              () => this.$router.replace(`/topics/${this.form.forumId}`),
              150
            );
          });
      } else {
        this.$refs.modal.hide();
      }
    },
    showModal() {
      const clone = Object.assign({}, this.form);
      this.$refs.modal.show(clone);
    },
  },
  components: {
    appForm: Form,
  },
};
</script>