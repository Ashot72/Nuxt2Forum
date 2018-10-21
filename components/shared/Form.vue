<template>
  <b-modal id="form" 
    v-model="showModal"
    centered lazy
    :header-bg-variant="'dark'"
    :header-text-variant="'light'"
    :footer-bg-variant="'light'"
    no-close-on-backdrop
    size="lg">
    <div slot="modal-header">
      <b><slot></slot></b>
    </div>                
    <b-container fluid>   
      <b-form-group 
        label="Subject"
        label-for="subject"
        :invalid-feedback="'Subject is Required'">                       
        <b-form-input
          type="text"
          ref="title"
          placeholder="Enter subject"
          :state = titleState             
          @input="$v.form.title.$touch()"                  
         v-model="form.title">                  
        </b-form-input>               
       </b-form-group>          
       <b-form-group
         label="Message"
         label-for="message"
         :invalid-feedback="'Nessage is Required'">
         <b-form-textarea
           type="text"
           placeholder="Enter message"
           :state = contentState  
           @input="$v.form.content.$touch()" 
           v-model="form.content"           
           :rows="5">
          </b-form-textarea>
        </b-form-group>       
        </b-container>
         <div slot="modal-footer">
           <b-btn class="float-right" variant="primary" @click="onAction" :disabled="$v.$invalid">
             <slot name="action"></slot>
           </b-btn>
           <b-btn class="float-right mr-2" @click="onClose">Close</b-btn>             
         </div>
     </b-modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      form: {
        title: '',
        content: '',
      },
      showModal: false,
    };
  },
  computed: {
    titleState() {
      const { title: { $dirty, $error } } = this.$v.form;
      return !$dirty ? null : !$error ? true : false;
    },
    contentState() {
      const { content: { $dirty, $error } } = this.$v.form;
      return !$dirty ? null : !$error ? true : false;
    },
  },
  methods: {
    onAction() {
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
      setTimeout(() => this.$refs.title.focus(), 0);
    },
    hide() {
      this.showModal = false;
    },
  },
  validations: {
    form: {
      title: { required },
      content: { required },
    },
  },
};
</script>
