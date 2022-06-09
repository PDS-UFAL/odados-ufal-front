<template>
  <v-container>
    <confirmation-dialog
      ref="showDeleteFormDialog"
      width="400"
      title="Apagar o modelo de formulário?"
      description="Esta ação não pode ser desfeita."
      confirmButton="Apagar"
    />
    <confirmation-dialog
      ref="showDeleteFormSendDialog"
      width="400"
      title="Apagar o envio de formulário?"
      description="Esta ação não pode ser desfeita."
      confirmButton="Apagar"
    />
    <v-row class="pa-0 align-center mt-md-4 mb-8">
      <h3>Formulários</h3>
    </v-row>
    <v-card
      v-if="isAdmin"
      style="margin: 64px 0"
      elevation="2"
      color="basil"
      flat
    >
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
                :items="form_sends"
                class="elevation-2"
                disable-pagination
                hide-default-footer
                :loading="loading_sends"
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
                  <v-btn
                    small
                    icon
                    v-if="isAdmin"
                    @click="viewForm(item.form.id)"
                  >
                    <v-icon> mdi-eye </v-icon>
                  </v-btn>

                  <v-btn small icon v-else @click="viewForm(item.id)">
                    <v-icon v-if="item.status === 'open'"> mdi-pencil </v-icon>
                    <v-icon v-else> mdi-eye </v-icon>
                  </v-btn>

                  <v-btn
                    small
                    icon
                    v-if="isAdmin"
                    @click="openDeleteFormSendDialog(item)"
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
                :loading="loading_templates"
                loading-text="Carregando... Por favor aguarde"
                v-if="isAdmin"
              >
                <template slot="no-data">
                  <div class="">Nenhum formulário encontrado</div>
                </template>

                <template v-slot:item.created_at="{ item }">
                  {{ formatDate(item.created_at) }}
                </template>

                <template v-slot:item.actions="{ item }">
                  <v-btn small icon @click="viewForm(item.id)">
                    <v-icon> mdi-eye </v-icon>
                  </v-btn>

                  <v-btn small icon @click="sendForm(item.id)">
                    <v-icon> mdi-file-send </v-icon>
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
  import ConfirmationDialog from '@/components/ConfirmationDialog';

  export default {
    components: {
      ConfirmationDialog,
    },
    data: () => {
      return {
        tab: 'tab-1',
        select: 'Todos',
        items: ['Todos', 'Abertos', 'Finalizados', 'Não iniciados'],
        loading_sends: true,
        loading_templates: true,
        forms: [],
        form_sends: [],
        form_sends_backup: [],
        headers_1: [
          {
            text: 'Título',
            value: 'subtitle',
            sortable: true,
            align: 'start',
            width: '25%',
          },
          {
            text: 'Modelo',
            value: 'form.title',
            sortable: true,
            align: 'start',
            width: '25%',
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
          { text: 'Data de criação', value: 'created_at', sortable: true },
          { text: 'Ações', value: 'actions', sortable: false, align: 'end' },
        ],
      };
    },
    mounted() {
      if (this.isAdmin) this.loadForms();
      this.loadFormSends();
    },
    methods: {
      ...mapActions([
        'fetchForms',
        'fetchFormSends',
        'deleteForm',
        'deleteFormSend',
        'setAlert',
      ]),
      formatDate,
      async loadForms() {
        this.loading_templates = true;
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
          this.loading_templates = false;
        }
      },
      async loadFormSends() {
        this.loading_sends = true;
        try {
          const { data } = await this.fetchFormSends({
            params: this.params,
          });
          this.form_sends = data.form_sends.filter((item) => !item.is_history);
          this.form_sends_backup = this.form_sends;
        } catch (err) {
          this.setAlert({
            alertMessage:
              err.response?.data.error ||
              'Ocorreu um erro ao carregar formulários.',
            alertColor: 'red',
          });
        } finally {
          this.form_sends.forEach((fsend) => {
            let all_questions = [];

            let sections_questions = fsend.form.sections.map((section) => {
              return section.questions;
            });

            for (let i = 0; i < sections_questions.length; i++) {
              all_questions = all_questions.concat(sections_questions[i]);
            }
            all_questions.map((question) => {
              if (question.responses?.length > 0) {
                fsend.status = 'sectorHasAnswered';
                return;
              }
            });
          });
          this.loading_sends = false;
        }
      },
      chipStatusColor(status) {
        return (
          {
            open: 'yellow',
            closed: 'red',
            not_started: 'red',
            sectorHasAnswered: 'green',
          }[status] || 'primary'
        );
      },
      translatedStatus(status) {
        return {
          open: 'Aberto',
          closed: 'Fechado',
          not_started: 'Não iniciado',
          sectorHasAnswered: 'Respondido',
        }[status];
      },
      openDeleteFormDialog(form) {
        this.$refs.showDeleteFormDialog.open(() => {
          this.deleteFormHandler(form);
        });
      },
      openDeleteFormSendDialog(form) {
        this.$refs.showDeleteFormSendDialog.open(() => {
          this.deleteFormSendHandler(form);
        });
      },
      async deleteFormHandler(form) {
        try {
          await this.deleteForm({ id: form.id });
          await this.loadForms();
        } catch (err) {
          this.setAlert({
            alertMessage:
              err.response?.data.error ||
              'Ocorreu um erro ao deletar o modelo de formulário.',
            alertColor: 'red',
          });
        }
      },
      async deleteFormSendHandler(form) {
        try {
          await this.deleteFormSend({ id: form.id });
          await this.loadFormSends();
        } catch (err) {
          this.setAlert({
            alertMessage:
              err.response?.data.error ||
              'Ocorreu um erro ao deletar o envio de formulário.',
            alertColor: 'red',
          });
        }
      },
      filterStatus() {
        const temp_hash = {
          Abertos: 'open',
          Finalizados: 'closed',
          'Não iniciados': 'not_started',
        };
        if (this.select !== 'Todos')
          this.form_sends = this.form_sends_backup.filter(
            (item) => temp_hash[this.select] === item.status,
          );
        else this.form_sends = this.form_sends_backup;
      },
      viewForm(id) {
        const routeName =
          this.getUser?.role === 'admin' ? 'VisualizationForm' : 'AnswerForm';
        this.$router.push({ name: routeName, params: { id } });
      },
      sendForm(id) {
        this.$router.push({ name: 'SendForms', params: { id } });
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
