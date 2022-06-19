<template>
  <v-container class="px-sm-12">
    <div v-if="loading" class="spinner">
      <circle-spinner
        :animation-duration="1000"
        :size="60"
        color="#0098DA"
        style="margin: auto"
      />
      <span style="color: #666666"><b>Carregando</b></span>
    </div>
    <div v-else>
      <v-row class="pa-0 align-center mt-md-4 mb-8">
        <v-btn @click="back" text fab small class="mr-2">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <h3 v-if="form">{{ form.title }}</h3>
      </v-row>

      <div style="margin-bottom: 3rem" v-if="form.description">
        <h5 style="color: #9ca3af">Descrição</h5>
        <p style="color: #64748b">{{ form.description }}</p>
      </div>
      <v-card v-else elevation="3" color="basil" outilined flat>
        <v-tabs centered v-model="tab">
          <v-tab href="#tab-1">SETORES</v-tab>
          <v-tab href="#tab-2">ENVIOS</v-tab>
          <v-tab href="#tab-3">PERGUNTAS</v-tab>
          <v-tab href="#tab-4">RESPOSTAS ({{ responsesCount }})</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item style="padding: 8px" :value="'tab-1'">
            <v-card color="basil" flat>
              <h2>Setores</h2>
              <div>
                <v-card
                  v-for="item in sectors"
                  :key="item"
                  style="margin: 16px 0"
                  flat
                  elevation="3"
                >
                  <v-card-title
                    >{{ item.abbreviation }} — {{ item.name }}
                  </v-card-title>
                  <v-row>
                    <v-col>
                      <v-card-text>
                        <b> Responsável:</b> {{ item.responsible }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-card>
              </div>
            </v-card>
          </v-tab-item>
          <v-tab-item style="padding: 8px" :value="'tab-2'">
            <v-card color="basil" flat>
              <h2>Envios</h2>
              <div>
                <v-card
                  v-for="item in formSends"
                  :key="item"
                  style="margin: 16px 0"
                  flat
                  elevation="3"
                >
                  <v-card-title>{{ item.subtitle }} </v-card-title>
                  <v-card-subtitle>
                    <v-icon size="10" :color="chipStatusColor(item.status)">
                      mdi-checkbox-blank-circle
                    </v-icon>
                    <span style="height: 10px">
                      {{ translatedStatus(item.status) }}</span
                    >
                  </v-card-subtitle>
                  <v-row>
                    <v-col>
                      <v-card-text>
                        <b>Data de abertura:</b>
                        {{ formatDate(item.start_date) }}</v-card-text
                      >
                    </v-col>
                    <v-col>
                      <v-card-text>
                        <b>Data de fechamento:</b>
                        {{ formatDate(item.end_date) }}</v-card-text
                      >
                    </v-col>

                    <v-col>
                      <v-card-text> <b>Ano:</b> {{ item.year }}</v-card-text>
                    </v-col>
                  </v-row>
                </v-card>
              </div>
            </v-card>
          </v-tab-item>
          <v-tab-item style="padding: 8px" :value="'tab-3'">
            <v-card color="basil" flat>
              <h2>Perguntas</h2>
              <div>
                <question-card
                  v-for="question in questions"
                  :key="question.id"
                  class="my-4"
                  :question="question"
                  :disabled="true"
                />
              </div>
            </v-card>
          </v-tab-item>
          <v-tab-item style="padding: 8px" :value="'tab-4'">
            <v-card color="basil" flat>
              <h2 style="padding-left: 8px">Respostas</h2>
              <br />
            </v-card>
            <div style="padding: 8px">
              <v-row>
                <v-col cols="10" md="6">
                  <v-select
                    label="Ano(s)"
                    v-model="yearsSelected"
                    :items="years"
                    item-text="value"
                    outlined
                    multiple
                    return-object
                  ></v-select>
                </v-col>
                <v-col cols="10" md="6">
                  <v-select
                    label="Formulário(s) Enviado(s)"
                    v-model="formSendSelected"
                    :items="formSends"
                    item-text="subtitle"
                    outlined
                    multiple
                    return-object
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="18">
                  <v-select
                    label="Setor(es)"
                    v-model="sectorsSelected"
                    :items="sectors"
                    item-text="name"
                    outlined
                    multiple
                    return-object
                  ></v-select>
                </v-col>
              </v-row>

              <div
                v-if="
                  yearsSelected.length === 0 ||
                  formSendSelected.length === 0 ||
                  sectorsSelected.length === 0 ||
                  responsesCount === 0
                "
                class="alert alert-warning"
                role="alert"
              >
                Nenhuma Resposta Encontrada.
                <span v-if="responsesCount > 0"
                  >Por favor selecione todos os filtros.</span
                >
              </div>
              <div v-else>
                <v-btn @click="downloadAll">Baixar respostas</v-btn>
                <section-responses
                  v-for="section in sections"
                  :key="section.id"
                  :section="section"
                  :sectorsSelected="sectorsSelected"
                  :formSends="formSendSelected"
                  :years="yearsSelected"
                >
                </section-responses>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </div>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import QuestionCard from '@/components/form/questions/QuestionCard';
  // import ResponseCard from '@/components/form/responses/ResponseCard';
  import { chipStatusColor, translatedStatus } from '@/utils/statusUtils';
  import { formatDate } from '@/utils/formatDate';
  import SectionResponses from '@/components/form/responses/SectionResponses';
  import { HalfCircleSpinner } from 'epic-spinners';

  export default {
    components: {
      QuestionCard,
      // ResponseCard,
      SectionResponses,
      'circle-spinner': HalfCircleSpinner,
    },
    data: () => {
      return {
        form: null,
        tab: null,
        questions: [],
        sections: [],
        responsesCount: 0,
        sectorsSelected: [],
        formSendSelected: [],
        yearsSelected: [],
        sectors: [],
        formSends: [],
        years: new Set(),
        loading: false,
      };
    },
    beforeMount() {
      if (!this.isAdmin()) this.$router.push({ name: 'Home' });
    },
    async mounted() {
      this.tab = 'tab-4';
      // await this.loadForm();
      await this.loadForm();
    },
    methods: {
      ...mapActions(['fetchFormWithFormSends', 'fetchFormSends']),
      formatDate,
      chipStatusColor,
      translatedStatus,
      isAdmin() {
        return this.getUser.role === 'admin';
      },
      back() {
        this.$router.back();
      },

      async loadForm() {
        this.loading = true;
        const { data } = await this.fetchFormWithFormSends({
          id: this.$route.params.id,
        });

        this.form = { ...data.form };

        this.formSends = this.form.form_sends;

        this.years = this.formSends.map((formSend) => ({
          value: formSend.year,
          disabled: false,
        }));

        this.years.sort();

        this.sections = this.form.sections;

        this.sections.forEach((section) => {
          if (section.questions !== undefined) {
            this.questions.push(...section.questions);
          }
        });

        this.sectors = this.form.sectors;

        if (this.sectors.length == 1) {
          this.sectorsSelected = this.sectors;
        }

        this.questions.forEach((question) => {
          if (question.responses !== undefined) {
            this.responsesCount = question.responses.length;
          }

          question.responses = question.responses.map((response) => ({
            ...response,
            title: question.title,
            question_id: question.id,
            sector_id: response.sector_id,
            sector_name: this.getSectorNameById(response.sector_id),
            form_send_name: this.getFormSendNameById(response.fsend),
          }));
        });
        this.loading = false;
      },

      updateYearsSelected() {
        this.formSendSelected = [];

        this.formSendSelected = this.formSends.filter((formSend) => {
          return this.yearsSelected.some((year) => {
            return year.value === formSend.year;
          });
        });
      },
      updateformSendSelected() {},
      getSectorNameById(sectorId) {
        let sect = this.sectors.filter((sector) => {
          return sectorId == sector.id;
        });

        if (sect.length === 0) {
          return '';
        } else {
          return sect[0].abbreviation;
        }
      },

      getFormSendNameById(formSendId) {
        let fSend = this.formSends.filter((formSend) => {
          return formSendId == formSend.id;
        });

        if (fSend.length === 0) {
          return '';
        } else {
          return fSend[0].year.toString() === fSend[0].subtitle
            ? fSend[0].year
            : fSend[0].year + ' - ' + fSend[0].subtitle;
        }
      },
      createCSV() {
        let csvRows = [];
        let rowToAdd, formSendResponses;

        csvRows.push('Ano de envio,Seção,Pergunta,Setor,Resposta');

        this.formSendSelected.forEach((form_send) => {
          this.form.sections.forEach((section) => {
            section.questions.forEach((question) => {
              formSendResponses = question.responses.filter(
                (response) => response.fsend === form_send.id,
              );
              formSendResponses.forEach((response) => {
                rowToAdd = [
                  form_send.year,
                  section.name,
                  question.title,
                  response.sector_name,
                  response.answer,
                ].join(',');
                csvRows.push(rowToAdd);
              });
            });
          });
        });

        return csvRows;
      },
      async downloadAll() {
        let csv_data = this.createCSV();

        const blob = new Blob([csv_data.join('\n')], { type: 'text/csv' });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');

        a.setAttribute('href', url);

        a.setAttribute('download', this.form.title.concat('.csv'));

        a.click();
      },
    },
    computed: {
      ...mapGetters(['getUser']),
    },
    watch: {
      yearsSelected() {
        this.updateYearsSelected();
      },
      // formSendSelected() {
      //   this.updateFormSend();
      // },
    },
  };
</script>

<style scoped>
  .spinner {
    margin: auto;
    text-align: center;
    padding: 210px 0;
  }
</style>
