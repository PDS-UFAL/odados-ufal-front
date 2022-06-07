<template>
  <v-container class="px-sm-12"> </v-container>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'CreateUserModal',
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
        this.sectionsTable = data.form.sections;
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
