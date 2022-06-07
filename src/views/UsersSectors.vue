<template>
  <v-container class="px-sm-12">
    <v-row class="pa-0 align-center mt-md-4 mb-8">
      <v-btn @click="back" text fab small class="mr-2">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h3>Setores e Usuários</h3>
    </v-row>

    <v-expansion-panels v-model="panel" multiple>
      <users-sector-accordion
        v-for="sector in sectors"
        :key="sector.id"
        :sector="sector"
        :users="sector.users"
      ></users-sector-accordion>
    </v-expansion-panels>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex';
  import UsersSectorAccordion from '../components/user/UsersSectorAccordion.vue';

  export default {
    name: 'UsersSectors',

    components: {
      UsersSectorAccordion,
    },

    data: () => {
      return {
        sectors: [],
      };
    },
    async mounted() {
      await this.loadSectors();
    },
    methods: {
      ...mapActions(['fetchSectors']),
      back() {
        this.$router.back();
      },

      async loadSectors() {
        const { data } = await this.fetchSectors({
          params: {
            show_users: 1,
          },
        });
        this.sectors = data.sectors;
      },
    },
  };
</script>

<style scoped lang="scss">
  .save-btn {
    position: fixed;
    bottom: 32px;
    right: 32px;
  }
</style>
