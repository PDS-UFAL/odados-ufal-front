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
      // await this.loadForm();
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

              // responses = responses.map((response) => ({
              //   ...response,
              //   title: question.title,
              //   question_id: question.id,
              //   sector_id: response.sector_id,
              //   sector_name: this.getSectorNameById(response.sector_id),
              // }));

              // if (
              //   !Array.isArray(this.sectorsSelected) &&
              //   this.sectorsSelected.name !== 'Todos'
              // ) {

              // }
              this.groupedQuestion.responses =
                this.groupedQuestion.responses.concat(responses);
            } else {
              this.questions.push(question);
            }
          });

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

          this.questions.unshift(this.groupedQuestion);
        } else {
          this.questions = this.section.questions.slice();
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
      // getSectorNameById(sectorId) {
      //   if (!Array.isArray(this.sectorsSelected)) {
      //     console.log('ummm');
      //     return this.sectorsSelected.name;
      //   } else if (
      //     Object.prototype.hasOwnProperty.call(this.sectorsSelected, 'name') &&
      //     this.sectorsSelected.name == 'Todos'
      //   ) {
      //     console.log('dosss');
      //     let sect = this.sectorsSelected.allSectors.filter((sector) => {
      //       return sectorId == sector.id;
      //     });

      //     return sect[0].name;
      //   } else {
      //     console.log('tresss');
      //     let sect = this.sectorsSelected.filter((sector) => {
      //       return sectorId == sector.id;
      //     });

      //     console.log(sect);
      //     if (sect.length === 0) {
      //       return '';
      //     } else {
      //       return sect[0].name;
      //     }
      //   }
      // },
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
