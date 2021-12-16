<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
      </span>

      <v-checkbox
        v-for="(option, index) in question.options"
        :key="index"
        v-model="question.checkboxExample"
        :label="option"
        :value="option"
        :rules="[rules.required]"
        dense
        hide-details
      />
    </v-col>
  </v-row>
</template>

<script>
  import rules from '@/mixins/rules';

  export default {
    name: 'Checkbox',
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
