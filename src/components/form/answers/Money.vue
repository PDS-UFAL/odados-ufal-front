<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
        <span style="color: red">{{ question.required ? '*' : '' }}</span>
      </span>
      <div
        style="display: flex; justify-content: start"
        v-if="headers.length && items.length"
      >
        <v-data-table
          :headers="headers"
          :items="items"
          disable-pagination
          hide-default-footer
          dense
          class="elevation-4"
          style="margin: 1rem 0"
        ></v-data-table>
      </div>
      <v-text-field
        v-model="question.response"
        :rules="[rules.required, ...rules.number]"
        :label="getCurrentYear"
        class="mt-2"
        type="number"
        prefix="R$"
        dense
        outlined
        :readonly="!canEdit"
      />
    </v-col>
  </v-row>
</template>

<script>
  import rules from '@/mixins/questionRules';

  export default {
    name: 'Money',
    data: () => {
      return {
        headers: [],
        items: [],
      };
    },
    props: {
      question: {
        type: Object,
        required: true,
      },
      canEdit: {
        type: Boolean,
        default: true,
      },
      responses: {
        type: Array,
      },
    },
    mixins: [rules],
    methods: {
      generateTable() {
        if (this.responses) {
          let historicalNumbers = {};
          this.responses.forEach((response) => {
            this.headers.push({
              text: response.year,
              sortable: false,
              value: String(response.form_send_id),
              width: '6rem',
              class: 'grey--text darken-3',
            });
            historicalNumbers[response.form_send_id] = response.answer;
          });
          this.items.push({ ...historicalNumbers });
        }
      },
    },
    watch: {
      responses: function () {
        this.generateTable();
      },
      question: function () {
        this.generateTable();
      },
    },
    computed: {
      getCurrentYear() {
        return 'Sua Resposta (' + new Date().getFullYear() + ')';
      },
    },
  };
</script>

<style></style>
