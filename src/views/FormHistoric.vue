<template>
  <v-container class="px-sm-12">
    <v-row class="pa-0 align-center mt-md-4 mb-8">
      <v-btn @click="back" text fab small class="mr-2">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h3>Inserir histórico</h3>
    </v-row>

    <v-form v-model="valid" ref="form" style="margin-bottom: 4rem">
      <v-row style="padding-top: 20px">
        <v-select
          :items="this.forms"
          v-on:change="this.changeSelectedForm"
          :rules="requiredRule"
          :menu-props="{ 'offset-y': true }"
          label="Selecionar Fomulário"
          dense
          outlined
          item-text="title"
          return-object
          no-data-text="Nenhuma opção disponível"
          :readonly="loading"
        />
        <v-select
          :items="this.sectors"
          v-on:change="this.changeSelectedSector"
          :rules="requiredRule"
          :menu-props="{ 'offset-y': true }"
          label="Selecionar Setor"
          dense
          outlined
          item-text="name"
          return-object
          no-data-text="Nenhuma opção disponível"
          :readonly="loading"
          style="margin-left: 4rem"
        />
        <v-text-field
          v-model="date"
          :rules="requiredRule"
          label="Data"
          type="number"
          dense
          outlined
          style="margin-left: 4rem"
        />
      </v-row>
    </v-form>

    <v-form v-model="valid" ref="selectedForm" v-if="selectedForm">
      <v-card
        v-for="(section, i) in selectedForm.sections"
        :key="section.id"
        class="mb-3"
      >
        <v-card-title> {{ section.name }}</v-card-title>
        <v-card-text
          style="margin-top: 1rem"
          v-for="(question, j) in section.questions"
          :key="question.id"
        >
          <component
            :is="questionType(question)"
            :question="question"
            :key="question.id"
            :canEdit="true"
            :responses="
              sectionsTable && sectionsTable[i] && sectionsTable[i].questions[j]
                ? sectionsTable[i].questions[j].responses[0]
                : sectionsTable
            "
          />
        </v-card-text>
      </v-card>
    </v-form>

    <div class="save-btn mb-8 mb-md-0" v-if="selectedForm">
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            color="primary"
            v-bind="attrs"
            v-on="on"
            :loading="loading"
            @click="saveResponse"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </template>
        <span>Salvar resposta</span>
      </v-tooltip>
    </div>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex';

  import ShortText from '@/components/form/answers/ShortText';
  import LargeText from '@/components/form/answers/LargeText';
  import Number from '@/components/form/answers/Number';
  import Money from '@/components/form/answers/Money';
  import Percent from '@/components/form/answers/Percent';
  // import File from '@/components/form/answers/File';
  import Select from '@/components/form/answers/Select';
  import Checkbox from '@/components/form/answers/Checkbox';
  import Radio from '@/components/form/answers/Radio';

  export default {
    name: 'FormHistoric',
    data: () => {
      return {
        loading: false,
        date: null,
        forms: [],
        form: null,
        valid: false,
        sectors: [],
        selectedForm: null,
        selectedSector: '',
        sectionsTable: [],
        requiredRule: [(v) => !!v || 'Esse campo é obrigatório'],
      };
    },
    async mounted() {
      await this.loadForms();
    },
    methods: {
      ...mapActions([
        'fetchForm',
        'fetchForms',
        'fetchFormSend',
        'fetchFormShowSends',
        'fetchAnswersBySector',
        'setAlert',
        'setQuestions',
        'createAnswers',
      ]),
      back() {
        this.$router.back();
      },
      questionType(question) {
        return {
          'short-text': ShortText,
          'large-text': LargeText,
          number: Number,
          money: Money,
          percent: Percent,
          // file: File,
          select: Select,
          checkbox: Checkbox,
          radio: Radio,
        }[question.type];
      },
      async loadSends(id) {
        const { data } = await this.fetchFormShowSends({
          id: id,
        });
        this.sectionsTable = data.form.sections;
      },
      async loadForms() {
        this.fetchForms({ params: this.params }).then((value) => {
          this.forms = value.data.forms;
        });
        this.forms = ['Carregando...'];
      },
      async loadSectors(id) {
        this.sectors = ['Carregando...'];
        const { data } = await this.fetchForm({ id: id });
        this.sectors = data.form.sectors;
      },
      changeSelectedForm(item) {
        this.selectedForm = item;
        this.loadSectors(item.id);
        this.loadForm();
        this.loadSends(item.id);
      },
      changeSelectedSector(item) {
        this.selectedSector = item;
      },
      async loadForm() {
        try {
          const { data } = await this.fetchFormSend({
            id: this.selectedForm.id,
          });
          this.form = { ...data.form_send };

          // TODO: Refactor when sections are working
          let all_questions = [];
          let sections_questions = data.form_send.form.sections.map(
            (section) => {
              return section.questions;
            },
          );

          for (let i = 0; i < sections_questions.length; i++) {
            all_questions = all_questions.concat(sections_questions[i]);
          }
          const questions = all_questions.map((question) => {
            if (question.responses?.length > 0) {
              //this.hasResponse = true;
              return {
                ...question,
                response: question.responses[0].answer,
              };
            }

            return { ...question };
          });
          this.setQuestions(questions);
        } catch (err) {
          if (err.response?.status === 404) {
            this.$router.push({ name: 'Home' });
          }
        }
      },
      validateForm() {
        this.$refs.form.validate();

        if (!this.valid) {
          throw {
            response: {
              data: {
                error:
                  'Não foi possível salvar a resposta. Algum campo está inválido',
              },
            },
          };
        }
      },
      async saveResponse() {
        try {
          this.loading = true;
          this.validateForm();

          //TODO: Refactor question acquisition
          let all_questions = [];
          let sections_questions = this.selectedForm.sections.map((section) => {
            return section.questions;
          });

          for (let i = 0; i < sections_questions.length; i++) {
            all_questions = all_questions.concat(sections_questions[i]);
          }

          const payload = {
            responses: all_questions.map((question) => {
              return { answer: question.response, question_id: question.id };
            }),
            form_send_id: this.selectedSector.id,
          };

          await this.createAnswers({ payload });

          this.setAlert({
            alertMessage: 'Resposta enviada com sucesso.',
            alertColor: 'green',
          });
          this.$router.push({ name: 'Home' });
        } catch (err) {
          this.setAlert({
            alertMessage:
              err.response?.data.error ||
              'Occorreu um erro ao tentar salvar a resposta.',
            alertColor: 'red',
          });
        } finally {
          this.loading = false;
        }
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
