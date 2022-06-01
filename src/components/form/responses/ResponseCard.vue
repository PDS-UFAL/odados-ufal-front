<template>
  <v-card color="basil" style="margin: 16px 0" flat elevation="3">
    <v-card-title class="align-middle">
      <v-row>
        <v-col cols="12" md="8">
          <p style="font-size: 22px; padding-top: 15px">
            {{ question.title }}
            <span style="color: red">{{ question.required ? '*' : '' }}</span>
          </p>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            label="Tipo de Visualização"
            v-model="currentChart"
            :items="chartTypes"
            item-text="name"
            outlined
            return-object
          ></v-select>
        </v-col>
      </v-row>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <div v-if="['bar', 'pie'].includes(currentChart.type)">
        <chart-card
          :chartType="currentChart.type"
          :sectors="sectors"
          :answers="answers"
          :question="question"
          :formSends="formSends"
          :responses="responses"
        ></chart-card>
      </div>
      <div v-show="currentChart.type === 'table'">
        <table-card
          :question="question"
          :sectors="sectors"
          :responses="responses"
          :formSends="formSends"
        ></table-card>
      </div>
      <div
        v-show="['bar', 'pie', 'table'].includes(currentChart)"
        v-for="response in responses"
        :key="response.id"
      >
        <p style="background-color: #f8f9fa">
          <b>{{ response.sector_name }} :</b>
          {{ response.answer }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
  //import { mapActions } from 'vuex';
  import ChartCard from './ChartCard.vue';
  import TableCard from './TableCard.vue';

  export default {
    components: {
      ChartCard,
      TableCard,
    },
    props: {
      question: {
        type: Object,
        required: true,
      },
      sectorsProps: {
        required: true,
      },
      formSends: {},
    },
    data: () => {
      return {
        responses: [],
        answers: [],
        currentChart: { name: 'Resposta Escrita', type: 'none' },
        chartTypes: [],
        sectors: [],
        chartQuestionTypes: ['number', 'money', 'percent', 'grouped'],
      };
    },
    created() {
      this.setChartTypes();
      this.updateSectors();
      // this.addFormResult();
    },
    methods: {
      //...mapActions(['createFormResult']),
      setChartTypes() {
        if (this.chartQuestionTypes.includes(this.question.type)) {
          this.currentChart = { name: 'Barra', type: 'bar' };
          this.chartTypes = [
            { name: 'Barra', type: 'bar' },
            // { name: 'Pizza', type: 'pie' },
            // { name: 'Linha', type: 'line' },
            { name: 'Tabela', type: 'table' },
            { name: 'Resposta Escrita', type: 'none' },
          ];
          if (
            this.question.type !== 'grouped' &&
            (this.sectors.length === 1 || this.formSends.length === 1)
          ) {
            this.chartTypes.push({ name: 'Pizza', type: 'pie' });
          }
        } else {
          this.currentChart = { name: 'Tabela', type: 'table' };
          this.chartTypes = [
            { name: 'Resposta Escrita', type: 'none' },
            { name: 'Tabela', type: 'table' },
          ];
        }
      },
      updateSectors() {
        if (
          Object.prototype.hasOwnProperty.call(this.sectorsProps, 'name') &&
          this.sectorsProps.name == 'Todos'
        ) {
          this.sectors = this.sectorsProps.allSectors.filter((sector) => {
            return sector.name !== 'Todos';
          });

          // this.sortSectorsById();
        } else {
          this.sectors = this.sectorsProps;

          // if (Array.isArray(this.sectors)) {
          //   this.sortSectorsById();
          // }
        }
      },
      getResponses() {
        this.responses = this.question.responses.filter((response) => {
          let inFormSends = this.formSends.some((formSend) => {
            return formSend.id === response.fsend;
          });
          let inSectors = this.sectors.some((sector) => {
            return sector.id === response.sector_id;
          });
          return inFormSends && inSectors;
        });

        if (this.sectors.length > 1 && this.formSends.length > 1) {
          this.updateResponsesRowColumn('sector_form_send');
        }

        // this.sortResponsesBySectorId();

        this.answers = this.responses.map((response) => response.answer);
      },

      updateResponsesRowColumn(type) {
        if (type === 'sector_form_send') {
          this.question.responseRows = this.responses.reduce(
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

          this.question.responseColumns = this.responses.reduce(
            (function (hash) {
              return function (r, o) {
                if (!hash[o.sector_name]) {
                  hash[o.sector_name] = [];
                  r.push(hash[o.sector_name]);
                }
                hash[o.sector_name].push(o);
                return r;
              };
            })(Object.create(null)),
            [],
          );
        } else if (type === 'sector') {
          this.question.responseRows = this.question.responses.reduce(
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

          this.question.responseColumns = this.question.responses.reduce(
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
          this.question.responseRows = this.question.responses.reduce(
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

          this.question.responseColumns = this.question.responses.reduce(
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
      /*addFormResult() {
        let form_result, results;
        this.chartTypes.forEach((chartType) => {
          if (chartType.type == 'table') {
            results = this.responses;
          } else {
            results = this.answers;
          }
          form_result = {
            id: chartType.type.concat(this.question.id),
            type: chartType.type,
            sectors: this.sectors,
            question: this.question,
            results: results,
          };

          this.createFormResult(form_result);
        });
      },*/
    },
    watch: {
      sectorsProps() {
        this.updateSectors();
        //this.addFormResult();
      },
      sectors() {
        this.setChartTypes();
        this.getResponses();
        // this.addFormResult();
      },
      formSends() {
        this.setChartTypes();
        this.getResponses();
      },
    },
  };
</script>
<style>
  .v-text-field.v-text-field--solo .v-input__control {
    max-height: 10px;
  }
</style>
