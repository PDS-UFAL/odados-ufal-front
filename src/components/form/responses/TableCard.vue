<template>
  <div>
    <v-btn color="secondary" @click="downloadTable">Baixar tabela</v-btn>
    <v-data-table
      :headers="headers"
      :items="rows"
      hide-default-footer
    ></v-data-table>
  </div>
</template>
<script>
  export default {
    props: {
      formSendSelected: {},
      question: {
        type: Object,
        required: true,
      },
      sectors: {
        required: true,
      },
      responses: {
        required: true,
      },
      formSends: {
        required: true,
      },
    },

    data: () => {
      return {
        headers: [
          {
            text: 'Setor(es)',
            align: 'start',
            filterable: false,
            value: 'name',
          },
        ],
        rows: [],
      };
    },
    created() {
      this.updateData();
    },
    watch: {
      question() {
        this.updateData();
      },
      sectors() {
        this.updateData();
      },
      responses() {
        this.updateData();
      },
      formSends() {
        this.updateData();
      },

      // props() {
      //   this.updateData();
      // },
    },
    methods: {
      updateData() {
        if (this.formSends.length > 1 && this.question.type === 'grouped') {
          this.headers = [
            {
              text: this.question.title,
              align: 'start',
              filterable: false,
              value: 'name',
            },
          ];
        } else if (this.formSends.length > 1 && this.sectors.length === 1) {
          this.headers = [
            {
              text: 'Ano(s)',
              align: 'start',
              filterable: false,
              value: 'name',
            },
          ];
        } else {
          this.headers = [
            {
              text: 'Setor(es)',
              align: 'start',
              filterable: false,
              value: 'name',
            },
          ];
        }

        if (this.question.type === 'grouped') {
          if (this.formSends.length > 1) {
            let head = this.formSends.map((formSend) => ({
              text:
                formSend.year.toString() === formSend.subtitle
                  ? formSend.year.toString()
                  : formSend.year + ' - ' + formSend.subtitle,
              value:
                formSend.year.toString() === formSend.subtitle
                  ? formSend.year.toString()
                  : formSend.year + ' - ' + formSend.subtitle,
            }));
            this.headers.push(...head);
          } else {
            this.question.titles.forEach((title) => {
              this.headers.push({ text: title, value: title });
            });
          }
        } else {
          if (this.formSends.length > 1 && this.sectors.length > 1) {
            let head = this.formSends.map((formSend) => ({
              text:
                formSend.year.toString() === formSend.subtitle
                  ? formSend.year.toString()
                  : formSend.year + ' - ' + formSend.subtitle,
              value:
                formSend.year.toString() === formSend.subtitle
                  ? formSend.year.toString()
                  : formSend.year + ' - ' + formSend.subtitle,
            }));
            this.headers.push(...head);
          } else {
            this.headers.push({
              text: this.question.title,
              value: 'answer',
            });
          }
          // this.headers[1].text = this.question.title;
        }
        this.updateRows();
      },
      defaultRowValue(row) {
        this.headers.forEach((header) => {
          row[header.value] = '-';
        });

        return row;
      },
      updateRows() {
        this.rows = [];
        if (this.question.type === 'grouped') {
          if (this.formSends.length > 1) {
            this.question.responseColumns.forEach((responseRow) => {
              let row = {};

              row = this.defaultRowValue(row);

              row = { ...row, name: responseRow[0].title };

              responseRow.forEach((item) => {
                row[item.form_send_name] = item.answer;
              });
              this.rows.push(row);
            });
          } else {
            this.question.responseRows.forEach((responseRow) => {
              let row = {};

              row = this.defaultRowValue(row);

              row = { ...row, name: responseRow[0].title };

              responseRow.forEach((item) => {
                row[item.title] = item.answer;
              });
              this.rows.push(row);
            });
          }
        } else {
          if (this.formSends.length > 1 && this.sectors.length > 1) {
            this.question.responseColumns.forEach((responseRow) => {
              let row = {};

              row = this.defaultRowValue(row);

              row = { ...row, name: responseRow[0].sector_name };

              responseRow.forEach((item) => {
                row[item.form_send_name] = item.answer;
              });
              this.rows.push(row);
            });
          } else {
            this.responses.forEach((response) => {
              if (this.formSends.length > 1) {
                this.rows.push({
                  name: response.form_send_name,
                  answer: response.answer,
                });
              } else {
                this.rows.push({
                  name: response.sector_name,
                  answer: response.answer,
                });
              }
            });
          }
        }
      },
      downloadTable() {
        let csvRows = [];

        let headers = this.headers.map((header) => {
          return '"' + header.text + '"';
        });

        csvRows.push(headers.join(','));

        this.rows.forEach((row) => {
          const values = Object.values(row).map((item) => {
            return '"' + item + '"';
          });
          values.join(',');
          csvRows.push(values);
        });

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');

        a.setAttribute('href', url);

        a.setAttribute('download', this.question.title.concat('.csv'));

        a.click();
      },
    },
  };
</script>
