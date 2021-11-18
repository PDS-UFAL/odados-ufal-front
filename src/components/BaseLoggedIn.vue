<template>
  <div>
    <Sidebar />
    <div class="side-margin px-12">
      <router-view />
    </div>
  </div>
</template>

<script>
  import Sidebar from '@/components/Sidebar.vue';

  export default {
    name: 'BaseLoggedIn',
    components: {
      Sidebar,
    },
  };
</script>

<style lang="scss" scoped>
  .side-margin {
    margin-left: 256px;
  }
</style>
