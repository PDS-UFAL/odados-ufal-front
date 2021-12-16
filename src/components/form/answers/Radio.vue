<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
      </span>

      <v-radio-group v-model="question.example" :rules="[rules.required]" dense>
        <v-radio
          v-for="(option, index) in question.options"
          :key="index"
          :label="option"
          :value="option"
        />
      </v-radio-group>
    </v-col>
  </v-row>
</template>

<script>
  import rules from '@/mixins/rules';

  export default {
    name: 'Radio',
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
