<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    hide-default-footer
  ></v-data-table>
</template>
<script>
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
          {
            text: '',
            value: 'answer',
          },
        ],
        rows: [],
      };
    },
    created() {
      this.headers[1].text = this.question.title;
      this.atualizeRows();
    },
    methods: {
      atualizeRows() {
        this.responses.forEach((response) => {
          this.rows.push({
            sectorName: this.getSectorNameById(response.user.sector_id),
            answer: response.answer,
          });
        });
      },
      getSectorNameById(sectorId) {
        let sect = this.sectors.filter((sector) => {
          return sectorId == sector.id;
        });
        return sect[0].name;
      },
    },
  };
</script>
