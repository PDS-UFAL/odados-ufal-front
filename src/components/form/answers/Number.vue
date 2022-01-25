<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
      </span>

      <v-text-field
        v-model="question.response"
        :min="question.min_value"
        :max="question.max_value"
        :rules="[rules.required, ...rules.number]"
        label="Sua Resposta"
        class="mt-2"
        type="number"
        dense
        outlined
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
  };
</script>

<style></style>
