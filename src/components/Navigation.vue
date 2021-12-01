<template>
  <div>
    <Sidebar v-if="$vuetify.breakpoint.mdAndUp" :items="items" />
    <Mobile-Navigation v-else :items="items" />
  </div>
</template>

<script>
  import Sidebar from '@/components/Sidebar.vue';
  import MobileNavigation from '@/components/MobileNavigation.vue';

  export default {
    name: 'Navigation',
    components: {
      MobileNavigation,
      Sidebar,
    },
    data: () => {
      return {
        items: [
          {
            title: 'Home',
            icon: 'mdi-home',
            path: '/',
          },
          {
            title: 'Formulários',
            icon: 'mdi-text-box',
            path: '/forms',
          },
          {
            title: 'Notificações',
            icon: 'mdi-bell',
            path: '/notifications',
          },
        ],
      };
    },
  };
</script>

<style></style>
