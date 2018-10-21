<template>
  <app-signup-form @onAction="submit" ref="modal">Sign Up</app-signup-form>
</template>

<script>
import { SIGNUP } from '@/store/auth/action-types';
import { mapActions } from 'vuex';
import SignupForm from '@/components/auth/Signup/SignupForm';

export default {
  name: 'signup',
  data() {
    return {
      form: {
        email: '',
        password: '',
        confirmPassword: '',
      },
    };
  },
  components: {
    appSignupForm: SignupForm,
  },
  methods: {
    ...mapActions('auth', { signup: SIGNUP }),
    submit(form) {
      if (form) {
        this.form = form;
        const { email, password } = form;

        this.signup({ email, password });
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
    appSignupForm: SignupForm,
  },
};
</script>