<template>
  <div>    
    <app-form @onAction="submit" ref="modal">
      Edit Post '{{ title }}'
      <template slot="action">Update</template>
      <template slot="close">Cancel</template>
    </app-form>
   </div>
</template>

<script>
import Form from '@/components/shared/Form';
import { UPDATEPOST } from '@/store/post/action-types';

export default {
  name: 'editPost',
  data() {
    return {
      title: '',
    };
  },
  methods: {
    submit(form) {
      if (form) {
        this.$store
          .dispatch(`post/${UPDATEPOST}`, form)
          .then(() => this.$refs.modal.hide());
      } else {
        this.$refs.modal.hide();
      }
    },
    show(form) {
      this.title = form.title;
      const clone = Object.assign({}, form);
      this.$refs.modal.show(clone);
    },
  },
  components: {
    appForm: Form,
  },
};
</script>