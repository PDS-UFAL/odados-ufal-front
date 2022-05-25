<template>
  <v-container class="px-sm-12">
    <v-row class="pa-0 align-center mt-md-4 mb-8">
      <v-btn @click="back" text fab small class="mr-2">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h3>{{ form.subtitle }}</h3>

      <v-spacer />

      <span class="font-weight-light">{{ relativeTime }}</span>
    </v-row>

    <v-form v-model="valid" ref="form">
      <v-card
        v-for="(section, i) in form.form.sections"
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
            :canEdit="canEdit"
            :responses="
              sectionsTable[i]
                ? sectionsTable[i].questions[j].responses[0]
                : sectionsTable
            "
          />
        </v-card-text>
      </v-card>
    </v-form>

    <div class="save-btn mb-8 mb-md-0" v-if="canEdit">
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
  import { mapActions, mapGetters } from 'vuex';
  import getRelativeTime from '@/utils/time.js';

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
    name: 'AnswerForm',
    data: () => {
      return {
        form: {},
        loading: false,
        valid: false,
        hasResponse: false,
        sectionsTable: [],
      };
    },
    async mounted() {
      if (this.$route.params.id) {
        await this.loadForm();
        await this.loadSends();
      }
    },
    methods: {
      ...mapActions([
        'fetchFormSend',
        'fetchAnswersBySector',
        'setAlert',
        'setQuestions',
        'createAnswers',
        'fetchFormShowSends',
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
      async loadSends() {
        const { data } = await this.fetchFormShowSends({
          id: this.form.form.id,
        });
        this.sectionsTable = data.form.sections;
      },
      async loadForm() {
        try {
          let response;
          // console.log(this.$route.params.sectorId);
          // console.log(this.getUser?.sector_id);

          if (this.$route.params.sectorId || this.getUser?.sector_id) {
            const sectorId =
              this.$route.params.sectorId != undefined
                ? this.$route.params.sectorId
                : this.getUser?.sector_id;

            // this.hasResponse = true;
            response = await this.fetchAnswersBySector({
              formId: this.$route.params.id,
              sector: sectorId,
            });
            // console.log(response);
          } else {
            // console.log('entrou sem filtro');
            response = await this.fetchFormSend({ id: this.$route.params.id });
          }

          const { data } = response;
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
              this.hasResponse = true;
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
          let sections_questions = this.form.form.sections.map((section) => {
            return section.questions;
          });

          for (let i = 0; i < sections_questions.length; i++) {
            all_questions = all_questions.concat(sections_questions[i]);
          }

          const payload = {
            responses: all_questions.map((question) => {
              return { answer: question.response, question_id: question.id };
            }),
            form_send_id: this.$route.params.id,
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
    computed: {
      ...mapGetters(['getQuestions', 'getUser']),
      relativeTime() {
        if (!this.form.end_date) return null;

        const info =
          new Date(this.form.end_date) >= new Date() ? 'Fechará' : 'Finalizado';

        return `${info} ${getRelativeTime(
          new Date(this.form.end_date).getTime(),
          'pt-BR',
        )}`;
      },
      isAdmin() {
        return this.getUser?.role === 'admin';
      },
      canEdit() {
        const today = new Date();

        return (
          !this.isAdmin &&
          new Date(this.form.start_date) <= today &&
          new Date(this.form.end_date) >= today &&
          !this.hasResponse
        );
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
