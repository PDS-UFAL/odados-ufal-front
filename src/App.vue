<template>
  <v-app id="app">
    <router-view />

    <Alert />
  </v-app>
</template>

<script>
  import Alert from '@/components/Alert.vue';

  export default {
    name: 'Login',
    components: {
      Alert,
    },
  };
</script>

<style lang="scss">
  body {
    padding: 0;
    margin: 0;
    overflow: hidden;
  }

  html {
    overflow: auto !important;
  }
</style>
