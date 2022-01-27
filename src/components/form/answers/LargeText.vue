<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
      </span>

      <v-textarea
        v-model="response"
        :counter="question.max_char"
        :maxlength="question.max_char"
        :rules="[rules.required]"
        label="Sua Resposta"
        class="mt-2"
        dense
        outlined
        clearable="!response"
        auto-grow
        :readonly="!!response"
      />
    </v-col>
  </v-row>
</template>

<script>
  import rules from '@/mixins/questionRules';

  export default {
    name: 'LargeText',
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
