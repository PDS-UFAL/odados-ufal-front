<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
      </span>

      <v-text-field
        v-model="question.example"
        type="number"
        :rules="[rules.required]"
        suffix="%"
        dense
        outlined
      />
    </v-col>
  </v-row>
</template>

<script>
  import rules from '@/mixins/rules';

  export default {
    name: 'Percent',
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
