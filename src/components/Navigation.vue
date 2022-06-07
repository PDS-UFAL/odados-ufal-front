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
            title: 'Tela inicial',
            icon: 'mdi-home',
            path: '/',
            roles: ['admin', 'employee'],
          },
          {
            title: 'Criar Formulário',
            icon: 'mdi-text-box-plus',
            path: '/formulario',
            roles: ['admin'],
          },
          {
            title: 'Enviar Formulário',
            icon: 'mdi-file-send',
            path: '/enviar-formulario',
            roles: ['admin'],
          },
          {
            title: 'Inserir histórico',
            icon: 'mdi-clipboard-text-clock',
            path: '/inserir-historico',
            roles: ['admin'],
          },
          {
            title: 'Setores e Usuários',
            icon: 'mdi-domain',
            path: '/usuario/setor',
            roles: ['admin'],
          },
          // {
          //   title: 'Notificações',
          //   icon: 'mdi-bell',
          //   path: '/notificacoes',
          //   roles: ['admin', 'employee'],
          // },
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
