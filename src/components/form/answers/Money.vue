<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
      </span>

      <v-text-field
        v-model="question.example"
        :rules="[rules.required, ...rules.number]"
        type="number"
        prefix="R$"
        dense
        outlined
      />
    </v-col>
  </v-row>
</template>

<script>
  import rules from '@/mixins/rules';

  export default {
    name: 'Money',
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
