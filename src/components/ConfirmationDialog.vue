<template>
  <v-dialog v-model="show" :width="width" :persistent="persistent">
    <v-toolbar class="headline font-weight-bold">
      {{ title }}
    </v-toolbar>

    <v-card :width="width" tile>
      <v-card-text class="py-4 px-4" v-if="!!description">
        {{ description }}
      </v-card-text>

      <v-card-actions class="pt-4 px-4">
        <v-btn text @click="beforeCancel"> {{ cancelButton }} </v-btn>

        <v-spacer />

        <v-btn text color="primary" @click="beforeConfirm">
          {{ confirmButton }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'ConfirmationDialog',
    props: {
      width: {
        type: String,
        default: '400',
      },
      persistent: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default: null,
      },
      confirmButton: {
        type: String,
        default: 'Confirmar',
      },
      cancelButton: {
        type: String,
        default: 'Cancelar',
      },
    },
    data() {
      return {
        show: false,
        confirm: null,
        cancel: null,
      };
    },
    methods: {
      open(confirm = null, cancel = null) {
        this.show = true;

        this.confirm = confirm;
        this.cancel = cancel;
      },
      close() {
        this.show = false;
      },
      beforeCancel() {
        if (this.cancel) {
          this.cancel();
        }

        this.close();
      },
      beforeConfirm() {
        if (this.confirm) {
          this.confirm(this.text);
        }

        this.close();
      },
    },
  };
</script>

<style></style>
