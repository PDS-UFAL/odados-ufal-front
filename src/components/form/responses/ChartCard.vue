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
      download: {
        type: Boolean,
        required: true,
      },
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
      ...mapActions(['createFormResult', 'resetFormResult']),
      mountedHandler(e, chartContext) {
        console.log(chartContext);
        //     this.updateFormResult();
      },
      updateOptionsChart() {
        if (!Array.isArray(this.sectors)) {
          this.optionsChart = {
            ...this.chartOptions,
            ...{
              labels: [this.sectors.abbreviation],
            },
          };
        } else {
          this.optionsChart = {
            ...this.chartOptions,
            ...{
              labels: this.sectors.map((y) => y.abbreviation),
            },
          };

          // this.optionsChart.labels = this.sectors.map((y) => y.abbreviation);
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

      updateFormResult() {
        if (this.chartType != 'table')
          this.$refs.chart.chart.dataURI().then((uri) => {
            let form_result = {
              id: this.chartType.concat(this.question.id),
              question_id: this.question.id,
              header: this.optionsChart,
              rows: this.seriesChart,
              uri: uri.imgURI,
              question_title: this.question.title,
              type: 'chart',
            };

            this.createFormResult(form_result);
          });
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
      download() {
        if (this.download) this.updateFormResult();
      },
    },
  };
</script>
