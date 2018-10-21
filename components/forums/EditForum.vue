<template>
  <div>
    <b-link @click="showModal">Edit Forum</b-link>
    <app-form @onAction="submit" ref="modal">
      <slot></slot>
      <template slot="action">Update</template>
      <template slot="close">Cancel</template>
    </app-form>
   </div>
</template>

<script>
import Form from '@/components/forums/form';
import { UPDATEFORUM } from '@/store/forum/action-types';

export default {
  name: 'editForum',
  props: {
    form: {
      type: Object,
      default: () => ({
        name: '',
        description: '',
      }),
    },
  },
  methods: {
    submit(form) {
      if (form) {
        this.$store.dispatch(`forum/${UPDATEFORUM}`, form).then(() => {
          this.$refs.modal.hide();
          setTimeout(() => this.$router.replace('/'), 150);
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