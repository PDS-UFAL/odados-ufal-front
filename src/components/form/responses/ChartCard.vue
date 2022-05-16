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
      question: {
        required: true,
      },
    },
    data: () => {
      return {
        optionsChart: {
          chart: {
            type: 'bar',
            height: 350,
            // stacked: true,
            toolbar: {
              show: true,
            },
            zoom: {
              enabled: true,
            },
          },
        },
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
          this.optionsChart.labels = [this.sectors.abbreviation];
        } else {
          this.optionsChart.labels = this.sectors.map((y) => y.abbreviation);
        }
      },

      updateSeriesChart() {
        this.seriesChart = [];
        if (this.question.type === 'grouped') {
          this.question.sectorColumns.forEach((column) => {
            let serieColumn = {};
            serieColumn.name = column[0].title;
            serieColumn.data = [];

            column.forEach((item) => {
              serieColumn.data.push(item.answer);
            });
            this.seriesChart.push(serieColumn);
          });
        } else {
          let values = this.answers;
          if (!Array.isArray(values)) {
            values = [values];
          }

          if (['bar', 'line'].includes(this.chartType)) {
            this.seriesChart = [
              {
                name: 'Valor',
                data: values.map(Number),
              },
            ];
          } else {
            this.seriesChart = values.map(Number);
          }
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
      question() {
        this.updateSeriesChart();
      },
    },
  };
</script>
