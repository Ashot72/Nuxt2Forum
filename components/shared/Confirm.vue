<template>
  <b-modal id="form" 
    v-model="showModal"
    centered lazy
    :header-bg-variant="'dark'"
    :header-text-variant="'light'"
    :footer-bg-variant="'light'"
    no-close-on-backdrop
    size="sm">
    <div slot="modal-header">
      <b><slot></slot></b>
    </div>
    <b-container fluid>             
      <slot name="content"></slot>                                                                    
    </b-container>
    <div slot="modal-footer">
      <b-btn class="float-right" variant="primary" @click="onConfirm">
        <slot name="action"></slot>
      </b-btn>
      <b-btn v-show="hasCloseSlot" class="float-right mr-2" @click="onClose">
        <slot name="close"></slot>
      </b-btn>             
    </div>
  </b-modal>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
    };
  },
  computed: {
    hasCloseSlot() {
      return !!this.$slots['close'];
    },
  },
  methods: {
    onConfirm() {
      this.$emit('onConfirm', true);
    },
    onClose() {
      this.$emit('onConfirm', false);
    },
    show() {
      this.showModal = true;
    },
    hide() {
      this.showModal = false;
    },
  },
};
</script>