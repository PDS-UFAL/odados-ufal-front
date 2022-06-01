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
      formSends: {
        required: true,
      },
      answers: {
        required: true,
      },
      question: {
        required: true,
      },
      responses: {
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
        if (this.formSends.length > 1 && this.sectors.length > 1) {
          // this.question.responseColumns
          this.optionsChart = {
            ...this.optionsChart,
            ...{
              labels: this.question.responseColumns[0].map(
                (y) => y.form_send_name,
              ),
            },
          };
        } else {
          this.optionsChart = {
            ...this.optionsChart,
            ...{
              labels: this.responses.map((y) => y.form_send_name),
            },
          };
        }
      },

      updateSeriesChart() {
        this.seriesChart = [];
        if (this.question.type === 'grouped') {
          this.question.responseColumns.forEach((column) => {
            let serieColumn = {};
            serieColumn.name = column[0].title;
            serieColumn.data = [];

            column.forEach((item) => {
              serieColumn.data.push(item.answer);
            });
            this.seriesChart.push(serieColumn);
          });
        } else if (this.formSends.length > 1 && this.sectors.length > 1) {
          this.question.responseColumns.forEach((column) => {
            let serieColumn = {};
            serieColumn.name = column[0].sector_name;
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
        this.updateSeriesChart();
      },
      formSends() {
        this.updateOptionsChart();
        this.updateSeriesChart();
      },
      answers() {
        this.updateSeriesChart();
      },
      responses() {
        this.updateOptionsChart();
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
