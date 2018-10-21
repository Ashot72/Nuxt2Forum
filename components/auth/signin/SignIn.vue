<template>
  <app-signin-form @onAction="submit" ref="modal">Sign In</app-signin-form>
</template>

<script>
import { SIGNIN } from '@/store/auth/action-types';
import { mapActions } from 'vuex';
import SigninForm from '@/components/auth/Signin/SigninForm';

export default {
  name: 'signin',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    ...mapActions('auth', { signin: SIGNIN }),
    submit(form) {
      if (form) {
        this.form = form;
        const { email, password } = form;

        this.signin({ email, password });
        this.$refs.modal.hide();
      } else {
        this.$refs.modal.hide();
      }
    },
    show() {
      const clone = Object.assign({}, this.form);
      this.$refs.modal.show(clone);
    },
  },
  components: {
    appSigninForm: SigninForm,
  },
};
</script>
