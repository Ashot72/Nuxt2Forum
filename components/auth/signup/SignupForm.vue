<template>
  <b-modal id="signup"
    v-model="showModal"
    centered lazy
    :header-bg-variant="'dark'"
    :header-text-variant="'light'"
    :footer-bg-variant="'light'"
    no-close-on-backdrop>
      <div slot="modal-header">
        <b><slot></slot></b>
      </div>
      <b-container fluid> 
        <b-form-group 
          label="Email"
          label-for="email"
          :invalid-feedback="invalidEmailFeedback">                       
            <b-form-input
              type="email"
              ref="email"
              placeholder="Enter Email"
              :state = emailState             
              @input="$v.form.email.$touch()"                  
              v-model="form.email">
            </b-form-input>               
         </b-form-group> 
         <b-form-group 
           label="Password"
           label-for="password"
           :invalid-feedback="invalidPasswordFeedback">                       
           <b-form-input
              type="password"
              placeholder="Enter Password"
              :state = passwordState             
              @input="$v.form.password.$touch()"                  
              v-model="form.password">
            </b-form-input>               
          </b-form-group>
          <b-form-group 
            label="Confirm Password"
            label-for="confirmPassword"
            :invalid-feedback="invalidConfirmPasswordFeedback">                       
              <b-form-input
                type="password"
                placeholder="Enter Confirm Password"
                :state = confirmPasswordState             
                @input="$v.form.confirmPassword.$touch()"                  
                v-model="form.confirmPassword">
              </b-form-input>               
          </b-form-group>
      </b-container>
      <div slot="modal-footer">
        <b-btn class="float-right" variant="primary" @click="onSignup" :disabled="$v.$invalid">Sign Up</b-btn>
        <b-btn class="float-right mr-2" @click="onClose">Close</b-btn>             
      </div>
   </b-modal>
</template>

<script>
import { required, email, sameAs, minLength } from 'vuelidate/lib/validators';
import { formMixin } from '@/components/auth/formMixin';
import axios from 'axios';

export default {
  name: 'SignupForm',
  data() {
    return {
      form: {
        email: '',
        password: '',
        confirmPassword: '',
      },
      showModal: false,
    };
  },
  computed: {
    confirmPasswordState() {
      const { confirmPassword: { $dirty, $error } } = this.$v.form;
      return !$dirty ? null : !$error ? true : false;
    },
    invalidConfirmPasswordFeedback() {
      const { confirmPassword: { required, minLen, sameAs } } = this.$v.form;

      if (!required) {
        return 'Confirm Password is required';
      } else if (!minLen) {
        return 'Confirm Password must be at least 6 characters in length';
      } else if (!sameAs) {
        return 'Please enter the same password as above';
      }
    },
  },
  methods: {
    onSignup() {
      if (!this.$v.$invalid) {
        this.$emit('onAction', this.form);
      }
    },
    onClose() {
      this.$emit('onAction', null);
    },
    show(form) {
      this.form = form;
      this.$v.$reset();
      this.showModal = true;
      setTimeout(() => this.$refs.email.focus(), 0);
    },
    hide() {
      this.showModal = false;
    },
  },
  mixins: [formMixin],
  validations: {
    form: {
      email: {
        required,
        email,
        unique: val => {
          if (val === '') return true;
          return axios
            .get(
              `${process.env.baseUrl}/users.json?orderBy="email"&equalTo="` +
                val +
                '"'
            )
            .then(({ data }) => Object.keys(data).length === 0);
        },
      },
      password: {
        required,
        minLen: minLength(6),
      },
      confirmPassword: {
        required,
        minLen: minLength(6),
        sameAs: sameAs('password'),
      },
    },
  },
};
</script>