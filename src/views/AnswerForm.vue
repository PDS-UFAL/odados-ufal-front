<template>
  <v-container class="px-sm-12">
    <v-row class="pa-0 align-center mt-md-4 mb-8">
      <v-btn @click="back" text fab small class="mr-2">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h3>{{ form.title }}</h3>

      <v-spacer />

      <span class="font-weight-light">{{ relativeTime }}</span>
    </v-row>

    <v-form v-model="valid" ref="form">
      <template v-for="question in getQuestions">
        <component
          :is="questionType(question)"
          :question="question"
          class="mt-2"
          :key="question.id"
        />
      </template>
    </v-form>

    <div class="save-btn mb-8 mb-md-0">
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            color="primary"
            v-bind="attrs"
            v-on="on"
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
      };
    },
    async mounted() {
      if (this.$route.params.id) {
        await this.loadForm();
      }
      if (this.$route.params.sectorId) {
        await this.loadAnswers();
      }
    },
    methods: {
      ...mapActions([
        'fetchForm',
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
      async loadForm() {
        try {
          const { data } = await this.fetchForm({ id: this.$route.params.id });
          this.form = { ...data.form };

          // TODO: Refactor when sections are working
          this.setQuestions(this.form.sections[0].questions);
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

          const payload = {
            responses: this.getQuestions.map((question) => {
              return { answer: question.response, question_id: question.id };
            }),
            form_id: this.$route.params.id,
          };

          await this.createAnswers({ payload });
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
      async loadAnswers() {
        const { data } = await this.fetchAnswersBySector({
          formId: this.$route.params.id,
          sector: this.$route.params.sectorId,
        });
        this.form = { ...data.form };

        this.setQuestions(this.form.sections[0].questions);
      },
    },
    computed: {
      ...mapGetters(['getQuestions']),
      relativeTime() {
        if (!this.form.end_date) return null;

        const info =
          new Date(this.form.end_date) >= new Date() ? 'Fechará' : 'Finalizado';

        return `${info} ${getRelativeTime(
          new Date(this.form.end_date).getTime(),
          'pt-BR',
        )}`;
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
