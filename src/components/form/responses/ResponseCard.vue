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
        ></chart-card>
      </div>
      <div v-show="currentChart.type === 'table'">
        <table-card
          :question="question"
          :sectors="sectors"
          :responses="responses"
          :section="section"
        ></table-card>
      </div>
      <div
        v-show="['bar', 'pie', 'table'].includes(currentChart)"
        v-for="response in responses"
        :key="response.id"
      >
        <p style="background-color: #f8f9fa">
          <b>{{ getSectorNameById(response.user.sector_id) }} :</b>
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
      section: {
        type: String,
        required: true,
      },
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
          if (this.question.type !== 'grouped') {
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

          this.sortSectorsById();
        } else {
          this.sectors = this.sectorsProps;

          if (Array.isArray(this.sectors)) {
            this.sortSectorsById();
          }
        }
      },
      getResponses() {
        if (
          Object.prototype.hasOwnProperty.call(this.sectorsProps, 'name') &&
          this.sectorsProps.name == 'Todos'
        ) {
          this.responses = this.question.responses;
          this.sortResponsesBySectorId();
        } else if (!Array.isArray(this.sectors)) {
          this.responses = this.question.responses.filter((response) => {
            return response.user.sector_id === this.sectors.id;
          });
        } else {
          //TODO consertar filtragem
          this.responses = this.question.responses.filter((response) => {
            return this.sectors.find(
              (sector) => sector.id === response.user.sector_id,
            );
          });
          this.sortResponsesBySectorId();
        }

        this.answers = this.responses.map((response) => response.answer);
      },

      sortResponsesBySectorId() {
        this.responses.sort((a, b) => {
          if (a.user.sector_id > b.user.sector_id) {
            return 1;
          }
          if (a.user.sector_id < b.user.sector_id) {
            return -1;
          }
          return 0;
        });
      },

      sortSectorsById() {
        this.sectors.sort((a, b) => {
          if (a.id > b.id) {
            return 1;
          }
          if (a.id < b.id) {
            return -1;
          }
          return 0;
        });
      },

      getSectorNameById(sectorId) {
        if (!Array.isArray(this.sectors)) {
          return this.sectors.name;
        }
        let sect = this.sectors.filter((sector) => {
          return sectorId == sector.id;
        });
        return sect[0].name;
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
        this.getResponses();
        // this.addFormResult();
      },
    },
  };
</script>
<style>
  .v-text-field.v-text-field--solo .v-input__control {
    max-height: 10px;
  }
</style>
