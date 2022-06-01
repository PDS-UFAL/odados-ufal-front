const rules = {
  computed: {
    rules() {
      return {
        required: (v) =>
          !this.question.required || !!v || 'Esse campo é obrigatório',

        checkboxRequired: () =>
          !this.question.required ||
          this.response.length > 0 ||
          'Esse campo é obrigatório',

        number: [
          (v) =>
            this.question.min_value === null ||
            (v && v >= parseFloat(this.question.min_value)) ||
            'Valor inserido é menor que o mínimo permitido ' +
              this.question.min_value,
          (v) =>
            this.question.max_value === null ||
            (v && v <= parseFloat(this.question.max_value)) ||
            'Valor inserido é maior que o máximo permitido ' +
              this.question.max_value,
        ],
      };
    },
  },
};

export default rules;
