<template>
  <div>
    <b-link @click="showModal">Add New Forum</b-link>
    <app-form @onAction="submit" ref="modal">
      Add New Forum 
      <template slot="action">Add</template>
      <template slot="close">Cancel</template>
    </app-form>
   </div>
</template>

<script>
import Form from '@/components/forums/form';
import { ADDFORUM } from '@/store/forum/action-types';

export default {
  name: 'addForum',
  methods: {
    submit(form) {
      if (form) {
        this.$store
          .dispatch(`forum/${ADDFORUM}`, form)
          .then(() => this.$refs.modal.hide());
      } else {
        this.$refs.modal.hide();
      }
    },
    showModal() {
      const form = {
        name: '',
        description: '',
        topics: 0,
        posts: 0,
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
