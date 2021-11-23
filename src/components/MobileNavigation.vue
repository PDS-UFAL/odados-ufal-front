<template>
  <div>
    <v-app-bar color="cloudy-grey" elevation="0" dark>
      <v-toolbar-title class="d-flex mx-auto"> PGDC </v-toolbar-title>
    </v-app-bar>

    <v-bottom-navigation v-model="value" fixed>
      <v-btn
        v-for="item in items"
        :key="item.title"
        :value="item.title"
        :to="item.path"
      >
        <span>{{ item.title }}</span>

        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
  export default {
    name: 'MobileNavigation',
    props: {
      items: {
        type: Array,
        default: () => [],
      },
    },
  };
</script>

<style></style>
