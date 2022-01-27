<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
      </span>

      <div v-for="(option, index) in question.options" :key="index">
        <v-checkbox
          v-model="response"
          :label="option"
          :value="option"
          :rules="[rules.checkboxRequired]"
          :hide-details="!last(index)"
          dense
          :readonly="!!response"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import rules from '@/mixins/questionRules';

  export default {
    name: 'Checkbox',
    props: {
      question: {
        type: Object,
        required: true,
      },
    },
    mixins: [rules],
    mounted() {
      if (this.question.responses && this.question.responses[0]?.answer) {
        this.response = this.question.responses[0]?.answer.split(';@;');
      }
    },
    data: () => {
      return {
        response: [],
      };
    },
    methods: {
      last(index) {
        return index === this.question.options.length - 1;
      },
    },
    watch: {
      response: {
        handler: function (val) {
          this.question.responses[0].answer = val.join(';@;');
        },
        deep: true,
      },
    },
  };
</script>

<style></style>
