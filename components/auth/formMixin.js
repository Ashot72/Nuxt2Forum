export const formMixin = {
  computed: {
    emailState () {
      const { email: { $dirty, $error } } = this.$v.form
      return !$dirty ? null : !$error
    },
    invalidEmailFeedback () {
      const { email } = this.$v.form

      if (!email.required) {
        return 'Email is required'
      } else if (!email.email) {
        return 'Please enter a valid Email'
      } else if (email.unique !== undefined && !email.unique) {
        return `Email '${email.$model}' is taken`
      }
    },
    passwordState () {
      const { password: { $dirty, $error } } = this.$v.form
      return !$dirty ? null : !$error
    },
    invalidPasswordFeedback () {
      const { password } = this.$v.form

      if (!password.required) {
        return 'Password is required'
      } else if (!password.minLen) {
        return 'Password must be at least 6 characters in length'
      }
    }
  }
}
