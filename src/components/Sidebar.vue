<template>
  <v-navigation-drawer
    permanent
    fixed
    color="cloudy-grey"
    class="white--text"
    width="256px"
  >
    <v-layout align-center justify-center class="mt-4 mb-8">
      <v-img src="/logo_nameless.svg" max-width="50%" contain />
    </v-layout>

    <v-divider></v-divider>

    <v-list dense nav class="pa-0">
      <v-list-item
        v-for="item in items"
        :key="item.title"
        link
        active-class="active"
        :to="item.path"
        class="rounded-0"
      >
        <v-list-item-icon class="d-flex mx-2">
          <v-icon color="snow-white">{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="snow-white--text">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-list-item @click="logout">
        <v-list-item-icon class="d-flex mx-2">
          <v-icon color="snow-white">mdi-logout</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="snow-white--text"> Sair </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'Sidebar',
    props: {
      items: {
        type: Array,
        default: () => [],
      },
    },
    methods: {
      ...mapActions(['setAuthToken', 'setUser']),
      logout() {
        this.setAuthToken({ token: null });
        this.setUser({ user: null });
        this.$router.push({ name: 'Login' });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .active {
    background-color: var(--v-primary-base);
  }
</style>
