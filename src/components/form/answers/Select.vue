<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
      </span>

      <v-select
        :items="question.options"
        v-model="question.response"
        :rules="[rules.required]"
        :menu-props="{ 'offset-y': true }"
        label="Sua Resposta"
        class="mt-2"
        dense
        outlined
        no-data-text="Nenhuma opção disponível"
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
  };
</script>

<style></style>
