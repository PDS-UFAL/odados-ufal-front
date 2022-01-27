<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
      </span>

      <v-text-field
        v-model="response"
        :rules="[rules.required, ...rules.number]"
        label="Sua Resposta"
        class="mt-2"
        type="number"
        prefix="R$"
        dense
        outlined
        :readonly="!!response"
      />
    </v-col>
  </v-row>
</template>

<script>
  import rules from '@/mixins/questionRules';

  export default {
    name: 'Money',
    props: {
      question: {
        type: Object,
        required: true,
      },
    },
    mixins: [rules],
    computed: {
      response() {
        return this.question.responses && this.question.responses[0]?.answer;
      },
    },
  };
</script>

<style></style>
