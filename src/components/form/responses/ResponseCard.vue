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
    <apexchart
      :type="currentChart.type"
      :options="optionsChart"
      :series="seriesChart"
    ></apexchart>
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
      sectors: {
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
        ],
        optionsChart: {},
        seriesChart: [],
      };
    },
    created() {
      this.getResponses();
      this.updateOptionsChart();
    },
    methods: {
      getResponses() {
        if (this.sectors.name == 'Todos') {
          this.responses = this.question.responses;
        } else if (!Array.isArray(this.sectors)) {
          this.responses = this.question.responses.filter((response) => {
            return response.user.sector_id === this.sectors.id;
          });
        } else {
          this.responses = this.question.responses.filter((response) => {
            return this.sectors.find(
              (sector) => sector.id === response.user.sector_id,
            );
          });
        }

        this.answers = this.responses.map((response) => response.answer);
      },

      updateOptionsChart() {
        if (!Array.isArray(this.sectors)) {
          this.optionsChart = {
            xaxis: {
              categories: [this.sectors.name],
            },
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

        console.log('chegou aqui');
        console.log(this.question.title);
        console.log(values);

        if (this.currentChart.type == 'bar') {
          console.log('bar');
          this.seriesChart = [
            {
              data: values.map(Number),
            },
          ];
        } else {
          console.log('outro chart');
          this.seriesChart = values.map(Number);
        }

        console.log(this.seriesChart);
      },
    },
    watch: {
      sectors() {
        this.getResponses();
        this.updateOptionsChart();
      },
      answers() {
        this.updateSeriesChart();
      },
    },
  };
</script>
