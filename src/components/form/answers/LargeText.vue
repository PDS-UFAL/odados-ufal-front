<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
      </span>

      <v-textarea
        v-model="question.example"
        :counter="question.max_char"
        :maxlength="question.max_char"
        :rules="[rules.required]"
        dense
        outlined
        clearable
        auto-grow
      />
    </v-col>
  </v-row>
</template>

<script>
  import rules from '@/mixins/rules';

  export default {
    name: 'LargeText',
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
