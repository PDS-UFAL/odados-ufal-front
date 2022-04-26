<template>
  <v-card color="basil" style="margin: 16px 0" flat elevation="3">
    <v-card-title>{{
      question.title + (question.required ? ' *' : '')
    }}</v-card-title>
    <v-divider />
    <v-card-text> Gráfico </v-card-text>
  </v-card>
</template>
<script>
  export default {
    props: {
      question: {
        type: Object,
        required: true,
      },
      sector: {
        type: Object,
        required: true,
      },
    },
    data: () => {
      return {
        responses: [],
      };
    },
    created() {
      this.getResponses();
    },
    methods: {
      getResponses() {
        if (this.sector.name == 'Todos') {
          this.responses = this.question.responses;
        } else {
          //filtrar por setor
          this.responses = this.responses.filter((response) => {
            return response.user.sector_id === this.sector_id;
          });
        }
      },
    },
    watch: {
      sector() {
        this.getResponses();
      },
    },
  };
</script>
