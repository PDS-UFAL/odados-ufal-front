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
    <div
      v-if="
        ((loading_sends || loading_templates) && isAdmin) ||
        (loading_sends && !isAdmin)
      "
      class="spinner"
    >
      <circle-spinner
        :animation-duration="1000"
        :size="60"
        color="#0098DA"
        style="margin: auto"
      />

      <span style="color: #666666"><b>Carregando</b></span>
    </div>
    <div v-else>
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
      <v-card elevation="3" color="basil" flat outilined>
        <v-row class="mx-0">
          <v-col class="pa-0">
            <v-tabs-items v-model="tab">
              <v-tab-item style="padding: 8px" :value="'tab-1'">
                <div class="d-flex align-start" style="margin: 32px 0">
                  <div style="width: 25%; margin-right: 2rem">
                    <v-text-field
                      v-model="search_sends"
                      name="search_sends"
                      label="Pesquisar"
                      prepend-inner-icon="mdi-magnify"
                      outlined
                      dense
                      clearable
                      hide-details
                    />
                  </div>
                  <div style="width: 15%">
                    <v-select
                      :items="isAdmin ? items_admin : items_sector"
                      v-model="select"
                      label="Status do formulário"
                      dense
                      outlined
                      hide-details
                      @change="filterStatus"
                    />
                  </div>
                </div>
                <v-col class="pa-0">
                  <v-data-table
                    :headers="headers_1"
                    :search="search_sends"
                    :items="form_sends"
                    :item-class="itemRowBackground"
                    class="elevation-2"
                    :loading="loading_sends"
                    loading-text="Carregando... Por favor aguarde"
                  >
                    <template slot="no-data">
                      <div class="">Nenhum formulário encontrado</div>
                    </template>

                    <template v-slot:item.subtitle="{ item }">
                      <a v-if="isAdmin" @click="viewForm(item.form.id)">{{
                        item.subtitle
                      }}</a>
                      <a v-else @click="viewForm(item.id)">{{
                        item.subtitle
                      }}</a>
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

                    <template
                      v-if="isAdmin"
                      v-slot:item.totalResponses="{ item }"
                    >
                      {{ item.totalResponses }}
                    </template>

                    <template v-slot:item.actions="{ item }">
                      <v-btn
                        small
                        icon
                        v-if="isAdmin"
                        @click="viewForm(item.form.id)"
                      >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on"> mdi-eye </v-icon>
                          </template>
                          <span>Visualizar</span>
                        </v-tooltip>
                      </v-btn>

                      <v-btn small icon v-else @click="viewForm(item.id)">
                        <v-tooltip bottom v-if="item.status === 'open'">
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on"> mdi-pencil </v-icon>
                          </template>
                          <span>Responder</span>
                        </v-tooltip>

                        <v-tooltip bottom v-else>
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on"> mdi-eye </v-icon>
                          </template>
                          <span>Visualizar</span>
                        </v-tooltip>
                      </v-btn>

                      <v-btn
                        small
                        icon
                        v-if="isAdmin"
                        @click="openDeleteFormSendDialog(item)"
                      >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on"> mdi-delete </v-icon>
                          </template>
                          <span>Excluir</span>
                        </v-tooltip>
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-col>
              </v-tab-item>
              <v-tab-item style="padding: 8px" :value="'tab-2'">
                <div class="d-flex align-start" style="margin: 32px 0">
                  <div style="width: 25%; margin-right: 2rem">
                    <v-text-field
                      v-model="search_forms"
                      name="search_forms"
                      label="Pesquisar"
                      prepend-inner-icon="mdi-magnify"
                      outlined
                      dense
                      clearable
                      hide-details
                    />
                  </div>
                </div>
                <v-col class="pa-0">
                  <v-data-table
                    :headers="headers_2"
                    :search="search_forms"
                    :items="forms"
                    class="elevation-2"
                    :loading="loading_templates"
                    loading-text="Carregando... Por favor aguarde"
                    v-if="isAdmin"
                  >
                    <template slot="no-data">
                      <div class="">Nenhum formulário encontrado</div>
                    </template>

                    <template v-slot:item.title="{ item }">
                      <a @click="viewForm(item.id)">{{ item.title }}</a>
                    </template>

                    <template v-slot:item.created_at="{ item }">
                      {{ formatDate(item.created_at) }}
                    </template>

                    <template v-slot:item.actions="{ item }">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn small icon @click="viewForm(item.id)">
                            <v-icon v-on="on"> mdi-eye </v-icon>
                          </v-btn>
                        </template>
                        <span>Visualizar</span>
                      </v-tooltip>

                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn small icon @click="sendForm(item.id)">
                            <v-icon v-on="on"> mdi-file-send </v-icon>
                          </v-btn>
                        </template>
                        <span>Enviar Formulário</span>
                      </v-tooltip>

                      <v-btn
                        small
                        icon
                        v-if="isAdmin"
                        @click="openDeleteFormDialog(item)"
                      >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on"> mdi-delete </v-icon>
                          </template>
                          <span>Excluir</span>
                        </v-tooltip>
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-col>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { formatDate } from '@/utils/formatDate';
  import { chipStatusColor, translatedStatus } from '@/utils/statusUtils';
  import ConfirmationDialog from '@/components/ConfirmationDialog';
  import { HalfCircleSpinner } from 'epic-spinners';

  export default {
    components: {
      ConfirmationDialog,
      'circle-spinner': HalfCircleSpinner,
    },
    data: () => {
      return {
        tab: 'tab-1',
        search_sends: '',
        search_forms: '',
        select: 'Todos',
        items_admin: ['Todos', 'Abertos', 'Fechados', 'Não iniciados'],
        items_sector: [
          'Todos',
          'Abertos',
          'Fechados',
          'Não iniciados',
          'Respondidos',
        ],
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
            width: '20%',
          },
          {
            text: 'Modelo',
            value: 'form.title',
            sortable: true,
            align: 'start',
            width: '25%',
          },
          { text: 'Status', value: 'status', sortable: false, width: '20%' },
          {
            text: 'Respostas',
            value: 'totalResponses',
            sortable: false,
            width: '20%',
          },
          { text: 'Data inicial', value: 'start_date', sortable: true },
          { text: 'Data final', value: 'end_date', sortable: true },
          {
            text: 'Ações',
            value: 'actions',
            sortable: false,
            width: '15%',
            align: 'end',
          },
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
      if (this.isAdmin) {
        this.loadForms();
      } else {
        this.headers_1 = this.headers_1.filter(
          (header) => header.value != 'totalResponses',
        );
      }
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
      itemRowBackground(item) {
        if (this.isAdmin) return '';
        else return item.status === 'open' ? 'bg-gray' : '';
      },
      formatDate,
      chipStatusColor,
      translatedStatus,
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
          //      this.forms.forEach((form) => {
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
                if (!this.isAdmin) {
                  fsend.status = 'sectorHasAnswered';
                } else {
                  fsend.totalResponses =
                    question.responses.map((response) => response.sector)
                      .length +
                    '/' +
                    fsend.sectors?.length;
                }

                return;
              }
              fsend.totalResponses = '0/' + fsend.sectors.length;
            });
          });
          //   });
          this.loading_sends = false;
        }
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
          Fechados: 'closed',
          'Não iniciados': 'not_started',
          Respondidos: 'sectorHasAnswered',
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

<style>
  .bg-gray {
    background-color: #ebebeb;
  }
  .spinner {
    margin: auto;
    text-align: center;
    padding: 140px 0;
  }
</style>
