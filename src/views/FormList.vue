<template>
  <v-container>
    <v-row class="pa-0 align-center mt-md-4 mb-8">
      <h3>Formulários</h3>
    </v-row>
    <v-card style="margin: 64px 0" elevation="2" color="basil" flat>
      <v-tabs centered v-model="tab">
        <v-tab href="#tab-1">ENVIOS</v-tab>
        <v-tab href="#tab-2">MODELOS</v-tab>
      </v-tabs>
    </v-card>
    <v-row class="mx-0">
      <v-col class="pa-0">
        <v-tabs-items v-model="tab">
          <v-tab-item style="padding: 8px" :value="'tab-1'">
            <v-select
              style="width: 256px; margin: 32px 0"
              :items="items"
              v-model="select"
              label="Tipo do campo de resposta"
              dense
              outlined
              hide-details
              @change="filterStatus"
            />
            <v-col class="pa-0">
              <v-data-table
                :headers="headers_1"
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

                <template v-slot:item.start_date="{ item }">
                  {{ formatDate(item.start_date) }}
                </template>

                <template v-slot:item.end_date="{ item }">
                  {{ formatDate(item.end_date) }}
                </template>

                <template v-slot:item.status="{ item }">
                  <v-icon size="17" :color="chipStatusColor(item.status)">
                    mdi-checkbox-blank-circle
                  </v-icon>
                  {{ translatedStatus(item.status) }}
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
          </v-tab-item>
          <v-tab-item style="padding: 8px" :value="'tab-2'">
            <v-col class="pa-0">
              <v-data-table
                :headers="headers_2"
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

                <template v-slot:item.end_date="{ item }">
                  {{ formatDate(item.end_date) }}
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
          </v-tab-item>
        </v-tabs-items>
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
        tab: null,
        select: 'Todos',
        items: ['Todos', 'Abertos', 'Finalizados', 'Não iniciados'],
        loading: true,
        forms: [],
        forms_backup: [],
        headers_1: [
          {
            text: 'Título',
            value: 'title',
            sortable: true,
            align: 'start',
            width: '40%',
          },
          { text: 'Status', value: 'status', sortable: false, width: '20%' },
          { text: 'Data inicial', value: 'start_date', sortable: true },
          { text: 'Data final', value: 'end_date', sortable: true },
          { text: 'Ações', value: 'actions', sortable: false, align: 'end' },
        ],
        headers_2: [
          {
            text: 'Título',
            value: 'title',
            sortable: true,
            align: 'start',
            width: '40%',
          },
          { text: 'Data de criação', value: 'end_date', sortable: true },
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
          this.forms_backup = data.forms;
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
      chipStatusColor(status) {
        return (
          {
            open: 'yellow',
            closed: 'green',
            not_started: 'red',
          }[status] || 'primary'
        );
      },
      translatedStatus(status) {
        return {
          open: 'Aberto',
          closed: 'Fechado',
          not_started: 'Não iniciado',
        }[status];
      },
      filterStatus() {
        const temp_hash = {
          Abertos: 'open',
          Fechados: 'closed',
          'Não iniciados': 'not_started',
        };
        if (this.select !== 'Todos')
          this.forms = this.forms_backup.filter(
            (item) => temp_hash[this.select] === item.status,
          );
        else this.forms = this.forms_backup;
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
