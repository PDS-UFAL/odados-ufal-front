<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
      </span>

      <v-radio-group v-model="response" :rules="[rules.required]" dense>
        <v-radio
          v-for="(option, index) in question.options"
          :key="index"
          :label="option"
          :value="option"
          :readonly="!!response"
        />
      </v-radio-group>
    </v-col>
  </v-row>
</template>

<script>
  import rules from '@/mixins/questionRules';

  export default {
    name: 'Radio',
    props: {
      question: {
        type: Object,
        required: true,
      },
    },
    mixins: [rules],
    computed: {
      response() {
        return this.question.responses && this.question.responses[0]?.answer;
      },
    },
  };
</script>

<style></style>
