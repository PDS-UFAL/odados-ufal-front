<template>
  <v-container class="px-sm-12">
    <v-row class="pa-0 align-center mt-md-4 mb-8">
      <v-btn @click="back" text fab small class="mr-2">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h3 v-if="form">{{ form.title }}</h3>
    </v-row>
    <v-tabs centered v-model="tab">
      <v-tab href="#tab-1">PERGUNTAS</v-tab>
      <v-tab href="#tab-2">RESPOSTAS ({{ responsesCount }})</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item style="padding: 8px" :value="'tab-1'">
        <v-card color="basil" flat>
          <h3>Perguntas</h3>
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
      <v-tab-item style="padding: 8px" :value="'tab-2'">
        <v-card color="basil" flat>
          <h3>Respostas</h3>
          <br />
        </v-card>
        <div style="padding: 8px">
          <v-row>
            <v-col cols="10" md="6">
              <v-select
                label="Formulário Enviado"
                v-model="formSendSelected"
                :items="formSends"
                item-text="subtitle"
                outlined
                return-object
              ></v-select>
            </v-col>
            <v-col cols="10" md="6">
              <v-select
                label="Setor(es)"
                v-model="sectorsSelected"
                :items="sectors"
                item-text="name"
                outlined
                return-object
              ></v-select>
            </v-col>
          </v-row>
          <v-btn @click="downloadAll">Baixar respostas</v-btn>

          <div v-if="sectors.length === 1">Nenhuma Resposta Encontrada</div>
          <div v-else>
            <section-responses
              v-for="section in sections"
              :key="section.id"
              :section="section"
              :sectorsSelected="sectorsSelected"
              :formSends="formSends"
            >
            </section-responses>
          </div>

          <!-- <div v-for="section in sections" :key="section.id">
            <v-card color="basil" style="margin: 16px 0" flat elevation="3">
              <v-card-title class="align-middle">
                <h3>{{ section.name }}</h3>
              </v-card-title>
              <v-card-text>
                <v-checkbox
                  v-model="checkbox"
                  :label="`Agrupar dados da seção`"
                ></v-checkbox>
              </v-card-text>
            </v-card>
            <response-card
              v-for="question in section.questions"
              :key="question.id"
              class="my-4"
              :question="question"
              :sectorsProps="sectorsSelected"
              :disabled="true"
              :formSends="formSends"
            />
          </div> -->
        </div>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import QuestionCard from '@/components/form/questions/QuestionCard';
  // import ResponseCard from '@/components/form/responses/ResponseCard';
  import SectionResponses from '@/components/form/responses/SectionResponses';

  export default {
    components: {
      QuestionCard,
      // ResponseCard,
      SectionResponses,
    },
    data: () => {
      return {
        download: false,
        form: null,
        tab: null,
        questions: [],
        sections: [],
        responsesCount: 0,
        sectorsSelected: {},
        formSendSelected: {},
        sectors: [],
        formSends: [],
      };
    },
    async mounted() {
      this.tab = 'tab-2';
      // await this.loadForm();
      await this.loadFormSends();
    },
    methods: {
      ...mapActions(['fetchForm', 'fetchFormSends', 'resetFormResults']),
      ...mapGetters(['fetchFormResults']),
      back() {
        this.$router.back();
      },
      async loadForm() {
        const { data } = await this.fetchForm({ id: this.$route.params.id });
        this.form = { ...data.form };

        this.sections = this.form.sections;

        this.form.sections.forEach((section) => {
          if (section.questions !== undefined) {
            this.questions.push(...section.questions);
          }
        });

        this.questions.every((question) => {
          if (question.responses !== undefined) {
            this.responsesCount = question.responses.length;
            return false;
          }
          return true;
        });

        // if (this.form.sectors !== undefined) {
        //   this.sectors = this.form.sectors.filter((sector) => {
        //     return sector.status === 'answered';
        //   });

        //   let sector = { name: 'Todos', allSectors: this.sectors };
        //   this.sectors.push(sector);
        //   this.sectorsSelected = sector;
        // }
      },
      async loadFormSends() {
        const { data } = await this.fetchFormSends({
          params: {
            form_id: this.$route.params.id,
          },
        });

        if (data.form_sends.length === 0) {
          this.loadForm();
          return;
        }

        this.formSends = [...data.form_sends];
        this.formSendSelected = this.formSends[0];
        this.updateFormSend();
      },
      updateFormSend() {
        this.form = {};
        this.sections = [];
        this.questions = [];
        this.sectors = [];
        this.responsesCount = 0;

        if (this.formSendSelected.sectors === undefined) {
          return;
        }

        this.form = this.formSendSelected.form;

        this.sections = this.form.sections;

        this.form.sections.forEach((section) => {
          if (section.questions !== undefined) {
            this.questions.push(...section.questions);
          }
        });

        this.sectors = this.formSendSelected.sectors;

        this.questions.every((question) => {
          if (question.responses !== undefined) {
            this.responsesCount = question.responses.length;

            let sectorsIds = [];
            question.responses.every((response) => {
              sectorsIds.push(response.user.sector_id);
              return true;
            });

            this.sectors = this.sectors.filter((sector) => {
              return sectorsIds.includes(sector.id);
            });

            let sector = { name: 'Todos', allSectors: this.sectors };
            this.sectors.push(sector);
            this.sectorsSelected = sector;

            return false;
          }
          return true;
        });
      },
      testData() {
        return [
          {
            header: [
              {
                text: 'ola',
                align: 'start',
                sortable: false,
                value: 'x',
                children: [
                  { text: 'a', value: 'a' },
                  { text: 'b', value: 'b' },
                ],
              },
            ],
            rows: [
              { a: 'oi', b: 'ui' },
              { a: 'f', b: 'l' },
              { a: 'z', b: 'x' },
            ],
          },
        ];
      },
      async createCsvFromGroupedData() {
        const form_results = await this.fetchFormResults();
        let csvRows = [];
        let history_keys = form_results.headers.map((send) => send.value);

        csvRows.push('Seção,Pergunta,Setor,Envio,Resposta');
        let currentLine;
        form_results.forEach((form_result) => {
          currentLine =
            form_result.sectionName + ',' + form_result.questionTitle + ',';
          form_result.rows.forEach((row) => {
            history_keys.forEach((key) => {
              csvRows.push(
                currentLine + ',' + row.sectorName + ',' + key + ',' + row[key],
              );
            });
          });
          currentLine = '';
        });

        return csvRows;
      },
      async createCsvFromSimpleData() {
        const form_results = await this.fetchFormResults();
        let csvRows = [];

        csvRows.push('Seção,Pergunta,Setor,Resposta');
        let currentLine;
        form_results.forEach((form_result) => {
          currentLine =
            form_result.sectionName + ',' + form_result.questionTitle + ',';
          form_result.rows.forEach((row) => {
            csvRows.push(currentLine.concat(row.sectorName + ',' + row.answer));
          });
          currentLine = '';
        });

        return csvRows;
      },
      async downloadAll() {
        let csv_data;
        if (this.formSendSelected.subtitle != 'Todos') {
          csv_data = await this.createCsvFromSimpleData();
        } else {
          csv_data = await this.createCsvFromGroupedData();
        }

        const blob = new Blob([csv_data.join('\n')], { type: 'text/csv' });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');

        a.setAttribute('href', url);

        a.setAttribute('download', this.form.title.concat('.csv'));

        a.click();
      },
    },
    watch: {
      formSendSelected() {
        this.updateFormSend();
      },
    },
  };
</script>

<style scoped></style>
