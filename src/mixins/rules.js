const rules = {
  computed: {
    rules() {
      return {
        required: (v) =>
          !this.question.required || !!v || 'Esse campo é obrigatório',

        number: [
          (v) =>
            !this.question.min_value ||
            (v && v >= parseFloat(this.question.min_value)) ||
            'Valor inserido é menor que o mínimo permitido',
          (v) =>
            !this.question.max_value ||
            (v && v <= parseFloat(this.question.max_value)) ||
            'Valor inserido é maior que o máximo permitido',
        ],
      };
    },
  },
};

export default rules;
