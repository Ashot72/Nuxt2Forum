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
     </b-container>
   <div slot="modal-footer">         
     <b-btn class="float-right" variant="primary" @click="onSignin" :disabled="$v.$invalid">Sign In</b-btn>
     <b-btn class="float-right mr-2" @click="onClose">Close</b-btn>             
   </div>
  </b-modal>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators';
import { formMixin } from '@/components/auth/formMixin';

export default {
  name: 'signupForm',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      showModal: false,
    };
  },
  methods: {
    onSignin() {
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
      email: { required, email },
      password: { required, minLen: minLength(6) },
    },
  },
};
</script>