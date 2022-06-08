<template>
  <v-container class="px-sm-12">
    <v-row class="pa-0 align-center mt-md-4 mb-8">
      <v-btn @click="back" text fab small class="mr-2">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h3>Setores e Usuários</h3>
    </v-row>

    <v-row>
      <v-col cols="12" class="py-2">
        <v-btn-toggle v-model="text" tile color="primary accent-3" group>
          <v-btn light value="expand"> Expandir tudo </v-btn>
          <v-btn light value="collapse"> Recolher tudo </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <v-row>
      <v-expansion-panels v-model="panel" multiple>
        <users-sector-accordion
          v-for="(sector, i) in sectors"
          :key="i"
          :sector="sector"
          :users="sector.users"
        ></users-sector-accordion>
      </v-expansion-panels>
    </v-row>
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
        panel: [],
        text: '',
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

      updatePanel() {
        if (this.text === 'expand') {
          this.panel = Object.keys(this.sectors).map(Number);
        } else if (this.text === 'collapse') {
          this.panel = [];
        }
      },
    },
    watch: {
      text() {
        this.updatePanel();
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
