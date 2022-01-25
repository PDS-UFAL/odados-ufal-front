<template>
  <div>
    <Sidebar v-if="$vuetify.breakpoint.mdAndUp" :items="navigationItems" />
    <Mobile-Navigation v-else :items="navigationItems" />
  </div>
</template>

<script>
  import Sidebar from '@/components/Sidebar.vue';
  import MobileNavigation from '@/components/MobileNavigation.vue';
  import { mapGetters } from 'vuex';

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
            roles: ['admin', 'employee'],
          },
          {
            title: 'Formulário',
            icon: 'mdi-text-box-plus',
            path: '/forms',
            roles: ['admin'],
          },
          {
            title: 'Notificações',
            icon: 'mdi-bell',
            path: '/notifications',
            roles: ['admin', 'employee'],
          },
        ],
      };
    },
    computed: {
      ...mapGetters(['getUser']),
      navigationItems() {
        return this.items.filter((item) =>
          item.roles.includes(this.getUser?.role),
        );
      },
    },
  };
</script>

<style></style>
