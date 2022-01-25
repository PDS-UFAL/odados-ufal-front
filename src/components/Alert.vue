<template>
  <div>
    <v-snackbar
      :value="alertState"
      @input="setAlertState"
      :color="alertColor"
      :timeout="alertTimeout"
    >
      {{ alertMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn icon v-bind="attrs" @click="setAlertState(false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'Alert',
    computed: {
      ...mapGetters([
        'alertState',
        'alertMessage',
        'alertColor',
        'alertTimeout',
      ]),
    },
    methods: {
      ...mapActions(['setAlertState']),
    },
  };
</script>

<style></style>
