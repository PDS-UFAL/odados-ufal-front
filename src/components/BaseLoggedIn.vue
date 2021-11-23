<template>
  <div>
    <Navigation />
    <div
      :class="{
        'side-margin': $vuetify.breakpoint.mdAndUp,
        'bottom-margin': !$vuetify.breakpoint.mdAndUp,
      }"
    >
      <router-view />
    </div>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation.vue';

  export default {
    name: 'BaseLoggedIn',
    components: {
      Navigation,
    },
  };
</script>

<style lang="scss" scoped>
  .side-margin {
    margin-left: 256px;
  }
  .bottom-margin {
    margin-bottom: 96px;
  }
</style>
