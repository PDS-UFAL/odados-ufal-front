<template>
  <v-navigation-drawer
    permanent
    fixed
    color="grey-1"
    overlay-color="red"
    class="white--text"
    width="256px"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h5 snow-white--text">
          PGDC
        </v-list-item-title>
        <v-list-item-subtitle class="snow-white--text text-caption">
          Admin
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

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
  </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'Sidebar',
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
            path: '/about',
          },
        ],
      };
    },
  };
</script>

<style lang="scss" scoped>
  .active {
    background-color: var(--v-primary-base);
  }
</style>
