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
      section: {
        type: String,
        required: true,
      },
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
    },

    data: () => {
      return {
        headers: [
          {
            text: 'Setor(es)',
            align: 'start',
            filterable: false,
            value: 'sectorName',
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

      // props() {
      //   this.updateData();
      // },
    },
    methods: {
      updateData() {
        this.headers = [
          {
            text: 'Setor(es)',
            align: 'start',
            filterable: false,
            value: 'sectorName',
          },
        ];
        if (this.question.type === 'grouped') {
          this.question.titles.forEach((title) => {
            this.headers.push({ text: title, value: title });
          });
        } else {
          this.headers.push({
            text: this.question.title,
            value: 'answer',
          });
          // this.headers[1].text = this.question.title;
        }
        this.updateRows();
      },
      updateRows() {
        this.rows = [];
        if (this.question.type === 'grouped') {
          this.question.sectorRows.forEach((sectorRow) => {
            let row = {
              sectorName: this.getSectorNameById(sectorRow[0].sector_id),
            };

            sectorRow.forEach((item) => {
              row[item.title] = item.answer;
            });
            this.rows.push(row);
          });
        } else {
          this.responses.forEach((response) => {
            this.rows.push({
              sectorName: this.getSectorNameById(response.user.sector_id),
              answer: response.answer,
            });
            //console.log(this.rows);
          });
        }
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
      downloadTable() {
        let csvRows = [];

        // Ativar if-else abaixo após implementação da tabela com histórico
        // de perguntas
        //if ('Substituir por condição: o header não tenha mais de uma linha') {
        let headers = this.headers.map((header) => header.text);
        csvRows.push(headers.join(','));
        // Caso o header tenha mais de uma linha...
        /*} else {
          [
            'Substituir esse array por array com as linhas do cabeçalho.
            Cada elemento do array deve ser um array onde cada um  dos
            itens é o valor de uma célula da linha',
            Ex.: [['Total'],['Setor(es)', '2020', '2021']]
          ].ForEach((headerRow) => {
            csvRows.push(headerRow.join(','));
          });
        }*/

        this.rows.forEach((row) => {
          const values = Object.values(row).join(',');
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
