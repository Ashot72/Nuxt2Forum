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
        label="Name"
        label-for="name"
        :invalid-feedback="'Name is Required'">                       
        <b-form-input
          type="text"
          ref="name"
          placeholder="Enter name"
          :state = nameState             
          @input="$v.form.name.$touch()"                  
          v-model="form.name">                  
        </b-form-input>               
      </b-form-group>          
      <b-form-group
        label="Description"
        label-for="description"
        :invalid-feedback="'Description is Required'"> 
        <b-form-input
          type="text"               
          placeholder="Enter description"
          @input="$v.form.name.$touch()" 
          :state = descriptionState   
          v-model="form.description">
        </b-form-input>
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
        name: '',
        description: '',
      },
      showModal: false,
    };
  },
  computed: {
    nameState() {
      const { name: { $dirty, $error } } = this.$v.form;
      return !$dirty ? null : !$error ? true : false;
    },
    descriptionState() {
      const { description: { $dirty, $error } } = this.$v.form;
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
      setTimeout(() => this.$refs.name.focus(), 0);
    },
    hide() {
      this.showModal = false;
    },
  },
  validations: {
    form: {
      name: { required },
      description: { required },
    },
  },
};
</script>