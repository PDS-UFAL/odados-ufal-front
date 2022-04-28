<template>
  <v-card color="basil" style="margin: 16px 0" flat elevation="3">
    <v-card-title>
      <v-col>
        {{ question.title }}
        <span style="color: red">{{ question.required ? '*' : '' }}</span>
      </v-col>
      <v-col>
        <v-select
          v-model="currentChart"
          :items="chartTypes"
          item-text="name"
          outlined
          return-object
        ></v-select>
      </v-col>
    </v-card-title>
    <v-divider />
    <div v-if="chartQuestionTypes.includes(question.type)">
      <apexchart
        :type="currentChart.type"
        :options="optionsChart"
        :series="seriesChart"
      ></apexchart>
    </div>
    <div v-else v-for="(answer, index) in answers" :key="index">
      <p>{{ answer }}</p>
    </div>
  </v-card>
</template>
<script>
  import VueApexCharts from 'vue-apexcharts';

  export default {
    components: {
      apexchart: VueApexCharts,
    },
    props: {
      question: {
        type: Object,
        required: true,
      },
      sectorsProps: {
        required: true,
      },
    },
    data: () => {
      return {
        responses: [],
        answers: [],
        currentChart: { name: 'Barra', type: 'bar' },
        chartTypes: [
          { name: 'Barra', type: 'bar' },
          { name: 'Pizza', type: 'pie' },
          { name: 'Linha', type: 'line' },
        ],
        optionsChart: {},
        seriesChart: [],
        sectors: [],
        chartQuestionTypes: ['number', 'money', 'percent'],
      };
    },
    created() {
      this.updateSectors().then(() => {
        this.getResponses();
        this.updateOptionsChart();
      });
    },
    methods: {
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

      updateOptionsChart() {
        if (!Array.isArray(this.sectors)) {
          this.optionsChart = {
            labels: [this.sectors.name],
          };
        } else {
          this.optionsChart = {
            labels: this.sectors.map((y) => y.name),
          };
        }
      },

      updateSeriesChart() {
        let values = this.answers;
        if (!Array.isArray(values)) {
          values = [values];
        }

        if (['bar', 'line'].includes(this.currentChart.type)) {
          this.seriesChart = [
            {
              data: values.map(Number),
            },
          ];
        } else {
          this.seriesChart = values.map(Number);
        }
      },
    },
    watch: {
      sectorsProps() {
        this.updateSectors();
      },
      sectors() {
        this.getResponses();
        this.updateOptionsChart();
      },
      answers() {
        this.updateSeriesChart();
      },
      currentChart() {
        this.updateSeriesChart();
      },
    },
  };
</script>
