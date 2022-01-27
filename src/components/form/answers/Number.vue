<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
      </span>

      <v-text-field
        v-model="response"
        :min="question.min_value"
        :max="question.max_value"
        :rules="[rules.required, ...rules.number]"
        label="Sua Resposta"
        class="mt-2"
        type="number"
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
    name: 'Number',
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
