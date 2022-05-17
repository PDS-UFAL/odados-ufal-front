<template>
  <apexchart
    :type="chartType"
    :options="optionsChart"
    :series="seriesChart"
  ></apexchart>
</template>

<script>
  import VueApexCharts from 'vue-apexcharts';

  export default {
    components: {
      apexchart: VueApexCharts,
    },
    props: {
      chartType: {
        type: String,
        required: true,
      },
      sectors: {
        required: true,
      },
      answers: {
        required: true,
      },
    },
    data: () => {
      return {
        optionsChart: {},
        seriesChart: [],
      };
    },
    created() {
      this.updateOptionsChart();
      this.updateSeriesChart();
    },
    methods: {
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

        if (['bar', 'line'].includes(this.chartType)) {
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
      sectors() {
        this.updateOptionsChart();
      },
      answers() {
        this.updateSeriesChart();
      },
      chartType() {
        this.updateSeriesChart();
      },
    },
  };
</script>
