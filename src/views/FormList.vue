<template>
  <v-container>
    <v-row class="pa-0 align-center mt-md-4 mb-8">
      <h3>Formulários</h3>
    </v-row>
    <v-row class="mx-0">
      <v-col class="pa-0">
        <v-data-table
          :headers="headers"
          :items="forms"
          class="elevation-2"
          disable-pagination
          hide-default-footer
          :loading="loading"
          loading-text="Carregando... Por favor aguarde"
        >
          <template slot="no-data">
            <div class="">Nenhum formulário encontrado</div>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn small icon @click="viewForm(item.id)">
              <v-icon> mdi-eye </v-icon>
            </v-btn>

            <v-btn
              small
              icon
              v-if="isAdmin"
              @click="openDeleteFormDialog(item)"
            >
              <v-icon> mdi-delete </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { formatDate } from '@/utils/formatDate';

  export default {
    data: () => {
      return {
        loading: true,
        forms: [],
        headers: [
          {
            text: 'Título',
            value: 'title',
            sortable: true,
            align: 'start',
            width: '40%',
          },
          { text: 'Ações', value: 'actions', sortable: false, align: 'end' },
        ],
      };
    },
    mounted() {
      this.loadForms();
    },
    methods: {
      ...mapActions(['fetchForms', 'deleteForm', 'setAlert']),
      formatDate,
      async loadForms() {
        this.loading = true;
        try {
          const { data } = await this.fetchForms({ params: this.params });
          this.forms = data.forms;
        } catch (err) {
          this.setAlert({
            alertMessage:
              err.response?.data.error ||
              'Ocorreu um erro ao carregar formulários.',
            alertColor: 'red',
          });
        } finally {
          this.loading = false;
        }
      },
      viewForm(id) {
        const routeName =
          this.getUser?.role === 'admin' ? 'VisualizationForm' : 'AnswerForm';
        this.$router.push({ name: routeName, params: { id } });
      },
    },
    computed: {
      ...mapGetters(['getUser']),
      isAdmin() {
        return this.getUser.role === 'admin';
      },
    },
  };
</script>

<style scoped></style>
