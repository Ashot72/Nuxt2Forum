<template>
  <div>    
    <app-form @onAction="submit" ref="modal">
      Reply Post '{{ title }}'
      <template slot="action">Reply</template>
      <template slot="close">Cancel</template>
    </app-form>
   </div>
</template>

<script>
import Form from '@/components/shared/Form';
import { REPLYPOST } from '@/store/post/action-types';

export default {
  name: 'replyPost',
  data() {
    return {
      title: '',
    };
  },
  methods: {
    submit(form) {
      if (form) {
        form.creator = this.$store.state.auth.email;
        this.$store
          .dispatch(`post/${REPLYPOST}`, form)
          .then(() => this.$refs.modal.hide());
      } else {
        this.$refs.modal.hide();
      }
    },
    show(form) {
      this.title = form.title;
      const clone = Object.assign({}, form, { content: '' });
      this.$refs.modal.show(clone);
    },
  },
  components: {
    appForm: Form,
  },
};
</script>