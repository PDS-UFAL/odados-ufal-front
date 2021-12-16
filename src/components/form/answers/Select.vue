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
        no-data-text="Nenhuma opção disponível"
        dense
        outlined
      />
    </v-col>
  </v-row>
</template>

<script>
  import rules from '@/mixins/rules';

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
