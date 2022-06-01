<template>
  <div>
    <v-btn color="secondary" @click="downloadChart">Baixar gráfico</v-btn>
    <apexchart
      ref="chart"
      :type="chartType"
      :options="optionsChart"
      :series="seriesChart"
    ></apexchart>
  </div>
</template>

<script>
  import VueApexCharts from 'vue-apexcharts';
  import { mapActions } from 'vuex';

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
      ...mapActions(['createFormResult', 'resetFormResult']),
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

      downloadChart() {
        this.$refs.chart.chart.dataURI().then((uri) => {
          var hiddenElement = document.createElement('a');

          hiddenElement.href = uri.imgURI;
          hiddenElement.target = '_blank';
          hiddenElement.download = this.question.title.concat('.png');
          hiddenElement.click();
        });
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
