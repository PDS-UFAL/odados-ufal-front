<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
        <span style="color: red">{{ question.required ? '*' : '' }}</span>
      </span>

      <div v-for="(option, index) in question.options" :key="option + index">
        <v-checkbox
          v-model="response"
          :label="option"
          :value="option"
          :rules="[rules.checkboxRequired]"
          :hide-details="!last(index)"
          dense
          :readonly="!canEdit"
          :disabled="!canEdit"
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
      canEdit: {
        type: Boolean,
        default: true,
      },
    },
    mixins: [rules],
    mounted() {
      if (this.question.response) {
        this.response = this.question.response.split(';@;');
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
          this.question.response = val.join(';@;');
        },
        deep: true,
      },
    },
  };
</script>

<style></style>
