<template>
  <div>
    <v-card color="basil" style="margin: 16px 0" flat elevation="3">
      <v-card-title class="align-middle">
        <h3>{{ section.name }}</h3>
      </v-card-title>
      <v-card-text>
        <v-checkbox
          v-model="groupData"
          :label="`Agrupar dados da seção`"
          :disabled="disabledGroup"
        ></v-checkbox>
      </v-card-text>
    </v-card>
    <response-card
      v-for="question in questions"
      :key="question.id"
      class="my-4"
      :question="question"
      :sectorsProps="sectorsSelected"
      :disabled="true"
      :formSends="formSends"
    />
  </div>
</template>

<script>
  import ResponseCard from '@/components/form/responses/ResponseCard';

  export default {
    components: {
      ResponseCard,
    },
    props: {
      section: {
        type: Object,
        required: true,
      },
      sectorsSelected: {
        required: true,
      },
      formSends: {
        required: true,
      },
      years: {
        required: true,
      },
    },
    data: () => {
      return {
        groupData: false,
        questions: [],
        groupedQuestion: {},
        disabledGroup: false,
      };
    },
    async mounted() {
      await this.updateQuestions();
      await this.updateDisabledGroup();
    },
    methods: {
      updateDisabledGroup() {
        if (this.sectorsSelected.length > 1 && this.formSends.length > 1) {
          this.disabledGroup = true;
          this.groupData = false;
          this.updateQuestions();
        } else {
          this.disabledGroup = false;
        }
      },
      updateQuestions() {
        this.questions = [];

        if (this.groupData === true) {
          this.initGroupedQuestion();

          this.groupedQuestion.title = this.section.name;

          this.section.questions.forEach((question) => {
            if (
              question.type === 'number' ||
              question.type === 'percent' ||
              question.type === 'money'
            ) {
              this.groupedQuestion.titles.add(question.title);

              let responses = question.responses.filter((response) => {
                let inFormSends = this.formSends.some((formSend) => {
                  return formSend.id === response.fsend;
                });
                let inSectors = this.sectorsSelected.some((sector) => {
                  return sector.id === response.sector_id;
                });
                return inFormSends && inSectors;
              });

              this.groupedQuestion.responses =
                this.groupedQuestion.responses.concat(responses);
            } else {
              this.questions.push(question);
            }
          });

          if (this.formSends.length > 1) {
            this.groupedQuestion.dataType = 'form_send';
          } else {
            this.groupedQuestion.dataType = 'sector';
          }
          this.updateResponsesRowColumn(this.groupedQuestion.dataType);

          this.questions.unshift(this.groupedQuestion);
        } else {
          this.questions = this.section.questions.slice();
        }
      },
      updateResponsesRowColumn(type) {
        if (type === 'sector') {
          this.groupedQuestion.responseRows =
            this.groupedQuestion.responses.reduce(
              (function (hash) {
                return function (r, o) {
                  if (!hash[o.sector_id]) {
                    hash[o.sector_id] = [];
                    r.push(hash[o.sector_id]);
                  }
                  hash[o.sector_id].push(o);
                  return r;
                };
              })(Object.create(null)),
              [],
            );

          this.groupedQuestion.responseColumns =
            this.groupedQuestion.responses.reduce(
              (function (hash) {
                return function (r, o) {
                  if (!hash[o.title]) {
                    hash[o.title] = [];
                    r.push(hash[o.title]);
                  }
                  hash[o.title].push(o);
                  return r;
                };
              })(Object.create(null)),
              [],
            );
        } else if (type === 'form_send') {
          this.groupedQuestion.responseRows =
            this.groupedQuestion.responses.reduce(
              (function (hash) {
                return function (r, o) {
                  if (!hash[o.fsend]) {
                    hash[o.fsend] = [];
                    r.push(hash[o.fsend]);
                  }
                  hash[o.fsend].push(o);
                  return r;
                };
              })(Object.create(null)),
              [],
            );

          this.groupedQuestion.responseColumns =
            this.groupedQuestion.responses.reduce(
              (function (hash) {
                return function (r, o) {
                  if (!hash[o.title]) {
                    hash[o.title] = [];
                    r.push(hash[o.title]);
                  }
                  hash[o.title].push(o);
                  return r;
                };
              })(Object.create(null)),
              [],
            );
        }
      },
      initGroupedQuestion() {
        this.groupedQuestion = {
          id: 0,
          title: 'Todos',
          type: 'grouped',
          titles: new Set(),
          responses: [],
          max_value: null,
          min_value: null,
        };
      },
    },
    watch: {
      groupData() {
        this.updateQuestions();
      },
      section() {
        this.updateQuestions();
      },
      sectorsSelected() {
        this.updateDisabledGroup();
        this.updateQuestions();
      },
      formSends() {
        this.updateDisabledGroup();
      },
    },
  };
</script>

<style scoped></style>
