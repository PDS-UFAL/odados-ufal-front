<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    hide-default-footer
  ></v-data-table>
</template>
<script>
  import { mapActions } from 'vuex';
  export default {
    props: {
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
        this.updateFormResult();
      },
      sectors() {
        this.updateData();
        this.updateFormResult();
      },
      responses() {
        this.updateData();
        this.updateFormResult();
      },

      // props() {
      //   this.updateData();
      // },
    },
    methods: {
      ...mapActions(['createFormResult', 'resetFormResult']),
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
            console.log(this.rows);
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
      updateFormResult() {
        this.resetFormResult();
        let form_result = {
          question_id: this.question.id,
          header: this.headers,
          rows: this.rows,
          question_title: this.question.title,
          type: 'table',
        };

        this.createFormResult(form_result);
      },
    },
  };
</script>
