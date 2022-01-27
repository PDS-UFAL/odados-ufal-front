<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
      </span>

      <v-select
        :items="question.options"
        v-model="response"
        :rules="[rules.required]"
        :menu-props="{ 'offset-y': true }"
        label="Sua Resposta"
        class="mt-2"
        dense
        outlined
        no-data-text="Nenhuma opção disponível"
        :readonly="!!response"
      />
    </v-col>
  </v-row>
</template>

<script>
  import rules from '@/mixins/questionRules';

  export default {
    name: 'Select',
    props: {
      question: {
        type: Object,
        required: true,
      },
    },
    mixins: [rules],
    computed: {
      response: {
        get() {
          return this.question.responses && this.question.responses[0]?.answer;
        },
        set(newVal) {
          this.question.response = newVal;
        },
      },
    },
  };
</script>

<style></style>
