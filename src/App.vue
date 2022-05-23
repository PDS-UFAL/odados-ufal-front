<template>
  <v-app
    id="app"
    :style="{ background: $vuetify.theme.themes[theme].background }"
  >
    <router-view />

    <Alert />
  </v-app>
</template>

<script>
  import Alert from '@/components/Alert.vue';

  export default {
    components: {
      Alert,
    },
    computed: {
      theme() {
        return this.$vuetify.theme.dark ? 'dark' : 'light';
      },
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
